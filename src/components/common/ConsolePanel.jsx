import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function ConsolePanel({ logs = [], onClear }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="flex flex-col h-full border border-terminal-border rounded-lg bg-terminal-panel overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-terminal-border bg-terminal-panel/50">
                <div className="flex items-center space-x-2">
                    <Terminal className="w-3 h-3 text-terminal-muted" />
                    <span className="text-xs font-mono text-terminal-muted uppercase tracking-wider">Console Output</span>
                </div>
                <button onClick={onClear} className="text-terminal-muted hover:text-terminal-error transition-colors p-1">
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>

            <div className="flex-1 overflow-auto scrollbar-thin p-3 font-mono text-xs bg-terminal-bg/50">
                {logs.length === 0 ? (
                    <div className="text-terminal-muted/30 italic mt-2 text-center">Ready...</div>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="mb-1 break-all flex">
                            <span className="text-terminal-muted mr-2 select-none">[{log.time}]</span>
                            <span className={clsx(
                                log.type === 'error' ? 'text-terminal-error' :
                                    log.type === 'success' ? 'text-terminal-success' :
                                        log.type === 'info' ? 'text-terminal-accent' : 'text-terminal-text'
                            )}>
                                {log.message}
                            </span>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
