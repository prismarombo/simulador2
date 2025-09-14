
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlPanel } from './components/ControlPanel';
import { EnergyChart } from './components/EnergyChart';
import { Header } from './components/Header';
import { EnergyReadout } from './components/EnergyReadout';
import type { SimulationState } from './types';
import { PRESETS } from './constants';

const App: React.FC = () => {
    const [mass, setMass] = useState<number>(20); // kg
    const [gravity, setGravity] = useState<number>(PRESETS.Earth.gravity);
    const [gravityPreset, setGravityPreset] = useState<string>('Earth');
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    
    const [simulationState, setSimulationState] = useState<SimulationState>({
        height: 1.5, // m
        velocity: 0, // m/s
        position: -0.8, // position on the ramp, from -1 to 1
        kineticEnergy: 0,
        potentialEnergy: 0,
        totalEnergy: 0,
    });

    const animationFrameId = useRef<number | null>(null);
    const lastTime = useRef<number | null>(null);
    const rampShape = useCallback((x: number) => 0.8 * Math.pow(x, 2), []); // Parabolic ramp y = 0.8x^2

    // Calculate total energy based on starting height
    const totalEnergyRef = useRef(mass * gravity * rampShape(1));

    const resetSimulation = useCallback((startPosition: number = -0.8) => {
        setIsSimulating(false);
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
        lastTime.current = null;

        const startHeight = rampShape(Math.abs(startPosition));
        totalEnergyRef.current = mass * gravity * startHeight;

        setSimulationState({
            height: startHeight,
            velocity: 0,
            position: startPosition,
            kineticEnergy: 0,
            potentialEnergy: totalEnergyRef.current,
            totalEnergy: totalEnergyRef.current,
        });
    }, [mass, gravity, rampShape]);

    useEffect(() => {
        resetSimulation(simulationState.position);
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mass, gravity]);

    const runSimulation = useCallback((timestamp: number) => {
        if (!lastTime.current) {
            lastTime.current = timestamp;
            animationFrameId.current = requestAnimationFrame(runSimulation);
            return;
        }

        const deltaTime = (timestamp - lastTime.current) / 1000; // seconds
        lastTime.current = timestamp;

        setSimulationState(prevState => {
            // Physics Calculations
            const slope = 2 * 0.8 * prevState.position; // derivative of y = 0.8x^2
            const angle = Math.atan(slope);
            const acceleration = -gravity * Math.sin(angle);
            
            let newVelocity = prevState.velocity + acceleration * deltaTime;
            let newPosition = prevState.position + newVelocity * deltaTime;

            // Dampen velocity slightly to prevent infinite oscillation (emulates friction/air resistance)
            newVelocity *= 0.9995;

            // Boundary checks
            if (newPosition > 1) { newPosition = 1; newVelocity = -newVelocity * 0.8; }
            if (newPosition < -1) { newPosition = -1; newVelocity = -newVelocity * 0.8; }

            const newHeight = rampShape(newPosition);
            const newPotentialEnergy = mass * gravity * newHeight;
            let newKineticEnergy = totalEnergyRef.current - newPotentialEnergy;
            if (newKineticEnergy < 0) newKineticEnergy = 0;

            return {
                height: newHeight,
                velocity: newVelocity,
                position: newPosition,
                potentialEnergy: newPotentialEnergy,
                kineticEnergy: newKineticEnergy,
                totalEnergy: totalEnergyRef.current,
            };
        });

        animationFrameId.current = requestAnimationFrame(runSimulation);
    }, [gravity, mass, rampShape]);

    const handleGravityPresetChange = (presetName: string) => {
        const preset = PRESETS[presetName];
        if (preset) {
            setGravity(preset.gravity);
            setGravityPreset(presetName);
        }
    };
    
    const toggleSimulation = () => {
        if (isSimulating) {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }
            lastTime.current = null;
        } else {
            lastTime.current = performance.now();
            animationFrameId.current = requestAnimationFrame(runSimulation);
        }
        setIsSimulating(!isSimulating);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
            <Header />
            <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl shadow-2xl p-6 flex flex-col justify-between">
                    <h2 className="text-xl font-bold text-cyan-300 mb-4">Simulación Visual</h2>
                    <div className="flex-grow aspect-[16/9] w-full">
                        <SimulationCanvas 
                            position={simulationState.position} 
                            rampShape={rampShape}
                            onBallDrag={resetSimulation}
                            isSimulating={isSimulating}
                        />
                    </div>
                     <EnergyReadout state={simulationState} />
                </div>
                <div className="lg:col-span-1 bg-slate-800/50 rounded-2xl shadow-2xl p-6 flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-cyan-300 mb-4">Panel de Control</h2>
                        <ControlPanel
                            mass={mass}
                            setMass={setMass}
                            gravity={gravity}
                            setGravity={setGravity}
                            gravityPreset={gravityPreset}
                            onGravityPresetChange={handleGravityPresetChange}
                            isSimulating={isSimulating}
                            onToggleSimulation={toggleSimulation}
                            onResetSimulation={() => resetSimulation()}
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-cyan-300 mb-4">Distribución de Energía</h2>
                        <div className="w-full h-64">
                            <EnergyChart state={simulationState} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
