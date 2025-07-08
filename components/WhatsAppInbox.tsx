
import React, { useState } from 'react';
import { WhatsAppMessage, Horse, Owner, ParsedMessageAction, Appointment, Task, RecurringType } from '../types';
import { parseWhatsAppMessage } from '../services/geminiService';
import { SparklesIcon, CalendarIcon, CheckCircleIcon, MailIcon } from './Icons';

interface WhatsAppInboxProps {
  messages: WhatsAppMessage[];
  horses: Horse[];
  owners: Owner[];
  onAddTask: (horseId: string, task: Omit<Task, 'id' | 'completed'>) => void;
  onAddAppointment: (horseId: string, appt: Omit<Appointment, 'id'>) => void;
  onMessageActioned: (messageId: string) => void;
}

const MessageItem: React.FC<{
    message: WhatsAppMessage;
    horses: Horse[];
    owners: Owner[];
    onAddTask: WhatsAppInboxProps['onAddTask'];
    onAddAppointment: WhatsAppInboxProps['onAddAppointment'];
    onMessageActioned: WhatsAppInboxProps['onMessageActioned'];
}> = ({ message, horses, owners, onAddTask, onAddAppointment, onMessageActioned }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsedAction, setParsedAction] = useState<ParsedMessageAction | null>(null);

    const handleReview = async () => {
        setIsLoading(true);
        setError(null);
        setParsedAction(null);
        try {
            const result = await parseWhatsAppMessage(message.text, horses, owners);
            setParsedAction(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCreateAction = () => {
        if (!parsedAction || !parsedAction.horseName) {
            alert("Cannot create action without a specified horse.");
            return;
        }
        const targetHorse = horses.find(h => h.name === parsedAction.horseName);
        if (!targetHorse) {
             alert(`Horse "${parsedAction.horseName}" not found.`);
             return;
        }

        const newDate = parsedAction.date ? new Date(parsedAction.date) : new Date();

        if (parsedAction.actionType === 'APPOINTMENT') {
            onAddAppointment(targetHorse.id, {
                title: parsedAction.details,
                date: newDate,
                recurring: RecurringType.NONE,
            });
        } else if (parsedAction.actionType === 'TASK') {
            onAddTask(targetHorse.id, {
                description: parsedAction.details,
                dueDate: newDate,
            });
        }
        alert(`Action created for ${targetHorse.name}!`);
        onMessageActioned(message.id);
    };

    const sender = owners.find(o => o.phone === message.from);

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-white">{sender?.name || message.from}</p>
                    <p className="text-sm text-gray-400">{sender ? message.from : 'Unknown Number'}</p>
                </div>
                <p className="text-xs text-gray-500">{message.timestamp.toLocaleString()}</p>
            </div>
            <p className="my-3 text-gray-300">{message.text}</p>
            
            {!parsedAction && (
                <button 
                    onClick={handleReview} 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed transition"
                >
                    <SparklesIcon className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Analyzing...' : 'Review with AI'}
                </button>
            )}

            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

            {parsedAction && (
                <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-indigo-400 flex items-center"><SparklesIcon className="w-5 h-5 mr-2" /> AI Analysis</h4>
                    <div className="mt-2 space-y-2 text-sm">
                        <p><strong className="text-gray-400">Horse:</strong> {parsedAction.horseName || 'Not identified'}</p>
                        <p><strong className="text-gray-400">Action:</strong> {parsedAction.actionType}</p>
                        <p><strong className="text-gray-400">Details:</strong> {parsedAction.details}</p>
                        {parsedAction.date && <p><strong className="text-gray-400">Date:</strong> {new Date(parsedAction.date).toLocaleString()}</p>}
                    </div>
                    <div className="mt-4 flex space-x-2">
                         <button 
                            onClick={handleCreateAction}
                            disabled={!parsedAction.horseName}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition text-sm"
                         >
                            {parsedAction.actionType === 'APPOINTMENT' ? <CalendarIcon className="w-4 h-4 mr-2"/> : <CheckCircleIcon className="w-4 h-4 mr-2" />}
                            Create {parsedAction.actionType}
                         </button>
                         <button 
                            onClick={() => onMessageActioned(message.id)}
                            className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-sm">
                            Ignore
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


const WhatsAppInbox: React.FC<WhatsAppInboxProps> = ({ messages, horses, owners, onAddTask, onAddAppointment, onMessageActioned }) => {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">WhatsApp Inbox</h1>
        <p className="mt-2 text-lg text-gray-400">Review incoming requests and let AI help you organize.</p>
      </header>
      {messages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map(msg => (
                <MessageItem 
                    key={msg.id} 
                    message={msg} 
                    horses={horses} 
                    owners={owners}
                    onAddTask={onAddTask}
                    onAddAppointment={onAddAppointment}
                    onMessageActioned={onMessageActioned}
                />
            ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800/50 rounded-lg">
            <MailIcon className="mx-auto w-12 h-12 text-gray-600"/>
            <h3 className="mt-4 text-xl font-semibold text-white">All Caught Up!</h3>
            <p className="mt-1 text-gray-400">There are no new messages in the inbox.</p>
        </div>
      )}
    </div>
  );
};

export default WhatsAppInbox;
