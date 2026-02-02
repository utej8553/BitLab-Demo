import React from 'react';
import { LineChart, Expand } from 'lucide-react';

export default function VisualizationPanel({ title = "Visualization", children }) {
    return (
        <div className="flex flex-col h-full border border-terminal-border rounded-lg bg-terminal-panel overflow-hidden relative">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-terminal-border bg-terminal-panel/50">
                <div className="flex items-center space-x-2">
                    <LineChart className="w-3 h-3 text-terminal-accent" />
                    <span className="text-xs font-mono text-terminal-muted uppercase tracking-wider">{title}</span>
                </div>
                <button className="text-terminal-muted hover:text-white transition-colors">
                    <Expand className="w-3 h-3" />
                </button>
            </div>

            <div className="flex-1 overflow-hidden relative p-4 bg-terminal-bg/30">
                {children}
            </div>

            {/* Grid overlay for aesthetic */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px', top: '32px' }}>
            </div>
        </div>
    );
}
