export interface Command {
    label: string;
    displayCmd: string;
    cmd: string;
    cmdWindow: string;
    cmdMac: string;
    icon: string;
    color: string;
    description?: string;
    requiresInput?: boolean;
    inputLabel?: string;
    inputPlaceholder?: string;
    confirmMessage?: string;
}

export const commandGroups: { title: string; commands: Command[] }[] = [
    {
        title: 'Port Management',
        commands: [
            { 
                label: 'Show Open Ports',
                displayCmd: 'ss -tlnp',
                cmd: 'ss -tlnp', 
                cmdWindow: 'netstat -an',
                cmdMac: 'lsof -PiTCP -sTCP:LISTEN',
                icon: 'fa-door-open', 
                color: 'emeraldTeal', 
                description: 'List all listening TCP ports and processes' 
            },
            { 
                label: 'Close Port',
                displayCmd: 'kill process',      
                cmd: 'kill $(lsof -t -i:{{input}})', 
                cmdWindow: 'netstat -ano | findstr :{{input}}',
                cmdMac: 'kill $(lsof -t -i:{{input}})',
                icon: 'fa-skull', 
                color: 'red', 
                requiresInput: true, 
                inputLabel: 'Port to Close', 
                inputPlaceholder: 'e.g., 8080', 
                confirmMessage: 'Are you sure you want to kill the process on this port?' 
            },
        ]
    },
    {
        title: 'Docker Management',
        commands: [
            { 
                label: 'Containers', 
                displayCmd: 'docker ps',
                cmd: 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"', 
                cmdWindow: 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"',
                cmdMac: 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"',
                icon: 'fa-box', 
                color: 'cyanBlue' 
            },
            { 
                label: 'All Containers', 
                displayCmd: 'docker ps -a',
                cmd: 'docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"', 
                cmdWindow: 'docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"',
                cmdMac: 'docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"',
                icon: 'fa-boxes', 
                color: 'gray' 
            },
            { 
                label: 'Images', 
                displayCmd: 'docker images',
                cmd: 'docker images', 
                cmdWindow: 'docker images',
                cmdMac: 'docker images',
                icon: 'fa-compact-disc', 
                color: 'blueIndigo' 
            },
            { 
                label: 'Prune', 
                displayCmd: 'docker system prune',
                cmd: 'docker system prune -f', 
                cmdWindow: 'docker system prune -f',
                cmdMac: 'docker system prune -f',
                icon: 'fa-trash-alt', 
                color: 'red', 
                description: 'Remove unused data (force)' 
            },
        ]
    },
    {
        title: 'Docker Diagnostics',
        commands: [
            { 
                label: 'Logs', 
                displayCmd: 'docker logs',
                cmd: 'docker logs --tail 200 {{input}}', 
                cmdWindow: 'docker logs --tail 200 {{input}}',
                cmdMac: 'docker logs --tail 200 {{input}}',
                icon: 'fa-file-medical-alt', 
                color: 'yellowOrange', 
                requiresInput: true, 
                confirmMessage: 'Provide the container name or ID to view its logs',
                inputLabel: 'Container Name/ID', 
                inputPlaceholder: 'running-container-name' 
            },
            { 
                label: 'Inspect', 
                displayCmd: 'docker inspect',
                cmd: 'docker inspect {{input}}', 
                cmdWindow: 'docker inspect {{input}}',
                cmdMac: 'docker inspect {{input}}',
                icon: 'fa-microscope', 
                color: 'cyanBlue', 
                requiresInput: true, 
                confirmMessage: 'Provide the container name or ID to inspect it',
                inputLabel: 'Container Name/ID', 
                inputPlaceholder: 'running-container-name' 
            },
            { 
                label: 'Stats', 
                displayCmd: 'docker stats',
                cmd: 'docker stats --no-stream {{input}}', 
                cmdWindow: 'docker stats --no-stream {{input}}',
                cmdMac: 'docker stats --no-stream {{input}}',
                icon: 'fa-heartbeat', 
                color: 'pinkRose', 
                requiresInput: true, 
                confirmMessage: 'Provide the container name or ID to view its stats',
                inputLabel: 'Container (Optional)', 
                inputPlaceholder: 'Leave empty for all' 
            },
            { 
                label: 'Network Inspect', 
                displayCmd: 'docker network inspect',
                cmd: 'docker network inspect {{input}}', 
                cmdWindow: 'docker network inspect {{input}}',
                cmdMac: 'docker network inspect {{input}}',
                icon: 'fa-network-wired', 
                color: 'emeraldTeal', 
                requiresInput: true, 
                inputLabel: 'Network Name', 
                inputPlaceholder: 'bridge' 
            },
        ]
    },
    {
        title: 'Connectivity & Ping',
        commands: [
            { 
                label: 'Ping Host', 
                displayCmd: 'ping',
                cmd: 'ping -c 4 {{input}}', 
                cmdWindow: 'ping -n 4 {{input}}',
                cmdMac: 'ping -c 4 {{input}}', 
                icon: 'fa-satellite-dish', 
                color: 'emeraldTeal', 
                requiresInput: true, 
                confirmMessage: 'Provide the hostname or IP to ping',
                inputLabel: 'Hostname / IP', 
                inputPlaceholder: 'google.com' 
            },
            { 
                label: 'Ping Google', 
                displayCmd: 'ping google.com',
                cmd: 'ping -c 4 google.com', 
                cmdWindow: 'ping -n 4 google.com',
                cmdMac: 'ping -c 4 google.com', 
                icon: 'fa-google', 
                color: 'gray' 
            },
            { 
                label: 'Traceroute', 
                displayCmd: 'traceroute',
                cmd: 'traceroute -m 15 {{input}} 2>/dev/null || tracepath {{input}}', 
                cmdWindow: 'tracert {{input}}',
                cmdMac: 'traceroute -m 15 {{input}}', 
                icon: 'fa-route', 
                color: 'blueIndigo', 
                requiresInput: true, 
                confirmMessage: 'Provide the hostname or IP to traceroute',
                inputLabel: 'Target Host', 
                inputPlaceholder: 'github.com' 
            },
            { 
                label: 'DNS Lookup', 
                displayCmd: 'nslookup',
                cmd: 'nslookup {{input}}', 
                cmdWindow: 'nslookup {{input}}',
                cmdMac: 'nslookup {{input}}', 
                icon: 'fa-search', 
                color: 'cyanBlue', 
                requiresInput: true, 
                confirmMessage: 'Provide the domain to perform a DNS lookup',
                inputLabel: 'Domain', 
                inputPlaceholder: 'example.com' 
            },
        ]
    },
    {
        title: 'Bandwidth & System',
        commands: [
            { 
                label: 'Live Bandwidth (nethogs)', 
                displayCmd: 'sudo nethogs',
                cmd: 'sudo nethogs -t -c 5', 
                cmdWindow: 'echo "Not supported on Windows"',
                cmdMac: 'sudo nethogs -t -c 5',
                icon: 'fa-tachometer-alt', 
                color: 'pinkRose', 
                description: 'Monitor bandwidth per process (requires sudo)' 
            },
            { 
                label: 'Global Stats', 
                displayCmd: 'ip link show',
                cmd: 'echo "--- Interface Statistics ---"; ip -s link show', 
                cmdWindow: 'netstat -e',
                cmdMac: 'netstat -ib',
                icon: 'fa-chart-bar', 
                color: 'blueIndigo' 
            },
            { 
                label: 'Process Connections', 
                displayCmd: 'lsof -i',
                cmd: 'lsof -i -P -n | head -30', 
                cmdWindow: 'netstat -ano',
                cmdMac: 'lsof -i -P -n | head -30',
                icon: 'fa-project-diagram', 
                color: 'emeraldTeal' 
            },
            { 
                label: 'Top Processes', 
                displayCmd: 'ps -eo',
                cmd: 'ps -eo pid,user,pcpu,pmem,comm --sort=-%mem | head -15', 
                cmdWindow: 'tasklist',
                cmdMac: 'ps -A -o pid,user,pcpu,pmem,comm | sort -nk 4 | tail -15',
                icon: 'fa-memory', 
                color: 'yellowOrange' 
            },
        ]
    },
    {
        title: 'Troubleshoot',
        commands: [
            { 
                label: 'Reset DNA', 
                displayCmd: 'restart NetworkManager',
                cmd: 'sudo systemctl restart NetworkManager', 
                cmdWindow: 'ipconfig /flushdns',
                cmdMac: 'sudo killall -HUP mDNSResponder',
                icon: 'fa-sync', 
                color: 'red', 
                description: 'Restart Network Manager' 
            },
            { 
                label: 'ARP Table', 
                displayCmd: 'arp -a',
                cmd: 'arp -a 2>/dev/null || ip neigh show', 
                cmdWindow: 'arp -a',
                cmdMac: 'arp -a',
                icon: 'fa-table', 
                color: 'gray' 
            },
            { 
                label: 'Network Errors', 
                displayCmd: 'netstat -i',
                cmd: 'netstat -i 2>/dev/null || cat /proc/net/dev', 
                cmdWindow: 'netstat -e',
                cmdMac: 'netstat -i',
                icon: 'fa-exclamation-triangle', 
                color: 'red' 
            },
            { 
                label: 'Dropped Packets', 
                displayCmd: 'ip -s link',
                cmd: 'ip -s link | grep -A 2 "RX\\|TX"', 
                cmdWindow: 'netstat -e',
                cmdMac: 'netstat -ib',
                icon: 'fa-times-circle', 
                color: 'yellowOrange' 
            },
            { 
                label: 'MTU Values', 
                displayCmd: 'ip link show',
                cmd: 'ip link show | grep mtu', 
                cmdWindow: 'netsh interface ipv4 show subinterfaces',
                cmdMac: 'ifconfig | grep mtu',
                icon: 'fa-ruler', 
                color: 'blueIndigo' 
            },
            { 
                label: 'Kernel Network', 
                displayCmd: 'sysctl -a',
                cmd: 'sysctl -a 2>/dev/null | grep net.ipv4 | head -20', 
                cmdWindow: 'netsh interface ipv4 show global',
                cmdMac: 'sysctl -a | grep net.inet.ip | head -n 20',
                icon: 'fa-terminal', 
                color: 'cyanBlue' 
            },
        ]
    },
];