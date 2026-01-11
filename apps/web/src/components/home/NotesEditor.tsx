import { useState, useEffect, useCallback } from 'react';
import apiRoute from 'apiroute';
import config from 'config';

export default function NotesEditor() {
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<'saved' | 'saving' | 'error' | ''>('');

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
        <div className="h-[420px] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <i className="fas fa-sticky-note text-yellow-500"></i>
                    </div>
                    <h3 className="font-bold text-gray-200">Notes</h3>
                    {status === 'saving' && <span className="text-xs text-blue-400 animate-pulse">Saving...</span>}
                    {status === 'saved' && <span className="text-xs text-green-400">Saved</span>}
                    {status === 'error' && <span className="text-xs text-red-400">Error saving</span>}
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
