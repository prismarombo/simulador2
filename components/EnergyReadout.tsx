
import React from 'react';
import type { SimulationState } from '../types';

interface EnergyReadoutProps {
    state: SimulationState;
}

const ReadoutItem: React.FC<{ label: string; value: string; unit: string; colorClass: string }> = ({ label, value, unit, colorClass }) => (
    <div className="flex-1 min-w-[120px] bg-slate-900/70 p-3 rounded-lg text-center">
        <div className={`text-sm font-bold ${colorClass}`}>{label}</div>
        <div className="text-xl font-mono text-white">{value}</div>
        <div className="text-xs text-slate-400">{unit}</div>
    </div>
);


export const EnergyReadout: React.FC<EnergyReadoutProps> = ({ state }) => {
    return (
        <div className="mt-4 flex flex-wrap gap-3 sm:gap-4 justify-center">
            <ReadoutItem label="E. Potencial" value={state.potentialEnergy.toFixed(1)} unit="J" colorClass="text-sky-400" />
            <ReadoutItem label="E. Cinética" value={state.kineticEnergy.toFixed(1)} unit="J" colorClass="text-emerald-400" />
            <ReadoutItem label="E. Total" value={state.totalEnergy.toFixed(1)} unit="J" colorClass="text-slate-400" />
            <ReadoutItem label="Altura" value={state.height.toFixed(2)} unit="m" colorClass="text-amber-400" />
            <ReadoutItem label="Velocidad" value={Math.abs(state.velocity).toFixed(2)} unit="m/s" colorClass="text-violet-400" />
        </div>
    );
};
