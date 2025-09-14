
import React from 'react';
import { PRESETS } from '../constants';
import { MassIcon, GravityIcon, PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlPanelProps {
    mass: number;
    setMass: (value: number) => void;
    gravity: number;
    setGravity: (value: number) => void;
    gravityPreset: string;
    onGravityPresetChange: (preset: string) => void;
    isSimulating: boolean;
    onToggleSimulation: () => void;
    onResetSimulation: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    mass,
    setMass,
    gravity,
    setGravity,
    gravityPreset,
    onGravityPresetChange,
    isSimulating,
    onToggleSimulation,
    onResetSimulation
}) => {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <label htmlFor="mass-slider" className="flex items-center gap-2 text-lg font-medium text-slate-300">
                    <MassIcon />
                    Masa
                    <span className="ml-auto font-mono text-cyan-300 bg-slate-700 px-2 py-1 rounded-md text-sm">{mass.toFixed(1)} kg</span>
                </label>
                <input
                    id="mass-slider"
                    type="range"
                    min="1"
                    max="100"
                    step="0.5"
                    value={mass}
                    onChange={(e) => setMass(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb"
                    disabled={isSimulating}
                />
            </div>

            <div className="space-y-3">
                <label htmlFor="gravity-slider" className="flex items-center gap-2 text-lg font-medium text-slate-300">
                    <GravityIcon />
                    Gravedad
                    <span className="ml-auto font-mono text-cyan-300 bg-slate-700 px-2 py-1 rounded-md text-sm">{gravity.toFixed(2)} m/s²</span>
                </label>
                <input
                    id="gravity-slider"
                    type="range"
                    min="1"
                    max="30"
                    step="0.1"
                    value={gravity}
                    onChange={(e) => {
                        setGravity(parseFloat(e.target.value));
                        onGravityPresetChange('Custom');
                    }}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    disabled={isSimulating}
                />
                <div className="flex gap-2 flex-wrap">
                    {Object.keys(PRESETS).map(key => (
                        <button
                            key={key}
                            onClick={() => onGravityPresetChange(key)}
                            disabled={isSimulating}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${gravityPreset === key ? 'bg-cyan-500 text-slate-900 font-bold' : 'bg-slate-700 hover:bg-slate-600'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {PRESETS[key].name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-700">
                <button
                    onClick={onToggleSimulation}
                    className="flex-grow flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors shadow-md disabled:bg-gray-500"
                >
                    {isSimulating ? <><PauseIcon /> Pausar</> : <><PlayIcon /> Iniciar</>}
                </button>
                <button
                    onClick={onResetSimulation}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-500 transition-colors shadow-md"
                >
                   <ResetIcon /> Reiniciar
                </button>
            </div>
        </div>
    );
};
