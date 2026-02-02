import React, { useState } from 'react';
import CodeEditor from '../common/CodeEditor';
import ConsolePanel from '../common/ConsolePanel';
import ControlPanel from '../common/ControlPanel';
import VisualizationPanel from '../common/VisualizationPanel';

const INITIAL_CODE = `#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

void* sensor_task(void* arg) {
    while(1) {
        printf("Reading sensor data...\\n");
        usleep(100000); // 100ms
    }
}

void* control_task(void* arg) {
    while(1) {
        printf("Processing control loop...\\n");
        usleep(200000); // 200ms
    }
}

int main() {
    pthread_t thread1, thread2;
    pthread_create(&thread1, NULL, sensor_task, NULL);
    pthread_create(&thread2, NULL, control_task, NULL);
    
    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);
    return 0;
}
`;

export default function QNXToolchain() {
    const [code, setCode] = useState(INITIAL_CODE);
    const [targetIp, setTargetIp] = useState("192.168.1.55");
    const [logs, setLogs] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isCompiling, setIsCompiling] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    const addLog = (msg, type = 'info') => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev, { time, message: msg, type }]);
    };

    const handleCompile = async () => {
        setIsCompiling(true);
        setLogs([]);
        addLog('qcc: compiling main.c', 'info');

        setTimeout(() => {
            addLog('Linking objects...', 'info');
            addLog('Binary size: 45KB', 'info');
            addLog('Build successful.', 'success');
            setIsCompiling(false);
        }, 800);
    };

    const handleSimulate = async () => {
        setIsSimulating(true);
        addLog(`Deploying to target ${targetIp}...`, 'info');
        setTasks([]);

        setTimeout(() => {
            addLog('Application started (PID: 4022)', 'success');

            // Generate fake task traces
            const task1 = [];
            const task2 = [];
            // Generate random blocks of execution
            for (let i = 0; i < 50; i++) {
                task1.push({ status: Math.random() > 0.7 ? 'blocked' : 'running', length: Math.random() * 20 + 5 });
                task2.push({ status: Math.random() > 0.6 ? 'ready' : 'running', length: Math.random() * 30 + 10 });
            }

            setTasks([
                { name: "main_thread", data: task1 },
                { name: "sensor_task", data: task2 },
                { name: "control_task", data: task1.map(x => ({ ...x, status: x.status === 'running' ? 'blocked' : 'running' })) } // Invert ish
            ]);

            setIsSimulating(false);
        }, 1200);
    };

    return (
        <div className="flex flex-col lg:flex-row h-full p-2 gap-2 overflow-y-auto lg:overflow-hidden">
            <div className="w-full lg:w-1/3 flex flex-col gap-2 min-h-[600px] lg:min-h-0">
                <div className="flex-1">
                    <CodeEditor label="main.c" code={code} onChange={setCode} />
                </div>
                <div className="h-1/4 border border-terminal-border rounded-lg bg-terminal-panel p-3 flex flex-col gap-2">
                    <div className="text-xs font-mono text-terminal-muted uppercase tracking-wider border-b border-terminal-border pb-1">Target Config</div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-terminal-muted">Target Architecture</label>
                        <select className="bg-terminal-bg border border-terminal-border text-terminal-text text-xs rounded p-1">
                            <option>ARMv7 Cortex-A9</option>
                            <option>x86_64 Generic</option>
                            <option>AArch64</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-terminal-muted">Target IP Address</label>
                        <input
                            type="text"
                            value={targetIp}
                            onChange={e => setTargetIp(e.target.value)}
                            className="bg-terminal-bg border border-terminal-border text-terminal-text text-xs rounded p-1 font-mono"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/5 flex flex-col gap-2 min-h-[400px] lg:min-h-0">
                <div className="h-1/3">
                    <ControlPanel
                        onCompile={handleCompile}
                        onSimulate={handleSimulate}
                        onReset={() => { setLogs([]); setTasks([]); }}
                        isCompiling={isCompiling}
                        isSimulating={isSimulating}
                    />
                </div>
                <div className="flex-1">
                    <ConsolePanel logs={logs} onClear={() => setLogs([])} />
                </div>
            </div>

            <div className="w-full lg:flex-1 min-h-[400px] lg:min-h-0">
                <VisualizationPanel title="RTOS Execution Timeline">
                    {tasks.length > 0 ? (
                        <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
                            {tasks.map((task, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="text-xs font-mono text-terminal-text">{task.name}</div>
                                    <div className="h-8 flex bg-terminal-bg/50 rounded overflow-hidden w-full relative">
                                        {task.data.map((seg, j) => (
                                            <div
                                                key={j}
                                                style={{
                                                    width: `${seg.length}%`,
                                                    backgroundColor:
                                                        seg.status === 'running' ? '#238636' :
                                                            seg.status === 'blocked' ? '#f85149' : '#d29922'
                                                }}
                                                className="h-full border-r border-terminal-bg/20 transition-all hover:brightness-110"
                                                title={`${seg.status}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="mt-8 flex gap-4 justify-center">
                                <div className="flex items-center gap-2 text-xs text-terminal-muted"><div className="w-3 h-3 bg-terminal-success"></div> Running</div>
                                <div className="flex items-center gap-2 text-xs text-terminal-muted"><div className="w-3 h-3 bg-terminal-warning"></div> Ready</div>
                                <div className="flex items-center gap-2 text-xs text-terminal-muted"><div className="w-3 h-3 bg-terminal-error"></div> Blocked</div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-terminal-muted/20 text-4xl font-black uppercase tracking-widest">
                            System Offline
                        </div>
                    )}
                </VisualizationPanel>
            </div>
        </div>
    );
}
