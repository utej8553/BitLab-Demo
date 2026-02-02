import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/themes/prism-dark.css'; // We will override this usually, but good fallback

// Simple mock highlighter since loading all languages dynamically in a manual setup is tricky
// We will just use C-like for everything for now to save complexity
const highlightCode = (code) => {
    return highlight(code, languages.clike, 'clike');
};

export default function CodeEditor({ code, onChange, label, language = 'clike' }) {
    return (
        <div className="flex flex-col h-full border border-terminal-border rounded-lg bg-terminal-panel overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-terminal-border bg-terminal-panel/50">
                <span className="text-xs font-mono text-terminal-muted">{label}</span>
                <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-terminal-border"></div>
                    <div className="w-2 h-2 rounded-full bg-terminal-border"></div>
                </div>
            </div>
            <div className="flex-1 overflow-auto scrollbar-thin font-mono text-sm relative group">
                <Editor
                    value={code}
                    onValueChange={onChange}
                    highlight={highlightCode}
                    padding={16}
                    className="font-mono min-h-full"
                    style={{
                        fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                        fontSize: 13,
                        backgroundColor: 'transparent',
                        color: '#c9d1d9'
                    }}
                    textareaClassName="focus:outline-none"
                />
            </div>
        </div>
    );
}
