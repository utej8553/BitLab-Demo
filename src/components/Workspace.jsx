import React from 'react';
// We will implement these specific toolchain components next.
// Importing placeholders for now or we will create them in the next steps.
// For now, I will use React.lazy or just import them directly assuming I will create them immediately.
import VerilogToolchain from './toolchains/VerilogToolchain';
import VHDLToolchain from './toolchains/VHDLToolchain';
import SpiceToolchain from './toolchains/SpiceToolchain';
import QNXToolchain from './toolchains/QNXToolchain';

export default function Workspace({ toolchain }) {
    const renderToolchain = () => {
        switch (toolchain) {
            case 'verilog': return <VerilogToolchain />;
            case 'vhdl': return <VHDLToolchain />;
            case 'spice': return <SpiceToolchain />;
            case 'qnx': return <QNXToolchain />;
            default: return <div className="p-10 text-center text-terminal-error">Unknown Toolchain</div>;
        }
    };

    return (
        <div className="absolute inset-0 bg-terminal-bg">
            {renderToolchain()}
        </div>
    );
}
