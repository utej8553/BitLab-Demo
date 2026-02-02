import React from 'react';
import { GitBranch, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Footer({ activeToolchain }) {
    return (
        <footer className="flex items-center justify-between px-4 py-1.5 bg-terminal-panel border-t border-terminal-border text-[11px] text-terminal-muted select-none">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5 hover:text-terminal-text cursor-pointer transition-colors">
                    <GitBranch className="w-3 h-3" />
                    <span>main</span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3 h-3 text-terminal-muted" />
                    <span>Ready</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <span>UTF-8</span>
                <span>Space: 2</span>
                <div className="uppercase font-bold text-terminal-text/50">
                    {activeToolchain} MODE
                </div>
            </div>
        </footer>
    );
}
