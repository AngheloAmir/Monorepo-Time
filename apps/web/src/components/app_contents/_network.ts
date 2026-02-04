export interface Command {
    label: string;
    displayCmd: string;

    /**
     * Linux Command
     */
    cmd: string;

    /**
     * Windows Command
     */
    cmdWindow: string;

    /**
     * macOS Command
     */
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
             {
                label: 'Test TCP Port',
                displayCmd: 'nc -zv',
                cmd: 'nc -zv {{input}}',
                cmdWindow: 'powershell -Command "Test-NetConnection -ComputerName ({{input}} -replace \' .*$\', \'\') -Port ({{input}} -replace \'^.* \', \'\')"',
                cmdMac: 'nc -zv {{input}}',
                icon: 'fa-network-wired',
                color: 'emeraldTeal',
                requiresInput: true,
                confirmMessage: 'Enter hostname and port (e.g., google.com 80)',
                inputLabel: 'Host Port',
                inputPlaceholder: 'google.com 80'
            },
            {
                label: 'Curl w/ Timing',
                displayCmd: 'curl -v',
                cmd: 'curl -v --connect-timeout 5 {{input}}',
                cmdWindow: 'curl -v --connect-timeout 5 {{input}}',
                cmdMac: 'curl -v --connect-timeout 5 {{input}}',
                icon: 'fa-stopwatch',
                color: 'blueIndigo',
                requiresInput: true,
                inputLabel: 'URL',
                inputPlaceholder: 'google.com'
            },
        ]
    },

    {
        title: "Docker",
        commands: []
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
        title: 'Docker Debugging',
        commands: [
            {
                label: 'Ping Container',
                displayCmd: 'docker exec ping',
                cmd: 'docker exec {{input}} ping -c 3 8.8.8.8',
                cmdWindow: 'docker exec {{input}} ping -c 3 8.8.8.8', // Containers are usually Linux
                cmdMac: 'docker exec {{input}} ping -c 3 8.8.8.8',
                icon: 'fa-globe',
                color: 'cyanBlue',
                requiresInput: true,
                inputLabel: 'Container Name/ID',
                inputPlaceholder: 'container_name'
            },
            {
                label: 'Docker Events',
                displayCmd: 'docker events',
                cmd: 'docker events --since 10m',
                cmdWindow: 'docker events --since 10m',
                cmdMac: 'docker events --since 10m',
                icon: 'fa-history',
                color: 'blueIndigo'
            },
            {
                label: 'Health Check',
                displayCmd: 'docker inspect health',
                cmd: 'docker inspect --format=\'{{.State.Health.Status}}\' {{input}}',
                cmdWindow: 'docker inspect --format="{{.State.Health.Status}}" {{input}}',
                cmdMac: 'docker inspect --format=\'{{.State.Health.Status}}\' {{input}}',
                icon: 'fa-heartbeat',
                color: 'pinkRose',
                requiresInput: true,
                inputLabel: 'Container Name/ID',
                inputPlaceholder: 'container_name'
            },
            {
                label: 'List Networks',
                displayCmd: 'docker network ls',
                cmd: 'docker network ls',
                cmdWindow: 'docker network ls',
                cmdMac: 'docker network ls',
                icon: 'fa-sitemap',
                color: 'blueIndigo'
            },
            {
                label: 'Container IP',
                displayCmd: 'docker inspect IP',
                cmd: 'docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' {{input}}',
                cmdWindow: 'docker inspect -f "{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}" {{input}}', // Windows uses double quotes often
                cmdMac: 'docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' {{input}}',
                icon: 'fa-fingerprint',
                color: 'cyanBlue',
                requiresInput: true,
                inputLabel: 'Container Name/ID',
                inputPlaceholder: 'container_name'
            },
            {
                label: 'Service Connect Test',
                displayCmd: 'docker exec curl',
                cmd: 'docker exec {{input}} curl -I',
                cmdWindow: 'docker exec {{input}} curl -I',
                cmdMac: 'docker exec {{input}} curl -I',
                icon: 'fa-plug',
                color: 'pinkRose',
                requiresInput: true,
                confirmMessage: 'Enter container name followed by target URL (e.g. my-app http://db:5432)',
                inputLabel: 'Container + URL',
                inputPlaceholder: 'my-container http://target:80'
            },
        ]
    },

    {
        title: "Network",
        commands: []
    },

    {
        title: "Network Troubleshooting",
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
        ]
    },

    {
        title: 'Network Debugging',
        commands: [
            {
                label: 'Info',
                displayCmd: 'iptables/netsh',
                cmd: 'sudo iptables -L -n -v',
                cmdWindow: 'netsh advfirewall show allprofiles',
                cmdMac: 'sudo pfctl -s rules',
                icon: 'fa-shield-alt',
                color: 'red'
            },
            {
                label: 'UFW Status',
                displayCmd: 'ufw status',
                cmd: 'sudo ufw status verbose',
                cmdWindow: 'netsh advfirewall show allprofiles', // Fallback
                cmdMac: 'sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate',
                icon: 'fa-fire-alt',
                color: 'yellowOrange'
            },
            { 
                label: 'Dig (DNS)', 
                displayCmd: 'dig +short',
                cmd: 'dig {{input}} +short', 
                cmdWindow: 'nslookup {{input}}',
                cmdMac: 'dig {{input}} +short',
                icon: 'fa-search', 
                color: 'yellowOrange',
                requiresInput: true, 
                inputLabel: 'Domain',
                inputPlaceholder: 'example.com'
            },
            { 
                label: 'Container DNS Config', 
                displayCmd: 'cat /etc/resolv.conf',
                cmd: 'docker exec {{input}} cat /etc/resolv.conf', 
                cmdWindow: 'docker exec {{input}} cat /etc/resolv.conf',
                cmdMac: 'docker exec {{input}} cat /etc/resolv.conf',
                icon: 'fa-file-alt', 
                color: 'emeraldTeal',
                requiresInput: true, 
                inputLabel: 'Container Name/ID',
                inputPlaceholder: 'container_name'
            },
            {
                label: 'Who Owns Port',
                displayCmd: 'fuser/lsof',
                cmd: 'fuser -n tcp {{input}} -v',
                cmdWindow: 'netstat -ano | findstr :{{input}}',
                cmdMac: 'lsof -i :{{input}}',
                icon: 'fa-user-secret',
                color: 'gray',
                requiresInput: true,
                inputLabel: 'Port Number',
                inputPlaceholder: '8080'
            },
            {
                label: 'Live Connections',
                displayCmd: 'ss established',
                cmd: 'ss -tn state established',
                cmdWindow: 'netstat -an | findstr ESTABLISHED',
                cmdMac: 'netstat -an | grep ESTABLISHED',
                icon: 'fa-project-diagram',
                color: 'emeraldTeal'
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