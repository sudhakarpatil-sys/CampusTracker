import { BaseConnector, HealthCheckResult } from './base-connector';
import { ConnectorType, RawSyncRecord } from '@/types/sync';

export interface GoogleSheetsConfig {
  sheetUrl?: string;
  spreadsheetId?: string;
  gid?: string;
  worksheetName?: string;
  headerRowIndex?: number;
  dataStartRowIndex?: number;
}

export class SheetConnector extends BaseConnector {
  readonly connectorType: ConnectorType = 'google_sheets';

  /**
   * Extracts Google Spreadsheet ID from a public view-only shareable URL
   */
  public extractSpreadsheetId(sheetUrl: string): { spreadsheetId: string; gid: string } | null {
    try {
      const urlObj = new URL(sheetUrl);
      const pathSegments = urlObj.pathname.split('/');
      const dIndex = pathSegments.indexOf('d');
      if (dIndex === -1 || !pathSegments[dIndex + 1]) {
        return null;
      }
      const spreadsheetId = pathSegments[dIndex + 1];
      if (!spreadsheetId) return null;
      const gid = urlObj.searchParams.get('gid') || '0';
      return { spreadsheetId, gid };
    } catch {
      return null;
    }
  }

  public async healthCheck(config: GoogleSheetsConfig): Promise<HealthCheckResult> {
    if (!config.sheetUrl && !config.spreadsheetId) {
      return {
        isHealthy: false,
        status: 'DISCONNECTED',
        errorMessage: 'Missing sheetUrl or spreadsheetId in Google Sheets configuration',
      };
    }

    const parsed = config.sheetUrl ? this.extractSpreadsheetId(config.sheetUrl) : null;
    const spreadsheetId = parsed?.spreadsheetId || config.spreadsheetId;
    const gid = parsed?.gid || config.gid || '0';

    if (!spreadsheetId) {
      return {
        isHealthy: false,
        status: 'SHEET_NOT_FOUND',
        errorMessage: 'Invalid Google Sheets URL format',
      };
    }

    const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

    try {
      const startTime = Date.now();
      const res = await fetch(exportUrl, { method: 'HEAD' });
      const latencyMs = Date.now() - startTime;

      if (!res.ok && res.status !== 405) {
        let status: HealthCheckResult['status'] = 'NETWORK_ERROR';
        if (res.status === 401 || res.status === 403) status = 'PERMISSION_DENIED';
        if (res.status === 404) status = 'SHEET_NOT_FOUND';
        if (res.status === 429) status = 'RATE_LIMITED';

        return {
          isHealthy: false,
          status,
          latencyMs,
          errorMessage: `Google Sheet endpoint returned HTTP ${res.status}`,
        };
      }

      return {
        isHealthy: true,
        status: 'CONNECTED',
        latencyMs,
        metadata: { spreadsheetId, gid, exportUrl },
      };
    } catch (err: any) {
      return {
        isHealthy: false,
        status: 'NETWORK_ERROR',
        errorMessage: `Connection failed: ${err.message || 'Network error'}`,
      };
    }
  }

  public async fetchData(config: GoogleSheetsConfig): Promise<RawSyncRecord[]> {
    const parsed = config.sheetUrl ? this.extractSpreadsheetId(config.sheetUrl) : null;
    const spreadsheetId = parsed?.spreadsheetId || config.spreadsheetId;
    const gid = parsed?.gid || config.gid || '0';

    if (!spreadsheetId) {
      throw new Error('Invalid Google Sheets configuration: missing spreadsheet ID');
    }

    const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    const res = await fetch(exportUrl);
    if (!res.ok) {
      throw new Error(`Failed to download Google Sheet CSV export. Status: ${res.status}`);
    }

    const csvText = await res.text();
    const headerRowOffset = (config.headerRowIndex || 1) - 1;
    const dataStartOffset = (config.dataStartRowIndex || 2) - 1;

    return this.parseCsvToRawRecords(csvText, headerRowOffset, dataStartOffset);
  }

  private parseCsvToRawRecords(csvText: string, headerRowOffset: number, dataStartOffset: number): RawSyncRecord[] {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length <= headerRowOffset) return [];

    const headerLine = lines[headerRowOffset];
    if (!headerLine) return [];

    const headers = this.parseCsvRow(headerLine);
    const records: RawSyncRecord[] = [];

    for (let i = dataStartOffset; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      const values = this.parseCsvRow(line);
      const rowData: Record<string, any> = {};

      headers.forEach((header, index) => {
        const cleanHeader = header ? header.trim() : '';
        if (cleanHeader) {
          const val = values[index];
          rowData[cleanHeader] = val ? val.trim() : '';
        }
      });

      records.push({
        sourceRowNumber: i + 1,
        data: rowData,
      });
    }

    return records;
  }

  private parseCsvRow(rowText: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < rowText.length; i++) {
      const char = rowText[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }
}
