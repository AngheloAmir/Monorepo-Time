import { useState, useEffect } from "react";
import useCrudState from "../../appstates/crud";
import type { CrudCategory } from "types";
import ModalHeader from "../ui/ModalHeader";
import ModalBody from "../ui/ModalBody";
import InputField from "../ui/InputField";
import Button3 from "../ui/Button3";

interface CategoryEditProps {
    isOpen: boolean;
    onClose: () => void;
    categoryIndex: number; // -1 for new category
}

export default function CategoryEdit({ isOpen, onClose, categoryIndex }: CategoryEditProps) {
    const crudData = useCrudState.use.crudData();
    const setCrudData = useCrudState.use.setCrudData();
    const currentCategoryIndex = useCrudState.use.currentCategoryIndex();
    const setCurrentCategoryIndex = useCrudState.use.setCurrentCategoryIndex();
    const setCurrentCrudIndex = useCrudState.use.setCurrentCrudIndex();

    const [categoryName, setCategoryName] = useState("");
    const [devUrl, setDevUrl] = useState("http://localhost:3000");
    const [prodUrl, setProdUrl] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (categoryIndex === -1) {
                // Add new category
                setCategoryName("");
                setDevUrl("http://localhost:3000");
                setProdUrl("");
            } else if (crudData[categoryIndex]) {
                // Edit existing category
                const cat = crudData[categoryIndex];
                setCategoryName(cat.category);
                setDevUrl(cat.devurl);
                setProdUrl(cat.produrl);
            }
        }
    }, [isOpen, crudData, categoryIndex]);

    const handleSave = () => {
        const newData = [...crudData];

        if (categoryIndex === -1) {
            const newCategory: CrudCategory = {
                category: categoryName,
                devurl: devUrl,
                produrl: prodUrl,
                items: []
            };
            newData.push(newCategory);
        } else {
            newData[categoryIndex] = {
                ...newData[categoryIndex],
                category: categoryName,
                devurl: devUrl,
                produrl: prodUrl
            };
        }

        setCrudData(newData);
        onClose();
    };

    const handleDelete = () => {
        const newData = [...crudData];
        newData.splice(categoryIndex, 1);

        // Update selection state if needed
        if (categoryIndex === currentCategoryIndex) {
            setCurrentCategoryIndex(-1);
            setCurrentCrudIndex(-1);
        } else if (categoryIndex < currentCategoryIndex) {
            setCurrentCategoryIndex(currentCategoryIndex - 1);
        }

        setCrudData(newData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalBody>
            <ModalHeader
                title={categoryIndex === -1 ? 'Add New Category' : 'Edit Category'}
                description={categoryIndex === -1 ? 'Add a new category' : 'Edit an existing category'}
                icon={categoryIndex === -1 ? 'fas fa-plus' : 'fas fa-edit'}
                close={onClose}
            />
            <div className="p-4 flex-1 overflow-y-auto text-md">
                <div className="flex flex-col gap-4">
                    <InputField
                        label="Category"
                        icon="fas fa-info"
                        placeholder="Category Name"
                        value={categoryName}
                        onChange={(e) => {
                            setCategoryName(e.target.value)
                        }}
                    />

                    <div className="flex gap-4">
                        <InputField
                            label="Dev URL"
                            icon="fas fa-info"
                            placeholder="Dev URL"
                            value={devUrl}
                            onChange={(e) => setDevUrl(e.target.value)}
                        />
                        <InputField
                            label="Prod URL"
                            icon="fas fa-info"
                            placeholder="Prod URL"
                            value={prodUrl}
                            onChange={(e) => setProdUrl(e.target.value)}
                        />
                    </div>
                </div>

                <footer className="mt-4 flex justify-between px-4">
                    {categoryIndex !== -1 ? <button
                        onClick={handleDelete}
                        className="group relative px-6 py-2 rounded-lg font-medium text-sm text-red-400 hover:text-red-600 transition-colors overflow-hidden" >
                        Delete
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button> : <div></div>
                    }

                    <div className="flex gap-6">
                        <button
                            onClick={onClose}
                            className="group relative px-6 py-2 rounded-lg font-medium text-sm text-gray-400 hover:text-white transition-colors overflow-hidden">
                            <span className="relative z-10">Cancel</span>
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>

                        <Button3
                            onClick={handleSave}
                            text="Save"
                            icon="fas fa-save"
                        />
                    </div>
                </footer>
            </div>
        </ModalBody>
    )
}
