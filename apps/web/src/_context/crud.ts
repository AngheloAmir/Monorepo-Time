import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { CrudCategory, CrudItem } from '../components/crud/types';
// import apiRoute from 'apiroute';
// import config   from 'config';


const INITIAL_CRUD_DATA: CrudCategory[] = [
  {
    "category": "Internal CRUD Test",
    "devurl": "http://localhost:3200",
    "produrl": "",
    "items": [
      {
        "label": "Ping the Tool Server",
        "route": "/pingme",
        "methods": "GET",
        "description": "Ping the tool server to check if it is running.",
        "sampleInput": "{}",
        "suggested": [],
        "expectedOutcome": "# You should see the word \"pong\" as a message \n\n{\n  \"message\": \"pong\"\n}",
        "availableFor": "public"
      },
      {
        "label": "Check Post",
        "route": "/pingpost",
        "methods": "POST",
        "description": "Send a POST request to check if it sending correctly",
        "sampleInput": "{\n   \"data\": \"test\",\n   \"message\": \"test\"\n}",
        "suggested": [
          {
            "name": "Customer Data",
            "urlparams": "",
            "content": "{\n    \"name\": \"Demo Customer\",\n    \"email\": \"demo@test.com\",\n    \"phone\": \"123456789\",\n    \"icon\": \"test icon\"\n}"
          }
        ],
        "expectedOutcome": "# Note \nYou should see the mirror of your inputs",
        "availableFor": "public"
      },
      {
        "label": "Check Stream",
        "route": "/pingstream",
        "methods": "STREAM",
        "description": "Send a stream request to check if it sending correctly",
        "sampleInput": "{ }",
        "suggested": [
          {
            "name": "I Wandered Lonely as a Cloud",
            "urlparams": "?poem=I%20Wandered%20Lonely%20as%20a%20Cloud",
            "content": "{}"
          },
          {
            "name": "The Sun Has Long Been Set",
            "urlparams": "?poem=The%20Sun%20Has%20Long%20Been%20Set",
            "content": "{}"
          }
        ],
        "expectedOutcome": "# Note \nYou should see the stream of words",
        "availableFor": "public"
      }
    ]
  }
];

const editorStateDefault = {
    isOpen: false,
    catIndex: -1,
    itemIndex: -1
};

interface EditorState {
    isOpen: boolean;
    catIndex: number;
    itemIndex: number;
}

interface SelectedRoute {
    catIndex: number;
    itemIndex: number;
}

interface crudContext {
    // State
    crudData: CrudCategory[];
    selectedRoute: SelectedRoute | null;
    viewMode: 'tester' | 'manage';
    editorState: EditorState;
    isPresetsOpen: boolean;
    isCodePreviewOpen: boolean;
    activeBody: string;
    activeParams: string;
    activeHeaders: string;
    useProd: boolean;

    // Actions
    setCrudData: (data: CrudCategory[]) => void;
    setSelectedRoute: (route: SelectedRoute | null) => void;
    setViewMode: (mode: 'tester' | 'manage') => void;
    setEditorState: (state: EditorState) => void;
    setIsPresetsOpen: (isOpen: boolean) => void;
    setIsCodePreviewOpen: (isOpen: boolean) => void;
    setActiveBody: (body: string) => void;
    setActiveParams: (params: string) => void;
    setActiveHeaders: (headers: string) => void;
    setUseProd: (useProd: boolean) => void;

    // Complex Actions (Handlers)
    handleSelectRoute: (imgCatIndex: number, itemIndex: number) => void;
    handleManageCategories: () => void;
    handleAddRoute: (categoryIndex: number) => void;
    handleEditRoute: (categoryIndex: number, itemIndex: number) => void;
    handlePresetSelect: (suggestion: any) => void;
    handleSaveRoute: (data: CrudItem, catIndex: number, itemIndex: number, action: 'add' | 'update') => void;
    handleDeleteRoute: (catIndex: number, itemIndex: number) => void;
    handleUpdateCategory: (index: number, data: Partial<CrudCategory>) => void;
    handleDeleteCategory: (index: number) => void;
    handleAddCategory: (data: { category: string; devurl: string; produrl: string }) => void;
}

const crudState = create<crudContext>()((set, get) => ({
    crudData: INITIAL_CRUD_DATA,
    selectedRoute: null,
    viewMode: 'tester',
    editorState: editorStateDefault,
    isPresetsOpen: false,
    isCodePreviewOpen: false,
    activeBody: '',
    activeParams: '',
    activeHeaders: '{}',
    useProd: false,

    setCrudData: (data) => set({ crudData: data }),
    setSelectedRoute: (route) => set({ selectedRoute: route }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setEditorState: (state) => set({ editorState: state }),
    setIsPresetsOpen: (isOpen) => set({ isPresetsOpen: isOpen }),
    setIsCodePreviewOpen: (isOpen) => set({ isCodePreviewOpen: isOpen }),
    setActiveBody: (body) => set({ activeBody: body }),
    setActiveParams: (params) => set({ activeParams: params }),
    setActiveHeaders: (headers) => set({ activeHeaders: headers }),
    setUseProd: (useProd) => set({ useProd: useProd }),

    handleSelectRoute: (categoryIndex, itemIndex) => {
        const { crudData } = get();
        const selectedItem = crudData[categoryIndex]?.items[itemIndex];
        
        set({
            selectedRoute: { catIndex: categoryIndex, itemIndex },
            viewMode: 'tester',
            // Reset inputs
            activeBody: selectedItem?.sampleInput || '{}',
            activeParams: '',
            isPresetsOpen: false,
            activeHeaders: '{}',
        });
    },

    handleManageCategories: () => set({ viewMode: 'manage' }),

    handleAddRoute: (categoryIndex) => set({ 
        editorState: { isOpen: true, catIndex: categoryIndex, itemIndex: -1 } 
    }),

    handleEditRoute: (categoryIndex, itemIndex) => set({ 
        editorState: { isOpen: true, catIndex: categoryIndex, itemIndex } 
    }),

    handlePresetSelect: (suggestion) => set({
        activeBody: suggestion.content,
        activeParams: suggestion.urlparams,
        isPresetsOpen: false
    }),

    handleSaveRoute: (data, catIndex, itemIndex, action) => {
        const { crudData } = get();
        
        // Since we are pushing/splicing nested arrays, we should be careful. 
        // Zustand recommends immutable updates.
        // We will stick to the user's logic style for now but try to be safe.
        // Actually the user's logic was:
        // const newData = [...crudData];
        // newData[catIndex].items.push(data); 
        // This mutates the category object *inside* the array if we don't clone it.
        // But let's follow the user's logic pattern to minimize friction, standard mutation is risky in React/Zustand but 
        // if the *array* reference changes (newData), it usually triggers re-render.
        // Better:
        const newHelper = crudData.map((cat, i) => {
            if (i !== catIndex) return cat;
            const newItems = [...cat.items];
            if (action === 'add') {
                newItems.push(data);
            } else {
                newItems[itemIndex] = data;
            }
            return { ...cat, items: newItems };
        });

        // Determine selection
        let newSelectedRoute = get().selectedRoute;
        if (action === 'add') {
             newSelectedRoute = { catIndex, itemIndex: newHelper[catIndex].items.length - 1 };
        }

        set({ 
            crudData: newHelper, 
            viewMode: 'tester',
            selectedRoute: newSelectedRoute,
            activeBody: data.sampleInput || '{}',
            activeParams: '',
            isPresetsOpen: false
        });
    },

    handleDeleteRoute: (catIndex, itemIndex) => {
        const { crudData, selectedRoute } = get();
        
        const newHelper = crudData.map((cat, i) => {
            if (i !== catIndex) return cat;
            const newItems = [...cat.items];
            newItems.splice(itemIndex, 1);
            return { ...cat, items: newItems };
        });
        
        let newSelectedRoute = selectedRoute;
        if (selectedRoute && selectedRoute.catIndex === catIndex && selectedRoute.itemIndex === itemIndex) {
            newSelectedRoute = null;
        }

        set({ crudData: newHelper, selectedRoute: newSelectedRoute });
    },

    handleUpdateCategory: (index, data) => {
        const { crudData } = get();
        const newData = [...crudData];
        newData[index] = { ...newData[index], ...data };
        set({ crudData: newData });
    },

    handleDeleteCategory: (index) => {
        const { crudData, selectedRoute } = get();
        const newData = [...crudData];
        newData.splice(index, 1);
        
        let newSelectedRoute = selectedRoute;
        if (selectedRoute && selectedRoute.catIndex === index) {
            newSelectedRoute = null;
        }
        set({ crudData: newData, selectedRoute: newSelectedRoute });
    },

    handleAddCategory: (data) => {
        const { crudData } = get();
        const newCategory: CrudCategory = {
            ...data,
            items: []
        };
        set({ crudData: [...crudData, newCategory] });
    }
}));

const useCrudState = createSelectors(crudState);
export default useCrudState;
