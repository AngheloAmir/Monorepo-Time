import type { BorderColorVariant } from "../ui/_color";

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
    color: BorderColorVariant;
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
                color: 'blueIndigo',
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
                label: 'Gateway IPs',
                displayCmd: 'docker network gateways',
                cmd: 'docker network inspect $(docker network ls -q) --format \'{{printf "%-25s" .Name}} {{range .IPAM.Config}}{{.Gateway}}{{end}}\'',
                cmdWindow: 'docker network inspect $(docker network ls -q) --format "{{printf \\"%-25s\\" .Name}} {{range .IPAM.Config}}{{.Gateway}}{{end}}"',
                cmdMac: 'docker network inspect $(docker network ls -q) --format \'{{printf "%-25s" .Name}} {{range .IPAM.Config}}{{.Gateway}}{{end}}\'',
                icon: 'fa-network-wired',
                color: 'emeraldTeal'
            },
            {
                label: 'Images',
                displayCmd: 'docker images',
                cmd: 'docker images',
                cmdWindow: 'docker images',
                cmdMac: 'docker images',
                icon: 'fa-compact-disc',
                color: 'indigoFuchsia'
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
            {
                label: 'Delete Image',
                displayCmd: 'docker rmi',
                cmd: 'docker rmi {{input}}',
                cmdWindow: 'docker rmi {{input}}',
                cmdMac: 'docker rmi {{input}}',
                icon: 'fa-trash-alt',
                color: 'red',
                requiresInput: true,
                inputLabel: 'Image ID or Name',
                inputPlaceholder: 'e.g. my-image:latest',
                confirmMessage: 'Are you sure you want to delete this image?'
            },
            {
                label: 'Prune Networks',
                displayCmd: 'docker network prune',
                cmd: 'docker network prune -f',
                cmdWindow: 'docker network prune -f',
                cmdMac: 'docker network prune -f',
                icon: 'fa-trash-alt',
                color: 'yellowOrange',
                confirmMessage: 'Remove all unused local networks? This fixes many "network not found" errors.'
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
                label: 'Networks',
                displayCmd: 'docker network ls',
                cmd: 'docker network ls',
                cmdWindow: 'docker network ls',
                cmdMac: 'docker network ls',
                icon: 'fa-sitemap',
                color: 'emeraldTeal'
            },
             {
                label: 'Log Container',
                displayCmd: 'docker logs',
                cmd: 'docker logs {{input}} --tail 50',
                cmdWindow: 'docker logs {{input}} --tail 50', 
                cmdMac: 'docker logs {{input}} --tail 50',
                icon: 'fa-globe',
                color: 'cyanBlue',
                requiresInput: true,
                inputLabel: 'Container Name/ID',
                inputPlaceholder: 'container_name'
            },
            {
                label: 'Docker Events',
                displayCmd: 'docker events',
                cmd: `docker events --since 10m --format '{{.Time}}|{{.Type}}|{{if .Actor.Attributes.name}}{{.Actor.Attributes.name}}{{else}}NO_NAME{{end}}|{{.Action}}|{{range $k, $v := .Actor.Attributes}}{{$k}}={{$v}} {{end}}' | while IFS='|' read -r t type name action attrs; do printf "%-10s %-12s %-30s %-20s %s\\n" "$(date -d @$t '+%H:%M:%S')" "$type" "$name" "$action" "$attrs"; done`,
                cmdWindow: 'docker events --since 10m',
                cmdMac: `docker events --since 10m --format '{{.Time}}|{{.Type}}|{{if .Actor.Attributes.name}}{{.Actor.Attributes.name}}{{else}}NO_NAME{{end}}|{{.Action}}|{{range $k, $v := .Actor.Attributes}}{{$k}}={{$v}} {{end}}' | while IFS='|' read -r t type name action attrs; do printf "%-10s %-12s %-30s %-20s %s\\n" "$(date -r $t '+%H:%M:%S')" "$type" "$name" "$action" "$attrs"; done`,
                icon: 'fa-history',
                color: 'gray'
            },
            {
                label: 'Inspect',
                displayCmd: 'docker network inspect',
                cmd: 'docker network inspect {{input}}',
                cmdWindow: 'docker network inspect {{input}}',
                cmdMac: 'docker network inspect {{input}}',
                icon: 'fa-globe',
                color: 'indigoFuchsia',
                requiresInput: true,
                inputLabel: 'Container Name/ID',
                inputPlaceholder: 'container_name'
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
                label: 'Container IP',
                displayCmd: 'docker inspect IP',
                cmd: 'docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' {{input}}',
                cmdWindow: 'docker inspect -f "{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}" {{input}}', // Windows uses double quotes often
                cmdMac: 'docker inspect -f \'{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' {{input}}',
                icon: 'fa-fingerprint',
                color: 'skyBlue',
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
            {
                label: 'Flush DNS',
                displayCmd: 'resolvectl/ipconfig',
                cmd: 'sudo resolvectl flush-caches || sudo systemd-resolve --flush-caches',
                cmdWindow: 'ipconfig /flushdns',
                cmdMac: 'sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder',
                icon: 'fa-eraser',
                color: 'red'
            },
            {
                label: 'Release/Renew IP',
                displayCmd: 'dhclient -r',
                cmd: 'sudo dhclient -r && sudo dhclient',
                cmdWindow: 'ipconfig /release && ipconfig /renew',
                cmdMac: 'sudo ipconfig set en0 DHCP',
                icon: 'fa-sync-alt',
                color: 'red',
                confirmMessage: 'This will briefly disconnect your internet connection. Continue?'
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
                color: 'blueIndigo'
            },
            {
                label: 'UFW Status',
                displayCmd: 'ufw status',
                cmd: 'sudo ufw status verbose',
                cmdWindow: 'netsh advfirewall show allprofiles', // Fallback
                cmdMac: 'sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate',
                icon: 'fa-fire-alt',
                color: 'emeraldTeal'
            },
            {
                label: 'Dig (DNS)',
                displayCmd: 'dig +short',
                cmd: 'dig {{input}} +short',
                cmdWindow: 'nslookup {{input}}',
                cmdMac: 'dig {{input}} +short',
                icon: 'fa-search',
                color: 'blueIndigo',
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
                color: 'blueIndigo',
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
                color: 'indigoFuchsia',
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
                color: 'indigoFuchsia'
            },
            {
                label: 'ARP Table',
                displayCmd: 'arp -a',
                cmd: 'arp -a 2>/dev/null || ip neigh show',
                cmdWindow: 'arp -a',
                cmdMac: 'arp -a',
                icon: 'fa-table',
                color: 'yellowOrange'
            },
            {
                label: 'Network Errors',
                displayCmd: 'netstat -i',
                cmd: 'netstat -i 2>/dev/null || cat /proc/net/dev',
                cmdWindow: 'netstat -e',
                cmdMac: 'netstat -i',
                icon: 'fa-exclamation-triangle',
                color: 'yellowOrange'
            },
            {
                label: 'Dropped Packets',
                displayCmd: 'ip -s link',
                cmd: 'ip -s link | grep -A 2 "RX\\|TX"',
                cmdWindow: 'netstat -e',
                cmdMac: 'netstat -ib',
                icon: 'fa-times-circle',
                color: 'skyBlue'
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