import { useEffect, useRef, useState } from "react";

interface ResizerBarProps {
    setBarWidth: (width: number) => void;
}

export default function ResizerBar({ setBarWidth }: ResizerBarProps) {
    const [isResizing, setIsResizing] = useState(false);
    const resizerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !resizerRef.current) return;
            const parent = resizerRef.current.parentElement;
            if (!parent) return;

            const maxWidth = parent.clientWidth * 0.98;
            const minWidth = parent.clientWidth * 0.02;
            const newWidth = e.clientX - parent.getBoundingClientRect().left;
            if (newWidth > maxWidth) return;
            if (newWidth < minWidth) return;
            setBarWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div
            ref={resizerRef}
            className="w-1 h-full cursor-col-resize hover:bg-white/20 active:bg-blue-500 transition-colors rounded-full"
            onMouseDown={() => setIsResizing(true)}
        />
    )
}