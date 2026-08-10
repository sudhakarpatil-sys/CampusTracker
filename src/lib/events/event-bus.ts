import { EventEmitter } from 'events';

export type AcademicEventType =
  | 'AttendanceUpdated'
  | 'ResultsPublished'
  | 'MarksUpdated'
  | 'TimetableChanged'
  | 'AssignmentCreated'
  | 'NotesUploaded'
  | 'AnnouncementPublished'
  | 'StudentAdded'
  | 'StudentGraduated'
  | 'FacultyAssigned'
  | 'DepartmentChanged'
  | 'AcademicCalendarUpdated'
  | 'SyncJobCompleted';

export interface AcademicEventEnvelope<T = any> {
  eventId: string;
  eventType: AcademicEventType;
  institutionId: string;
  timestamp: string;
  triggeredBy: string;
  payload: T;
}

type EventCallback<T = any> = (envelope: AcademicEventEnvelope<T>) => void | Promise<void>;

class AcademicEventBusImpl {
  private emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(50);
  }

  public publish<T = any>(
    eventType: AcademicEventType,
    institutionId: string,
    payload: T,
    triggeredBy = 'sync_engine'
  ): AcademicEventEnvelope<T> {
    const envelope: AcademicEventEnvelope<T> = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      eventType,
      institutionId,
      timestamp: new Date().toISOString(),
      triggeredBy,
      payload,
    };

    // Emit typed event & global wildcard event
    this.emitter.emit(eventType, envelope);
    this.emitter.emit('*', envelope);

    return envelope;
  }

  public subscribe<T = any>(eventType: AcademicEventType | '*', callback: EventCallback<T>): () => void {
    const listener = (envelope: AcademicEventEnvelope<T>) => {
      try {
        callback(envelope);
      } catch (err) {
        console.error(`[AcademicEventBus] Error handling event ${envelope.eventType}:`, err);
      }
    };

    this.emitter.on(eventType, listener);
    return () => {
      this.emitter.off(eventType, listener);
    };
  }
}

export const AcademicEventBus = new AcademicEventBusImpl();
