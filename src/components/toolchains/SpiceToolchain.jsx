import React, { useState } from 'react';
import CodeEditor from '../common/CodeEditor';
import ConsolePanel from '../common/ConsolePanel';
import ControlPanel from '../common/ControlPanel';
import VisualizationPanel from '../common/VisualizationPanel';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const INITIAL_SPICE = `* Simple RC Circuit Transient Analysis
v1 1 0 sin(0 5 1k)
r1 1 2 1k
c1 2 0 1u

.tran 10u 5ms
.end`;

export default function SpiceToolchain() {
    const [code, setCode] = useState(INITIAL_SPICE);
    const [logs, setLogs] = useState([]);
    const [data, setData] = useState([]);
    const [isCompiling, setIsCompiling] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    const addLog = (msg, type = 'info') => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev, { time, message: msg, type }]);
    };

    const handleCompile = async () => {
        setIsCompiling(true);
        setLogs([]);
        addLog('Parsing netlist...', 'info');

        setTimeout(() => {
            addLog('Circuit check: OK', 'success');
            addLog('Detected: 3 nodes, 3 elements', 'info');
            addLog('Analysis: Transient (.tran)', 'info');
            setIsCompiling(false);
        }, 600);
    };

    const handleSimulate = async () => {
        setIsSimulating(true);
        addLog('ngspice: starting transient analysis', 'info');
        setData([]);

        setTimeout(() => {
            // Generate RC charge/discharge-ish curves
            const mockData = [];
            for (let i = 0; i <= 100; i++) {
                const t = i / 20; // Time factor
                // Input sine wave
                const vin = 5 * Math.sin(t);
                // Output (lagging and attenuated slightly)
                const vout = 4.8 * Math.sin(t - 0.5);

                mockData.push({
                    time: (i * 0.05).toFixed(2) + 'ms',
                    Vin_node1: vin,
                    Vout_node2: vout,
                    Current: (vin - vout) // Mock current
                });
            }

            setData(mockData);
            addLog('Analysis completed. 101 points generated.', 'success');
            setIsSimulating(false);
        }, 1200);
    };

    return (
        <div className="flex flex-col lg:flex-row h-full p-2 gap-2 overflow-y-auto lg:overflow-hidden">
            <div className="w-full lg:w-1/3 flex flex-col gap-2 min-h-[600px] lg:min-h-0">
                <div className="flex-1">
                    <CodeEditor label="circuit.sp" code={code} onChange={setCode} />
                </div>
                <div className="h-1/3 border border-terminal-border rounded-lg bg-terminal-panel p-3">
                    <div className="text-xs font-mono text-terminal-muted uppercase tracking-wider mb-2 border-b border-terminal-border pb-1">Components</div>
                    <div className="text-xs font-mono text-terminal-text space-y-1">
                        <div className="flex justify-between"><span>Voltage Source</span><span className="text-terminal-accent">V</span></div>
                        <div className="flex justify-between"><span>Resistor</span><span className="text-terminal-accent">R</span></div>
                        <div className="flex justify-between"><span>Capacitor</span><span className="text-terminal-accent">C</span></div>
                        <div className="flex justify-between"><span>Inductor</span><span className="text-terminal-accent">L</span></div>
                        <div className="flex justify-between"><span>Diode</span><span className="text-terminal-accent">D</span></div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/5 flex flex-col gap-2 min-h-[400px] lg:min-h-0">
                <div className="h-1/3">
                    <ControlPanel
                        onCompile={handleCompile}
                        onSimulate={handleSimulate}
                        onReset={() => { setCode(INITIAL_SPICE); setLogs([]); setData([]); }}
                        isCompiling={isCompiling}
                        isSimulating={isSimulating}
                    />
                </div>
                <div className="flex-1">
                    <ConsolePanel logs={logs} onClear={() => setLogs([])} />
                </div>
            </div>

            <div className="w-full lg:flex-1 min-h-[400px] lg:min-h-0">
                <VisualizationPanel title="Analog Transient Response">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                                <XAxis dataKey="time" stroke="#8b949e" tick={{ fontSize: 10 }} />
                                <YAxis stroke="#8b949e" tick={{ fontSize: 10 }} label={{ value: 'Volts (V)', angle: -90, position: 'insideLeft', fill: '#8b949e' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d' }}
                                    itemStyle={{ fontSize: 12 }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="Vin_node1" stroke="#58a6ff" dot={false} strokeWidth={2} />
                                <Line type="monotone" dataKey="Vout_node2" stroke="#d29922" dot={false} strokeWidth={2} />
                                <Line type="monotone" dataKey="Current" stroke="#238636" dot={false} strokeWidth={1} strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-terminal-muted/20 text-4xl font-black uppercase tracking-widest">
                            No Simulation Data
                        </div>
                    )}
                </VisualizationPanel>
            </div>
        </div>
    );
}
