import React from 'react';
import { Cpu, Activity, Zap, Server } from 'lucide-react';
import clsx from 'clsx';

const toolchains = [
    { id: 'verilog', label: 'Verilog HDL', icon: Cpu, color: 'text-blue-400' },
    { id: 'vhdl', label: 'VHDL', icon: Activity, color: 'text-green-400' },
    { id: 'spice', label: 'SPICE Sim', icon: Zap, color: 'text-yellow-400' },
    { id: 'qnx', label: 'QNX RTOS', icon: Server, color: 'text-red-400' },
];

export default function ToolchainSelector({ active, onChange }) {
    return (
        <div className="flex items-center space-x-1 p-2 px-4 overflow-x-auto scrollbar-hide">
            <span className="text-terminal-muted text-sm mr-2 font-bold uppercase tracking-wider">Toolchain:</span>
            {toolchains.map((tc) => {
                const Icon = tc.icon;
                const isActive = active === tc.id;

                return (
                    <button
                        key={tc.id}
                        onClick={() => onChange(tc.id)}
                        className={clsx(
                            "flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 border border-transparent",
                            isActive
                                ? "bg-terminal-border/50 text-white border-terminal-border shadow-sm"
                                : "text-terminal-muted hover:text-terminal-text hover:bg-white/5"
                        )}
                    >
                        <Icon className={clsx("w-4 h-4", isActive ? tc.color : "text-current")} />
                        <span className="font-medium text-sm">{tc.label}</span>
                        {isActive && <div className="ml-2 w-1.5 h-1.5 rounded-full bg-terminal-success animate-pulse" />}
                    </button>
                );
            })}
        </div>
    );
}
