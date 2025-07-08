
import React, { useState } from 'react';
import { Horse, Stable, Task, Appointment, Attachment, RecurringType, Owner } from '../types';
import { ArrowLeftIcon, CalendarIcon, CheckCircleIcon, PaperclipIcon, UserGroupIcon, PlusCircleIcon } from './Icons';

type Tab = 'appointments' | 'tasks' | 'attachments';

const DetailPill: React.FC<{ icon: React.ReactNode, label: string, value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex flex-col bg-gray-800/70 p-4 rounded-lg">
        <div className="flex items-center text-sm text-gray-400 mb-1">
            {icon}
            <span className="ml-2">{label}</span>
        </div>
        <div className="text-lg font-semibold text-white">{value}</div>
    </div>
);

const TabButton: React.FC<{ label:string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
        {label}
    </button>
);


const HorseDetail: React.FC<{
  horse: Horse;
  stable?: Stable;
  onBack: () => void;
  onAddTask: (horseId: string, task: Omit<Task, 'id' | 'completed'>) => void;
  onAddAppointment: (horseId: string, appt: Omit<Appointment, 'id'>) => void;
}> = ({ horse, stable, onBack, onAddTask, onAddAppointment }) => {
  const [activeTab, setActiveTab] = useState<Tab>('appointments');

  const formatDate = (date: Date) => date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <header className="mb-6">
        <button onClick={onBack} className="flex items-center text-indigo-400 hover:text-indigo-300 transition mb-4">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row md:items-center">
            <img src={horse.imageUrl} alt={horse.name} className="w-32 h-32 rounded-full object-cover border-4 border-gray-700" />
            <div className="md:ml-6 mt-4 md:mt-0">
                <h1 className="text-4xl font-bold text-white">{horse.name}</h1>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailPill icon={<UserGroupIcon className="w-4 h-4" />} label="Owner(s)" value={horse.owners.map(o => o.name).join(', ')} />
                    <DetailPill icon={<CalendarIcon className="w-4 h-4" />} label="Stable" value={stable?.name || 'N/A'} />
                    <DetailPill icon={<PaperclipIcon className="w-4 h-4" />} label="Attachments" value={horse.attachments.length} />
                </div>
            </div>
        </div>
      </header>
      
      <div className="border-b border-gray-700 mb-6">
        <div className="flex space-x-4">
            <TabButton label="Appointments" isActive={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
            <TabButton label="Tasks" isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
            <TabButton label="Attachments" isActive={activeTab === 'attachments'} onClick={() => setActiveTab('attachments')} />
        </div>
      </div>

      <div className="flex-grow bg-gray-800/50 rounded-lg p-6">
        {/* Placeholder for adding new items */}
        <div className="flex justify-end mb-4">
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                <PlusCircleIcon className="w-5 h-5 mr-2"/>
                Add New {activeTab.slice(0, -1)}
            </button>
        </div>
        {activeTab === 'appointments' && (
            <ul className="space-y-4">
                {horse.appointments.map(apt => (
                    <li key={apt.id} className="bg-gray-700/80 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-white">{apt.title}</p>
                            <p className="text-sm text-gray-400">{formatDate(apt.date)}</p>
                        </div>
                        {apt.recurring !== RecurringType.NONE && <span className="text-xs bg-indigo-500/50 text-indigo-200 px-2 py-1 rounded-full">{apt.recurring}</span>}
                    </li>
                ))}
                {horse.appointments.length === 0 && <p className="text-gray-500 text-center py-4">No appointments scheduled.</p>}
            </ul>
        )}
        {activeTab === 'tasks' && (
             <ul className="space-y-4">
                {horse.tasks.map(task => (
                    <li key={task.id} className={`bg-gray-700/80 p-4 rounded-lg flex items-center transition ${task.completed ? 'opacity-50' : ''}`}>
                        <CheckCircleIcon className={`w-6 h-6 mr-4 flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-500'}`} />
                        <div className="flex-grow">
                            <p className={`font-semibold text-white ${task.completed ? 'line-through' : ''}`}>{task.description}</p>
                            <p className="text-sm text-gray-400">Due: {formatDate(task.dueDate)}</p>
                        </div>
                    </li>
                ))}
                {horse.tasks.length === 0 && <p className="text-gray-500 text-center py-4">No tasks found.</p>}
            </ul>
        )}
        {activeTab === 'attachments' && (
            <ul className="space-y-4">
                {horse.attachments.map(att => (
                    <li key={att.id} className="bg-gray-700/80 p-4 rounded-lg flex items-center">
                        <PaperclipIcon className="w-5 h-5 text-gray-400 mr-4" />
                        <div className="flex-grow">
                            <a href={att.url} className="font-semibold text-indigo-400 hover:underline">{att.name}</a>
                            <p className="text-sm text-gray-500">Type: {att.type} | Uploaded: {formatDate(att.uploadedAt)}</p>
                        </div>
                    </li>
                ))}
                {horse.attachments.length === 0 && <p className="text-gray-500 text-center py-4">No attachments available.</p>}
            </ul>
        )}
      </div>
    </div>
  );
};

export default HorseDetail;
