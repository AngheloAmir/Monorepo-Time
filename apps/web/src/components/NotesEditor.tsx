import { useState, useEffect, useCallback } from 'react';
import apiRoute from 'apiroute';
import config from 'config';

export default function NotesEditor() {
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<'saved' | 'saving' | 'error' | ''>('');
    const [isExpanded, setIsExpanded] = useState(false);

    // Fetch notes on load
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const port = config.apiPort || 3000;
                const response = await fetch(`http://localhost:${port}/${apiRoute.notes}`);
                const data = await response.json();
                setNotes(data.notes || '');
            } catch (err) {
                console.error("Failed to load notes", err);
            }
        };
        fetchNotes();
    }, []);

    // Auto-save logic
    const saveNotes = useCallback(async (newNotes: string) => {
        setStatus('saving');
        try {
            const port = config.apiPort || 3000;
            await fetch(`http://localhost:${port}/${apiRoute.notes}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: newNotes }),
            });
            setStatus('saved');
            setTimeout(() => setStatus(''), 2000);
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    }, []);

    // Debounce save
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (notes) saveNotes(notes);
        }, 1000); // 1 second debounce
        return () => clearTimeout(timeoutId);
    }, [notes, saveNotes]);


    return (
        <div className={`transition-all duration-300 flex flex-col ${isExpanded ? 'fixed inset-4 z-50 bg-gray-900 shadow-2xl rounded-2xl border border-gray-700' : 'bg-gray-800 rounded-2xl border border-gray-700 shadow-lg h-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-800/50 rounded-t-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <i className="fas fa-sticky-note text-yellow-500"></i>
                    </div>
                    <h3 className="font-bold text-gray-200">Notes</h3>
                    {status === 'saving' && <span className="text-xs text-blue-400 animate-pulse">Saving...</span>}
                    {status === 'saved' && <span className="text-xs text-green-400">Saved</span>}
                    {status === 'error' && <span className="text-xs text-red-400">Error saving</span>}
                </div>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-700 flex items-center justify-center text-gray-400 transition-colors"
                >
                    <i className={`fas fa-${isExpanded ? 'compress' : 'expand'}`}></i>
                </button>
            </div>
            
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your project notes, todos, or ideas here..."
                className="flex-1 w-full p-4 bg-transparent border-none outline-none resize-none text-gray-300 placeholder-gray-600 font-mono text-sm leading-relaxed"
                spellCheck={false}
            />
            
            {isExpanded && (
                <div className="p-2 border-t border-gray-800 text-center">
                   <button onClick={() => setIsExpanded(false)} className="text-xs text-gray-500 hover:text-gray-300">Close Fullscreen</button>
                </div>
            )}
        </div>
    );
}
