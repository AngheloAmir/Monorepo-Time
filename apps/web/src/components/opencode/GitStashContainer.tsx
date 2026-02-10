import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useGitStash from "../../appstates/gitstash";
import GitStash from "./GitStash";

export default function GitStashContainer() {
    const showStash    = useGitStash.use.showStash();
    const setShowStash = useGitStash.use.setShowStash();
    const [coords, setCoords]       = useState<{ x: number; y: number } | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!showStash) {
            setIsVisible(false);
            setCoords(null);
            return;
        }

        const updatePosition = () => {
            const button = document.getElementById('git-stash-button');
            if (button) {
                const rect = button.getBoundingClientRect();
                setCoords({
                    x: rect.left - 64,
                    y: window.innerHeight - rect.top,
                });
            }
        };

        // Initial position update
        updatePosition();
        
        // Show after a brief delay to ensure coords are set and prevent FOUC
        const timer = setTimeout(() => setIsVisible(true), 50);

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [showStash]);

    if (!showStash || !coords) return null;
    return createPortal(
        <>
            <div className="fixed inset-0 z-40" onClick={() => setShowStash(false)} />
            <div
                className="fixed w-72 min-h-64 bg-gray-900  border border-blue-500/50 rounded overflow-hidden z-50 flex flex-col"
                style={{
                    left:    coords.x,
                    bottom:  coords.y + 8,
                    opacity: isVisible ? 1 : 0,
                    transition: "opacity 0.2s ease-in-out",
                }}
            >
                <GitStash />
            </div>
        </>,
        document.body
    );
}