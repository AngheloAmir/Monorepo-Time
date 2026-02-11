import { useRef, useState } from "react";
import InteractiveTerminal, { type InteractiveTerminalRef } from "../InteractiveTerminal";
import Button2 from "../ui/Button2";
import config from 'config';
import useAppState from "../../appstates/app";
import TransparentCard from "../ui/TransparentCard";
import TerminalHeader from "../ui/TerminalHeader";
import useModal from "../../modal/modals";

interface CloudflareProps {
    isVisible: boolean
}

export default function Cloudflare(props: CloudflareProps) {
    const terminalRef = useRef<InteractiveTerminalRef>(null);
    const rootDir = useAppState.use.rootDir();
    const showModal = useModal.use.showModal();
    const [isRunning, setIsRunning] = useState(false);

    async function startTunnel() {
        if (config.useDemo) {
            return;
        }

        showModal("prompt", "Port to expose", "Enter the port number to expose with Cloudflare's tunnel", "success", (port: any) => {
            if (port) {
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
                    terminalRef.current.connect(rootDir, `cloudflared tunnel --url http://localhost:${port}`);
                    terminalRef.current.fit();
                }
            }
        });
    }

    function checkCloudflare() {
        if (terminalRef.current) {
            terminalRef.current.clear();
            terminalRef.current.disconnect();
            terminalRef.current.connect(rootDir, `cloudflared -v`);
            terminalRef.current.fit();
        }
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

    return (
        <div className={`h-[92%] w-full p-4 gap-6 ${props.isVisible ? 'flex' : 'hidden'}`}>
            <div className="w-[360px] lg:w-[440px] xl:w-[480px]  flex-none h-full flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <TransparentCard title="Cloudflare" description="Commands" contentClassName="flex flex-col py-2 px-6">
                        <Button2
                            onClick={startTunnel}
                            name="Generate Tunnel"
                            description="cloudflared tunnel"
                            color="blueIndigo"
                            icon="fas fa-cloud"
                            disabled={isRunning}
                        />
                        <p className="text-gray-400 text-xs mt-2">
                            * This app support only one tunnel at a time
                            <br />
                            ** Closing the browser, refeshing the page, or starting a new tunnel
                            will close the previous tunnel.
                            <br />
                            *** Not affiliated with Cloudflare.  Use only for testing purposes. I am not responsible for any
                            issues caused by using this feature. It is a bad idea to use this
                            feature in production as Cloudflare can close the tunnel at any time
                            without any warning.
                            <br/>
           
                        </p>
                    </TransparentCard>

                    <TransparentCard title="Setup Cloudflare Tunnel" description="" contentClassName="flex py-2 px-6">
                        <p className="text-gray-400 text-sm">
                            Before a tunnel service is created, download and install Cloudflare's CLI tool on your machine.
                            <br />
                            <br />
                            <a
                                href="https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                                Cloudflare Quick Tunnel
                            </a>
                            <br />
                            <a
                                href="https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                                Cloudflare Downloads
                            </a>

                            <br />
                            <br />
                            Click the button below to check the version of cloudflare installed on your machine.
                            If the version is not found, it means cloudflare is not installed on your machine.
                            <br />
                            <br />
                            <Button2
                                onClick={checkCloudflare}
                                name="Check Cloudflare Version"
                                description="cloudflared -v"
                                color="skyBlue"
                                icon="fas fa-cloud"
                            />
                        </p>
                    </TransparentCard>
                </div>
            </div>

            <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded-xl overflow-hidden">
                <TerminalHeader
                    title="Terminal Output"
                    description="Execute commands"
                    icon="fas fa-terminal"
                    handleStop={handleStop}
                    isRunning={isRunning}
                >
                    Generate tunnel service with
                    <a
                        href="https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                        Cloudflare Free Tier
                    </a>
                    tunnel service
                </TerminalHeader>

                <div className="w-full flex-1 min-h-0 p-2 bg-black/20">
                    <InteractiveTerminal
                        ref={terminalRef}
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