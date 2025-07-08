
import { Stable, Owner, Horse, WhatsAppMessage, RecurringType } from './types';

export const OWNERS: Owner[] = [
  { id: 'owner-1', name: 'Alice Johnson', phone: '+15551234567' },
  { id: 'owner-2', name: 'Bob Williams', phone: '+15557654321' },
  { id: 'owner-3', name: 'Charlie Brown', phone: '+15559876543' },
];

export const STABLES: Stable[] = [
  { id: 'stable-1', name: 'Sunrise Meadows', location: 'Willow Creek' },
  { id: 'stable-2', name: 'Oakhaven Equestrian', location: 'Maple Ridge' },
];

export const HORSES: Horse[] = [
  {
    id: 'horse-1',
    name: 'Comet',
    stableId: 'stable-1',
    owners: [OWNERS[0]],
    appointments: [
      { id: 'apt-1', title: 'Vet Check-up', date: new Date(new Date().setDate(new Date().getDate() + 10)), recurring: RecurringType.ANNUALLY },
      { id: 'apt-2', title: 'Farrier Visit', date: new Date(new Date().setDate(new Date().getDate() - 5)), recurring: RecurringType.MONTHLY },
    ],
    tasks: [
      { id: 'task-1', description: 'Administer dewormer', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), completed: false },
      { id: 'task-2', description: 'Check blanket fit', dueDate: new Date(new Date().setDate(new Date().getDate() - 1)), completed: true },
    ],
    attachments: [
      { id: 'att-1', name: 'Coggins_Test_2023.pdf', url: '#', type: 'Medical', uploadedAt: new Date('2023-09-15') },
      { id: 'att-2', name: 'Digital_Passport.pdf', url: '#', type: 'Passport', uploadedAt: new Date('2023-01-20') },
    ],
    imageUrl: 'https://picsum.photos/seed/Comet/400/300',
  },
  {
    id: 'horse-2',
    name: 'Stardust',
    stableId: 'stable-1',
    owners: [OWNERS[1], OWNERS[2]],
    appointments: [],
    tasks: [
      { id: 'task-3', description: 'Practice dressage routine', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)), completed: false },
    ],
    attachments: [],
    imageUrl: 'https://picsum.photos/seed/Stardust/400/300',
  },
  {
    id: 'horse-3',
    name: 'Mustang',
    stableId: 'stable-2',
    owners: [OWNERS[2]],
    appointments: [
      { id: 'apt-3', title: 'Dental Floating', date: new Date(new Date().setDate(new Date().getDate() + 30)), recurring: RecurringType.ANNUALLY },
    ],
    tasks: [],
    attachments: [
        { id: 'att-3', name: 'Vet_Report_Jan24.pdf', url: '#', type: 'Medical', uploadedAt: new Date('2024-01-18') },
    ],
    imageUrl: 'https://picsum.photos/seed/Mustang/400/300',
  },
];

export const WHATSAPP_MESSAGES: WhatsAppMessage[] = [
    { id: 'msg-1', from: '+15551234567', text: 'Hi, can I book a vet appointment for Comet for next Tuesday afternoon?', timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000) },
    { id: 'msg-2', from: '+15557654321', text: "Just a reminder to schedule Stardust's grooming for this weekend.", timestamp: new Date(new Date().getTime() - 5 * 60 * 60 * 1000) },
    { id: 'msg-3', from: '+15559876543', text: 'Hey there! Could you add a task for Mustang to get his new saddle fitted tomorrow? Thanks!', timestamp: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) },
    { id: 'msg-4', from: '+15550001111', text: 'Hi, I was wondering about boarding costs?', timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) },
];
