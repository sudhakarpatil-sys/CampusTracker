import { BaseConnector, HealthCheckResult } from './base-connector';
import { ConnectorType, RawSyncRecord } from '@/types/sync';

export interface ExcelConfig {
  fileBuffer?: ArrayBuffer | Buffer;
  fileUrl?: string;
  sheetName?: string;
}

export class ExcelConnector extends BaseConnector {
  readonly connectorType: ConnectorType = 'excel';

  public async healthCheck(config: ExcelConfig): Promise<HealthCheckResult> {
    if (!config.fileBuffer && !config.fileUrl) {
      return {
        isHealthy: false,
        status: 'DISCONNECTED',
        errorMessage: 'Missing fileBuffer or fileUrl for Excel connector',
      };
    }
    return {
      isHealthy: true,
      status: 'CONNECTED',
    };
  }

  public async fetchData(config: ExcelConfig): Promise<RawSyncRecord[]> {
    let csvContent = '';
    if (config.fileUrl) {
      const res = await fetch(config.fileUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch Excel file from URL. Status: ${res.status}`);
      }
      csvContent = await res.text();
    } else {
      throw new Error('Direct fileBuffer parsing requires excel parser instance or S3 buffer URL');
    }

    return this.parseCsvText(csvContent);
  }

  private parseCsvText(csvText: string): RawSyncRecord[] {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [];

    const firstLine = lines[0];
    if (!firstLine) return [];

    const headers = firstLine.split(',').map((h) => h.replace(/^"|"$/g, '').trim());
    const records: RawSyncRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      const values = line.split(',').map((v) => v.replace(/^"|"$/g, '').trim());
      const rowData: Record<string, any> = {};

      headers.forEach((header, index) => {
        if (header) {
          const val = values[index];
          rowData[header] = val !== undefined ? val : '';
        }
      });

      records.push({
        sourceRowNumber: i + 1,
        data: rowData,
      });
    }

    return records;
  }
}
