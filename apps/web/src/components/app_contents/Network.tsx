import { useEffect, useRef, useState } from "react";
import Button2 from "../ui/Button2";
import InteractiveTerminal, { type InteractiveTerminalRef } from "../InteractiveTerminal";
import useAppState from "../../appstates/app";
import config from 'config';
import TransparentCard from "../ui/TransparentCard";
import TerminalHeader from "../ui/TerminalHeader";

interface NetworkProps {
    isVisible: boolean
}

// Network utility command groups
const commandGroups = [
    {
        title: 'Network Info',
        commands: [
            { label: 'IP Address', cmd: 'ip addr show', icon: 'fa-network-wired', color: 'cyanBlue' },
            { label: 'Network Interfaces', cmd: 'ip link show', icon: 'fa-ethernet', color: 'blueIndigo' },
            { label: 'Routing Table', cmd: 'ip route show', icon: 'fa-route', color: 'emeraldTeal' },
            { label: 'DNS Servers', cmd: 'cat /etc/resolv.conf', icon: 'fa-server', color: 'yellowOrange' },
            { label: 'Hostname', cmd: 'hostname -I && hostname', icon: 'fa-desktop', color: 'pinkRose' },
        ]
    },
    {
        title: 'Connectivity Tests',
        commands: [
            { label: 'Ping Google', cmd: 'ping -c 4 google.com', icon: 'fa-satellite-dish', color: 'emeraldTeal' },
            { label: 'Ping Cloudflare', cmd: 'ping -c 4 1.1.1.1', icon: 'fa-cloud', color: 'yellowOrange' },
            { label: 'Ping Localhost', cmd: 'ping -c 4 127.0.0.1', icon: 'fa-home', color: 'blueIndigo' },
            { label: 'Traceroute', cmd: 'traceroute -m 15 google.com 2>/dev/null || tracepath google.com', icon: 'fa-map-marked-alt', color: 'pinkRose' },
            { label: 'DNS Lookup', cmd: 'nslookup google.com', icon: 'fa-search', color: 'cyanBlue' },
            { label: 'Dig DNS', cmd: 'dig google.com +short 2>/dev/null || host google.com', icon: 'fa-digging', color: 'gray' },
        ]
    },
    {
        title: 'Ports & Connections',
        commands: [
            { label: 'Listening Ports', cmd: 'ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null', icon: 'fa-door-open', color: 'emeraldTeal' },
            { label: 'All Connections', cmd: 'ss -tunap 2>/dev/null || netstat -tunap 2>/dev/null', icon: 'fa-plug', color: 'blueIndigo' },
            { label: 'TCP Connections', cmd: 'ss -t -a', icon: 'fa-exchange-alt', color: 'cyanBlue' },
            { label: 'UDP Connections', cmd: 'ss -u -a', icon: 'fa-broadcast-tower', color: 'yellowOrange' },
            { label: 'Port 80/443', cmd: 'ss -tlnp | grep -E ":80|:443" || echo "No web ports listening"', icon: 'fa-globe', color: 'pinkRose' },
            { label: 'Common Ports', cmd: 'ss -tlnp | head -20', icon: 'fa-list-ol', color: 'gray' },
        ]
    },
    {
        title: 'Docker Network',
        commands: [
            { label: 'Docker Networks', cmd: 'docker network ls', icon: 'fa-project-diagram', color: 'skyBlue' },
            { label: 'Running Containers', cmd: 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"', icon: 'fa-box', color: 'blueIndigo' },
            { label: 'All Containers', cmd: 'docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"', icon: 'fa-boxes', color: 'gray' },
            { label: 'Container IPs', cmd: 'docker inspect --format="{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" $(docker ps -q) 2>/dev/null || echo "No running containers"', icon: 'fa-map-pin', color: 'emeraldTeal' },
            { label: 'Docker Logs (last)', cmd: 'docker logs --tail 50 $(docker ps -q | head -1) 2>/dev/null || echo "No running containers"', icon: 'fa-file-alt', color: 'yellowOrange' },
            { label: 'Docker Stats', cmd: 'docker stats --no-stream 2>/dev/null || echo "Docker not available"', icon: 'fa-chart-bar', color: 'pinkRose' },
        ]
    },
    {
        title: 'System Processes',
        commands: [
            { label: 'Network Processes', cmd: 'ss -tlnp | awk \'NR>1 {print $7}\' | cut -d\\"\\\" -f2 | sort -u | head -20', icon: 'fa-cogs', color: 'blueIndigo' },
            { label: 'Top by Network', cmd: 'nethogs -t -c 2 2>/dev/null || echo "nethogs not installed. Run: sudo apt install nethogs"', icon: 'fa-tachometer-alt', color: 'pinkRose' },
            { label: 'Top Processes', cmd: 'ps aux --sort=-%mem | head -15', icon: 'fa-microchip', color: 'emeraldTeal' },
            { label: 'Process Ports', cmd: 'lsof -i -P -n | head -30 2>/dev/null || ss -tlnp', icon: 'fa-sitemap', color: 'cyanBlue' },
        ]
    },
    {
        title: 'Firewall & Security',
        commands: [
            { label: 'UFW Status', cmd: 'sudo ufw status verbose 2>/dev/null || echo "UFW not available or not root"', icon: 'fa-shield-alt', color: 'red' },
            { label: 'IPTables Rules', cmd: 'sudo iptables -L -n --line-numbers 2>/dev/null || echo "Requires root privileges"', icon: 'fa-fire', color: 'yellowOrange' },
            { label: 'Open Ports Scan', cmd: 'nmap -sT localhost 2>/dev/null || echo "nmap not installed. Run: sudo apt install nmap"', icon: 'fa-radar', color: 'pinkRose' },
            { label: 'Failed Logins', cmd: 'sudo journalctl -u ssh --no-pager | tail -20 2>/dev/null || echo "Requires root"', icon: 'fa-user-lock', color: 'darkRed' },
        ]
    },
    {
        title: 'Bandwidth & Speed',
        commands: [
            { label: 'Network Stats', cmd: 'cat /proc/net/dev', icon: 'fa-chart-line', color: 'cyanBlue' },
            { label: 'Interface Stats', cmd: 'ip -s link show', icon: 'fa-signal', color: 'emeraldTeal' },
            { label: 'Speed Test', cmd: 'curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python3 - --simple 2>/dev/null || echo "Speed test failed"', icon: 'fa-tachometer-alt', color: 'pinkRose' },
            { label: 'Download Test', cmd: 'curl -o /dev/null -w "Speed: %{speed_download} bytes/sec\\nTime: %{time_total}s\\n" https://speed.cloudflare.com/__down?bytes=10000000', icon: 'fa-download', color: 'blueIndigo' },
        ]
    },
    {
        title: 'Troubleshooting',
        commands: [
            { label: 'ARP Table', cmd: 'arp -a 2>/dev/null || ip neigh show', icon: 'fa-table', color: 'gray' },
            { label: 'Network Errors', cmd: 'netstat -i 2>/dev/null || cat /proc/net/dev', icon: 'fa-exclamation-triangle', color: 'red' },
            { label: 'Dropped Packets', cmd: 'ip -s link | grep -A 2 "RX\\|TX"', icon: 'fa-times-circle', color: 'yellowOrange' },
            { label: 'MTU Values', cmd: 'ip link show | grep mtu', icon: 'fa-ruler', color: 'blueIndigo' },
            { label: 'Kernel Network', cmd: 'sysctl -a 2>/dev/null | grep net.ipv4 | head -20', icon: 'fa-terminal', color: 'cyanBlue' },
        ]
    },
];

// Flat commands list for export compatibility
export const commands = commandGroups.flatMap(group => group.commands);

export default function NetworkUtility(props: NetworkProps) {
    const terminalRef = useRef<InteractiveTerminalRef>(null);
    const rootDir = useAppState.use.rootDir();
    const [isRunning, setIsRunning] = useState(false);
    const [customHost, setCustomHost] = useState('');
    const [customPort, setCustomPort] = useState('');

    useEffect(() => {
        if (config.useDemo) {
            terminalRef.current?.write("🌐 Network Utility Tool - Demo Mode");
            terminalRef.current?.write("\n");
            terminalRef.current?.write("Please use it in your local machine for full functionality.");
            terminalRef.current?.write("\n");
            terminalRef.current?.write("Visit https://www.npmjs.com/package/monorepotime to know more.");
            terminalRef.current?.write("\n");
            return;
        }

        return () => {
            if (terminalRef.current) {
                terminalRef.current.disconnect();
            }
        }
    }, []);

    function execute(cmd: string) {
        if (config.useDemo) {
            return;
        }

        if (terminalRef.current) {
            terminalRef.current.clear();
            terminalRef.current.disconnect();

            terminalRef.current.onClose(() => {
                setIsRunning(false);
            });
            terminalRef.current.onCrash(() => {
                setIsRunning(false);
            });
            
            setIsRunning(true);
            terminalRef.current.connect(rootDir, cmd);
            terminalRef.current.fit();
        }
    }

    function handleCommand(cmd: string) {
        if (config.useDemo) {
            return;
        }
        execute(cmd);
    }

    function handleStop() {
        if (config.useDemo) {
            return;
        }

        if (terminalRef.current) {
            terminalRef.current.disconnect();
            setIsRunning(false);
        }
    }

    function handleCustomPing() {
        if (customHost.trim()) {
            execute(`ping -c 4 ${customHost.trim()}`);
        }
    }

    function handleCustomPortCheck() {
        if (customPort.trim()) {
            const port = customPort.trim();
            execute(`ss -tlnp | grep ":${port}" || echo "Port ${port} is not listening"`);
        }
    }

    return (
        <div className={`h-[92%] w-full p-4 gap-6 ${props.isVisible ? 'flex' : 'hidden'}`}>
            {/* Left Panel - Commands */}
            <div className="w-[360px] lg:w-[440px] xl:w-[480px] flex-none h-full flex flex-col overflow-hidden">
                {/* Header Card */}
                <div className="mb-4 w-full p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                            <i className="fas fa-network-wired text-white text-xl"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg">Network Utility</span>
                            <span className="text-gray-400 text-xs">Diagnostics, Docker & Monitoring</span>
                        </div>
                    </div>
                    
                    {/* Custom Ping Input */}
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Custom host to ping..."
                            value={customHost}
                            onChange={(e) => setCustomHost(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCustomPing()}
                            className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                            disabled={isRunning}
                        />
                        <button
                            onClick={handleCustomPing}
                            disabled={isRunning || !customHost.trim()}
                            className="px-4 py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-600/30 hover:border-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <i className="fas fa-satellite-dish mr-2"></i>Ping
                        </button>
                    </div>
                    
                    {/* Custom Port Check Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Check port (e.g., 3000, 8080)..."
                            value={customPort}
                            onChange={(e) => setCustomPort(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCustomPortCheck()}
                            className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors"
                            disabled={isRunning}
                        />
                        <button
                            onClick={handleCustomPortCheck}
                            disabled={isRunning || !customPort.trim()}
                            className="px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-600/30 hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <i className="fas fa-door-open mr-2"></i>Check
                        </button>
                    </div>
                </div>

                {/* Scrollable Command Groups */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {commandGroups.map((group) => (
                        <TransparentCard key={group.title} title={group.title} description={`${group.commands.length} commands`}>
                            {group.commands.map((c) => (
                                <Button2
                                    key={c.label}
                                    onClick={() => handleCommand(c.cmd)}
                                    name={c.label}
                                    description={c.cmd.length > 50 ? c.cmd.substring(0, 47) + '...' : c.cmd}
                                    color={c.color}
                                    icon={c.icon}
                                    disabled={isRunning}
                                />
                            ))}
                        </TransparentCard>
                    ))}
                </div>
            </div>

            {/* Right Panel - Terminal */}
            <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded-xl overflow-hidden border border-white/[0.08] shadow-[0_0_100px_-20px_rgba(6,182,212,0.3)]">
                <TerminalHeader
                    title="Network Output"
                    description="Command results"
                    icon="fas fa-terminal"
                    handleStop={handleStop}
                    isRunning={isRunning}
                >
                    <i className="fas fa-network-wired text-cyan-400 mr-2"></i>
                    Network diagnostics, ports, Docker, and system monitoring
                </TerminalHeader>

                {/* Terminal Body */}
                <div className="w-full flex-1 min-h-0 p-2 bg-black/20">
                    <InteractiveTerminal
                        ref={terminalRef}
                        isInteractive={true}
                        className="h-full w-full"
                        socketUrl={config.serverPath}
                        onExit={() => {
                            setIsRunning(false);
                        }}
                        onCrash={() => {
                            setIsRunning(false);
                        }}
                    />
                </div>
            </div>
        </div>
    )
}