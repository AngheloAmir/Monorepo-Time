import { useEffect } from "react";
import useAppState from "../../appstates/app";

export default function NotesEditor({ isVisible }: { isVisible: boolean }) {
    const notes        = useAppState.use.notes();
    const noteNotFound = useAppState.use.noteNotFound();
    const loadNotes    = useAppState.use.loadNotes();
    const setNotes     = useAppState.use.setNotes();
    const saveNotes    = useAppState.use.saveNotes();
   
    useEffect(() => {
        if(isVisible)
            loadNotes();
    }, [isVisible])

    // Auto-save logic
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!noteNotFound) {
                saveNotes();
            }
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [notes, noteNotFound, saveNotes]);

    if(noteNotFound) {
        return (
            <div>
                <h3 className="font-bold text-gray-200">Notes</h3>
                <p className="text-gray-400">monorepotime.json not found</p>
            </div>
        )
    }

    return (
        <div className="h-[420px] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <i className="fas fa-sticky-note text-yellow-500"></i>
                    </div>
                    <h3 className="font-bold text-gray-200">Notes</h3>
                </div>
            </div>
            
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your project notes, todos, or ideas here..."
                className="flex-1 w-full p-4 bg-transparent border-none outline-none resize-none text-gray-300 placeholder-gray-600 font-mono text-sm leading-relaxed"
                spellCheck={false}
            />
        </div>
    );
}
