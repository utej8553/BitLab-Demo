import React from 'react';
import { Play, RotateCcw, Save } from 'lucide-react';

export default function ControlPanel({ onCompile, onSimulate, onReset, isCompiling, isSimulating }) {
    return (
        <div className="flex flex-col h-full border border-terminal-border rounded-lg bg-terminal-panel overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-terminal-border bg-terminal-panel/50">
                <span className="text-xs font-mono text-terminal-muted uppercase tracking-wider">Controls</span>
            </div>

            <div className="p-4 flex flex-col space-y-3">
                <button
                    onClick={onCompile}
                    disabled={isCompiling || isSimulating}
                    className="flex items-center justify-center w-full py-2 bg-terminal-accent/10 hover:bg-terminal-accent/20 border border-terminal-accent/30 text-terminal-accent rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wide"
                >
                    {isCompiling ? 'Compiling...' : '1. Compile / Build'}
                </button>

                <button
                    onClick={onSimulate}
                    disabled={isCompiling || isSimulating}
                    className="flex items-center justify-center w-full py-2 bg-terminal-success/10 hover:bg-terminal-success/20 border border-terminal-success/30 text-terminal-success rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wide group"
                >
                    <Play className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />
                    {isSimulating ? 'Running...' : '2. Run Simulation'}
                </button>

                <div className="h-px bg-terminal-border my-2"></div>

                <button
                    onClick={onReset}
                    className="flex items-center justify-center w-full py-2 bg-transparent hover:bg-white/5 border border-terminal-border text-terminal-muted rounded transition-all text-xs font-medium"
                >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Reset Environment
                </button>
            </div>
        </div>
    );
}
