import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ToolchainSelector from './components/ToolchainSelector';
import Workspace from './components/Workspace';

function App() {
    const [activeToolchain, setActiveToolchain] = useState('verilog');

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-terminal-bg text-terminal-text font-mono">
            <Header />

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="border-b border-terminal-border bg-terminal-panel/50 backdrop-blur-sm z-10">
                    <ToolchainSelector
                        active={activeToolchain}
                        onChange={setActiveToolchain}
                    />
                </div>

                <main className="flex-1 overflow-hidden relative">
                    <Workspace toolchain={activeToolchain} />
                </main>
            </div>

            <Footer activeToolchain={activeToolchain} />
        </div>
    );
}

export default App;
