import React, { useState, useEffect } from 'react';
import CodeEditor from '../common/CodeEditor';
import ConsolePanel from '../common/ConsolePanel';
import ControlPanel from '../common/ControlPanel';
import VisualizationPanel from '../common/VisualizationPanel';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const INITIAL_DESIGN = `module counter (
    input clk,
    input rst,
    output reg [3:0] count
);

    always @(posedge clk or posedge rst) begin
        if (rst)
            count <= 4'b0000;
        else
            count <= count + 1;
    end

endmodule`;

const INITIAL_TB = `module testbench;
    reg clk;
    reg rst;
    wire [3:0] count;

    counter uut (
        .clk(clk),
        .rst(rst),
        .count(count)
    );

    initial begin
        $dumpfile("dump.vcd");
        $dumpvars(0, testbench);
        
        clk = 0;
        rst = 1;
        #20 rst = 0;
        #200 $finish;
    end

    always #5 clk = ~clk;
endmodule`;

export default function VerilogToolchain() {
    // State
    const [designCode, setDesignCode] = useState(INITIAL_DESIGN);
    const [tbCode, setTbCode] = useState(INITIAL_TB);
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
        setLogs([]); // Clear previous logs
        addLog('Starting compilation...', 'info');

        // Simulate delay
        setTimeout(() => {
            addLog('iverilog: compiling design.v', 'info');
            addLog('iverilog: compiling testbench.v', 'info');

            setTimeout(() => {
                if (Math.random() > 0.1) {
                    addLog('Compilation successful. 0 errors, 0 warnings', 'success');
                    addLog('Generating vvp executable...', 'info');
                } else {
                    addLog('Syntax Error: undefined variable "cunt" at line 12', 'error');
                }
                setIsCompiling(false);
            }, 800);
        }, 600);
    };

    const handleSimulate = async () => {
        if (logs.some(l => l.type === 'error')) {
            addLog('Cannot simulate: Fix compilation errors first.', 'error');
            return;
        }

        setIsSimulating(true);
        addLog('vvp: simulation started', 'info');
        setData([]);

        setTimeout(() => {
            addLog('VCD dump opened "dump.vcd"', 'info');

            // Generate mock waveform data
            const mockData = [];
            for (let i = 0; i < 200; i += 10) {
                mockData.push({
                    time: i,
                    clk: i % 20 < 10 ? 0 : 1,
                    rst: i < 20 ? 1 : 0,
                    // Simple counter logic simulation
                    count: i < 20 ? 0 : Math.floor((i - 20) / 20) % 16
                });
            }

            setData(mockData);
            addLog('Simulation completed at 200ns', 'success');
            setIsSimulating(false);
        }, 1500);
    };

    const handleReset = () => {
        setDesignCode(INITIAL_DESIGN);
        setTbCode(INITIAL_TB);
        setLogs([]);
        setData([]);
    };

    return (
        <div className="flex flex-col lg:flex-row h-full p-2 gap-2 overflow-y-auto lg:overflow-hidden">
            {/* Input Column */}
            <div className="w-full lg:w-1/3 flex flex-col gap-2 min-h-[600px] lg:min-h-0">
                <div className="flex-1 h-1/2">
                    <CodeEditor
                        label="design.v"
                        code={designCode}
                        onChange={setDesignCode}
                    />
                </div>
                <div className="flex-1 h-1/2">
                    <CodeEditor
                        label="testbench.v"
                        code={tbCode}
                        onChange={setTbCode}
                    />
                </div>
            </div>

            {/* Control & Console Column */}
            <div className="w-full lg:w-1/5 flex flex-col gap-2 min-h-[400px] lg:min-h-0">
                <div className="h-1/3">
                    <ControlPanel
                        onCompile={handleCompile}
                        onSimulate={handleSimulate}
                        onReset={handleReset}
                        isCompiling={isCompiling}
                        isSimulating={isSimulating}
                    />
                </div>
                <div className="flex-1">
                    <ConsolePanel logs={logs} onClear={() => setLogs([])} />
                </div>
            </div>

            {/* Visualization Column */}
            <div className="w-full lg:flex-1 min-h-[400px] lg:min-h-0">
                <VisualizationPanel title="Timing Diagram">
                    {data.length > 0 ? (
                        <div className="h-full w-full flex flex-col gap-4 p-4">
                            {/* Clock Signal */}
                            <div className="h-16">
                                <div className="text-[10px] text-terminal-muted mb-1">clk</div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="gradClk" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#58a6ff" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="time" hide />
                                        <YAxis domain={[0, 1]} hide />
                                        <Area type="stepAfter" dataKey="clk" stroke="#58a6ff" fill="url(#gradClk)" isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Reset Signal */}
                            <div className="h-16">
                                <div className="text-[10px] text-terminal-muted mb-1">rst</div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <XAxis dataKey="time" hide />
                                        <YAxis domain={[0, 1]} hide />
                                        <Area type="stepAfter" dataKey="rst" stroke="#d29922" fill="#d29922" fillOpacity={0.1} isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Count Signal (Analog-ish view for bus) */}
                            <div className="flex-1 min-h-[100px]">
                                <div className="text-[10px] text-terminal-muted mb-1">count [3:0]</div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <XAxis dataKey="time" stroke="#30363d" tick={{ fontSize: 10, fill: '#8b949e' }} />
                                        <YAxis domain={[0, 15]} stroke="#30363d" tick={{ fontSize: 10, fill: '#8b949e' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', fontSize: '12px' }}
                                            itemStyle={{ color: '#c9d1d9' }}
                                            labelStyle={{ color: '#8b949e' }}
                                        />
                                        <Area type="stepAfter" dataKey="count" stroke="#238636" fill="#238636" fillOpacity={0.1} isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-terminal-muted/20 text-4xl font-black uppercase tracking-widest">
                            No Waveform Data
                        </div>
                    )}
                </VisualizationPanel>
            </div>
        </div>
    );
}
