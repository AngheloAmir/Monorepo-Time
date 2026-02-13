import { useEffect, useRef } from "react";
import useProjectState from "../../../appstates/project";
import useModal from "../../../modal/modals";

export default function EditDropdown({ path, name, onClose }: { path: string; name: string; onClose: () => void }) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const showModal = useModal.use.showModal();
    const renameItem = useProjectState.use.rename();
    const deleteItem = useProjectState.use.delete();
    const loadProjectTree = useProjectState.use.loadProjectTree();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleRename = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
        // Pass: modal, title, message, banner, callback, data, placeholder, defaultValue
        showModal("prompt", "Rename", `Enter new name for "${name}"`, "success", async (newName: any) => {
            if (newName && newName !== name) {
                await renameItem(path, newName);
                loadProjectTree();
            }
        }, null, "Enter new name", name);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
        showModal("confirm", "Delete", `Are you sure you want to delete "${name}"? This can only be undone if the file was previously committed to Git.`, "error", async (confirmed: any) => {
            if (confirmed) {
                await deleteItem(path);
                loadProjectTree();
            }
        });
    };

    return (
        <div 
            ref={dropdownRef}
            className="absolute right-0 top-full mt-1 bg-gray-800 border border-white/10 rounded shadow-xl z-50 overflow-hidden min-w-[120px]"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={handleRename}
                className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-2"
            >
                <i className="fas fa-edit text-xs text-blue-400" />
                Rename
            </button>
            <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 flex items-center gap-2"
            >
                <i className="fas fa-trash text-xs text-red-400" />
                Delete
            </button>
        </div>
    );
}
