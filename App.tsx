
import React, { useState, useCallback } from 'react';
import { Horse, Stable, Owner, Task, Appointment, WhatsAppMessage } from './types';
import { HORSES, STABLES, OWNERS, WHATSAPP_MESSAGES } from './constants';
import Dashboard from './components/Dashboard';
import WhatsAppInbox from './components/WhatsAppInbox';
import HorseDetail from './components/HorseDetail';
import { HomeIcon, MailIcon, HorseIcon } from './components/Icons';

type View = 'dashboard' | 'whatsapp';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [horses, setHorses] = useState<Horse[]>(HORSES);
  const [stables] = useState<Stable[]>(STABLES);
  const [owners] = useState<Owner[]>(OWNERS);
  const [messages, setMessages] = useState<WhatsAppMessage[]>(WHATSAPP_MESSAGES);
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);

  const handleSelectHorse = (horseId: string) => {
    setSelectedHorseId(horseId);
  };

  const handleBackToDashboard = () => {
    setSelectedHorseId(null);
    setView('dashboard');
  };

  const addAppointment = useCallback((horseId: string, appointment: Omit<Appointment, 'id'>) => {
    setHorses(prevHorses => prevHorses.map(h => h.id === horseId ? { ...h, appointments: [...h.appointments, { ...appointment, id: `apt-${Date.now()}` }] } : h));
  }, []);

  const addTask = useCallback((horseId: string, task: Omit<Task, 'id' | 'completed'>) => {
    setHorses(prevHorses => prevHorses.map(h => h.id === horseId ? { ...h, tasks: [...h.tasks, { ...task, id: `task-${Date.now()}`, completed: false }] } : h));
  }, []);

  const selectedHorse = horses.find(h => h.id === selectedHorseId);

  const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-gray-700 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-4">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-700/50 p-4 flex flex-col">
        <div className="flex items-center mb-8">
          <HorseIcon className="w-10 h-10 text-indigo-400" />
          <h1 className="ml-3 text-2xl font-bold tracking-wider text-white">EquiManage AI</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <NavItem
            label="Dashboard"
            icon={<HomeIcon className="w-6 h-6" />}
            isActive={view === 'dashboard'}
            onClick={() => {
              setView('dashboard');
              setSelectedHorseId(null);
            }}
          />
          <NavItem
            label="WhatsApp Inbox"
            icon={<MailIcon className="w-6 h-6" />}
            isActive={view === 'whatsapp'}
            onClick={() => {
              setView('whatsapp');
              setSelectedHorseId(null);
            }}
          />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {selectedHorse ? (
          <HorseDetail
            horse={selectedHorse}
            stable={stables.find(s => s.id === selectedHorse.stableId)}
            onBack={handleBackToDashboard}
            onAddTask={addTask}
            onAddAppointment={addAppointment}
          />
        ) : view === 'dashboard' ? (
          <Dashboard
            stables={stables}
            horses={horses}
            onSelectHorse={handleSelectHorse}
          />
        ) : (
          <WhatsAppInbox
            messages={messages}
            horses={horses}
            owners={owners}
            onAddTask={addTask}
            onAddAppointment={addAppointment}
            onMessageActioned={(messageId) => setMessages(prev => prev.filter(m => m.id !== messageId))}
          />
        )}
      </main>
    </div>
  );
};

export default App;
