import React from 'react';
import { Terminal, Settings, HelpCircle } from 'lucide-react';

export default function Header() {
    return (
        <header className="flex items-center justify-between px-4 py-3 bg-terminal-panel border-b border-terminal-border">
            <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-terminal-accent/10 rounded-lg">
                    <Terminal className="w-5 h-5 text-terminal-accent" />
                </div>
                <div>
                    <h1 className="font-bold text-sm tracking-wide text-white">Embedded Systems Simulation Lab</h1>
                    <p className="text-[10px] text-terminal-muted uppercase tracking-wider">Unified HDL • SPICE • RTOS Workflow</p>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="text-terminal-muted hover:text-white transition-colors">
                    <HelpCircle className="w-4 h-4" />
                </button>
                <button className="text-terminal-muted hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                </button>
                <div className="h-6 w-px bg-terminal-border mx-2"></div>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-terminal-success animate-pulse"></div>
                    <span className="text-xs font-medium text-terminal-muted">System Online</span>
                </div>
            </div>
        </header>
    );
}
