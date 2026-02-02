import React, { useState } from 'react';
import CodeEditor from '../common/CodeEditor';
import ConsolePanel from '../common/ConsolePanel';
import ControlPanel from '../common/ControlPanel';
import VisualizationPanel from '../common/VisualizationPanel';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_DESIGN = `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity TrafficLight is
    Port ( clk : in STD_LOGIC;
           rst : in STD_LOGIC;
           red : out STD_LOGIC;
           yellow : out STD_LOGIC;
           green : out STD_LOGIC);
end TrafficLight;

architecture Behavior of TrafficLight is
    signal count : integer range 0 to 60 := 0;
begin
    process(clk, rst)
    begin
        if rst = '1' then
            count <= 0;
            red <= '1'; yellow <= '0'; green <= '0';
        elsif rising_edge(clk) then
            count <= count + 1;
            -- Simple logic placeholder
            if count < 20 then
                red <= '1'; yellow <= '0'; green <= '0';
            elsif count < 30 then
                red <= '1'; yellow <= '1'; green <= '0';
            else
                red <= '0'; yellow <= '0'; green <= '1';
                if count > 50 then count <= 0; end if;
            end if;
        end if;
    end process;
end Behavior;`;

const INITIAL_TB = `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity TrafficLight_TB is
end TrafficLight_TB;

architecture Behavior of TrafficLight_TB is
    signal clk : STD_LOGIC := '0';
    signal rst : STD_LOGIC := '0';
    signal red, yellow, green : STD_LOGIC;
begin
    uut: entity work.TrafficLight
    port map (clk => clk, rst => rst, red => red, yellow => yellow, green => green);

    clk_process: process
    begin
        clk <= '0'; wait for 5 ns;
        clk <= '1'; wait for 5 ns;
    end process;

    stim_proc: process
    begin
        rst <= '1'; wait for 20 ns;
        rst <= '0'; wait;
    end process;
end Behavior;`;

export default function VHDLToolchain() {
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
        setLogs([]);
        addLog('Starting GHDL analysis...', 'info');

        setTimeout(() => {
            addLog('ghdl: analyzing design.vhdl', 'info');
            addLog('ghdl: analyzing tb.vhdl', 'info');
            addLog('ghdl: elaborating entity "TrafficLight_TB"', 'info');

            setTimeout(() => {
                addLog('Elaboration successful.', 'success');
                setIsCompiling(false);
            }, 800);
        }, 600);
    };

    const handleSimulate = async () => {
        setIsSimulating(true);
        addLog('ghdl: run execution', 'info');
        setData([]);

        setTimeout(() => {
            const mockData = [];
            let state = 0; // 0=red, 1=red+yellow, 2=green
            for (let i = 0; i < 200; i += 5) {
                // Rough simulation of traffic light logic
                let r = 0, y = 0, g = 0;
                if (i < 20) { r = 1; } // Reset
                else {
                    const Cycle = (i - 20) % 150;
                    if (Cycle < 60) { r = 1; }
                    else if (Cycle < 90) { r = 1; y = 1; }
                    else { g = 1; }
                }

                mockData.push({
                    time: i,
                    clk: i % 10 < 5 ? 0 : 1,
                    rst: i < 20 ? 1 : 0,
                    red: r,
                    yellow: y,
                    green: g
                });
            }

            setData(mockData);
            addLog('Waveform generated.', 'success');
            setIsSimulating(false);
        }, 1500);
    };

    const handleReset = () => {
        setDesignCode(INITIAL_DESIGN);
        setTbCode(INITIAL_TB);
        setLogs([]);
        setData([]);
    };

    const Signal = ({ name, color, dataKey }) => (
        <div className="h-16">
            <div className="text-[10px] text-terminal-muted mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                {name}
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 1]} hide />
                    <Area type="stepAfter" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.1} isAnimationActive={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-full p-2 gap-2 overflow-y-auto lg:overflow-hidden">
            <div className="w-full lg:w-1/3 flex flex-col gap-2 min-h-[600px] lg:min-h-0">
                <div className="flex-1 h-1/2">
                    <CodeEditor label="design.vhdl" code={designCode} onChange={setDesignCode} />
                </div>
                <div className="flex-1 h-1/2">
                    <CodeEditor label="tb.vhdl" code={tbCode} onChange={setTbCode} />
                </div>
            </div>

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

            <div className="w-full lg:flex-1 min-h-[400px] lg:min-h-0">
                <VisualizationPanel title="VHDL Waveform Dump">
                    {data.length > 0 ? (
                        <div className="h-full w-full flex flex-col gap-2 p-4 overflow-y-auto">
                            <Signal name="clk" color="#8b949e" dataKey="clk" />
                            <Signal name="rst" color="#f85149" dataKey="rst" />
                            <Signal name="red_light" color="#ff7b72" dataKey="red" />
                            <Signal name="yellow_light" color="#d29922" dataKey="yellow" />
                            <Signal name="green_light" color="#7ee787" dataKey="green" />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-terminal-muted/20 text-4xl font-black uppercase tracking-widest">
                            No Signal Data
                        </div>
                    )}
                </VisualizationPanel>
            </div>
        </div>
    );
}
