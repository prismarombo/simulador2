
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { SimulationState } from '../types';

interface EnergyChartProps {
    state: SimulationState;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 p-3 rounded-lg shadow-lg">
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.fill }} className="font-semibold">
                        {pld.name}: {pld.value.toFixed(2)} J
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const EnergyChart: React.FC<EnergyChartProps> = ({ state }) => {
    const data = [
        {
            name: 'Energía',
            'Potencial': state.potentialEnergy,
            'Cinética': state.kineticEnergy,
            'Total': state.totalEnergy,
        },
    ];
    
    const colors = {
        'Potencial': '#38bdf8', // sky-400
        'Cinética': '#34d399', // emerald-400
        'Total': '#94a3b8' // slate-400
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="#94a3b8" domain={[0, dataMax => Math.max(dataMax * 1.1, state.totalEnergy * 1.1)]} tickFormatter={(tick) => `${tick.toFixed(0)} J`} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
                <Legend wrapperStyle={{ color: '#e2e8f0' }} />
                <Bar dataKey="Potencial" stackId="a" name="Potencial" fill={colors['Potencial']} />
                <Bar dataKey="Cinética" stackId="a" name="Cinética" fill={colors['Cinética']} />
                <Bar dataKey="Total" name="Total" fill="transparent" stroke={colors['Total']} strokeWidth={2} />
            </BarChart>
        </ResponsiveContainer>
    );
};
