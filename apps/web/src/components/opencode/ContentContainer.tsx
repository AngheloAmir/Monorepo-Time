import TabTerminalHeader from "./TabTerminalHeader";
import { TerminalTabContent } from "./TerminalContainer";
import OpenCodeInitMessage from "./OpenCodeInit";
import useOpenCode from "../../appstates/opencode";
import useAppState from "../../appstates/app";
import useModal from "../../modal/modals";

interface ContentContainerProps {
    isVisible: boolean;
}

export default function ContentContainer({ isVisible }: ContentContainerProps) {
    const tabs = useOpenCode.use.tabs();
    const activeTabId = useOpenCode.use.activeTabId();
    const setActiveTabId = useOpenCode.use.setActiveTabId();
    const closeTab = useOpenCode.use.closeTab();
    const addTab = useOpenCode.use.addTab();

    const rootDir = useAppState.use.rootDir();
    const isOpenCodeInstalled = useAppState.use.isOpenCodeInstalled();
    const loadingIfOpenCodeInstalled = useAppState.use.loadingIfOpenCodeInstalled();
    const installOpenCode = useAppState.use.installOpenCode();
    const checkIfInstalled = useAppState.use.checkIfInstalled();
    const loadRootDir = useAppState.use.loadRootDir();
    const showModal = useModal.use.showModal();

    return (
        <div className="w-full h-full flex flex-col">
            <TabTerminalHeader
                tabs={tabs}
                activeTabId={activeTabId}
                setActiveTabId={setActiveTabId}
                closeTab={closeTab}
                addTab={addTab}
            />

            <div className="flex-1 min-h-0 relative">
                {tabs.map(tab => (
                    <TerminalTabContent
                        key={tab.id}
                        id={tab.id}
                        isActive={activeTabId === tab.id}
                        isVisible={isVisible}
                        rootDir={rootDir}
                        isOpenCodeInstalled={isOpenCodeInstalled}
                        loadingIfOpenCodeInstalled={loadingIfOpenCodeInstalled}
                    />
                ))}
                <OpenCodeInitMessage
                    isVisible={isVisible && !isOpenCodeInstalled && !loadingIfOpenCodeInstalled}
                    onInstall={() => {
                        try {
                            installOpenCode();
                        } catch (error) {
                            showModal(
                                "alert",
                                "Error",
                                "Unable to install OpenCode. It might be permission issue. Try to install it manually. see https://opencode.ai/docs/",
                                "error"
                            );
                        }
                        checkIfInstalled();
                        loadRootDir();
                    }}
                />
            </div>
        </div>
    )
}
