
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center w-full max-w-7xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                Simulador de Energía Mecánica
            </h1>
            <p className="mt-2 text-lg text-slate-400">
                Visualiza la conservación de la energía en acción.
            </p>
        </header>
    );
};
