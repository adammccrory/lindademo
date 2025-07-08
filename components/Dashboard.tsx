
import React from 'react';
import { Stable, Horse } from '../types';
import { ChevronDownIcon } from './Icons';

interface DashboardProps {
  stables: Stable[];
  horses: Horse[];
  onSelectHorse: (horseId: string) => void;
}

const HorseCard: React.FC<{ horse: Horse; onSelect: () => void }> = ({ horse, onSelect }) => (
  <div
    onClick={onSelect}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
  >
    <img className="w-full h-40 object-cover" src={horse.imageUrl} alt={horse.name} />
    <div className="p-4">
      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{horse.name}</h3>
      <p className="text-sm text-gray-400 mt-1">{horse.owners.map(o => o.name).join(', ')}</p>
      <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
        <span>{horse.appointments.length} Appointments</span>
        <span>{horse.tasks.length} Tasks</span>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stables, horses, onSelectHorse }) => {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-white tracking-tight">Stable Dashboard</h1>
        <p className="mt-2 text-lg text-gray-400">Overview of all stables and horses.</p>
      </header>
      
      {stables.map(stable => (
        <section key={stable.id}>
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-400">{stable.name}</h2>
            <p className="ml-4 text-gray-500">{stable.location}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {horses.filter(h => h.stableId === stable.id).map(horse => (
              <HorseCard key={horse.id} horse={horse} onSelect={() => onSelectHorse(horse.id)} />
            ))}
            {horses.filter(h => h.stableId === stable.id).length === 0 && (
                <div className="col-span-full text-center py-8 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-500">No horses in this stable.</p>
                </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Dashboard;
