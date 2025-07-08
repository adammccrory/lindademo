
export enum RecurringType {
  NONE = 'None',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  ANNUALLY = 'Annually',
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'Medical' | 'Passport' | 'Other';
  uploadedAt: Date;
}

export interface Appointment {
  id: string;
  title: string;
  date: Date;
  recurring: RecurringType;
}

export interface Task {
  id: string;
  description: string;
  dueDate: Date;
  completed: boolean;
}

export interface Horse {
  id: string;
  name: string;
  stableId: string;
  owners: Owner[];
  appointments: Appointment[];
  tasks: Task[];
  attachments: Attachment[];
  imageUrl: string;
}

export interface Stable {
  id: string;
  name: string;
  location: string;
}

export interface WhatsAppMessage {
  id: string;
  from: string; // Phone number
  text: string;
  timestamp: Date;
}

export interface ParsedMessageAction {
  horseName?: string;
  ownerName?: string;
  actionType: 'APPOINTMENT' | 'TASK' | 'QUERY';
  details: string;
  date?: string; // e.g., "2024-08-15T14:00:00"
}
