import { useState } from 'react';

interface CrudItem {
  label: string;
  route: string;
  methods: string;
  description: string;
  sampleInput: string;
  suggested: Array<{ name: string; urlparams: string; content: string }>;
  expectedOutcome: string;
  availableFor: string;
}

interface CrudCategory {
  category: string;
  devurl: string;
  produrl: string;
  items: CrudItem[];
}

const CRUD_DATA: CrudCategory[] = [
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

export default function AccordionNav() {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [selectedItem, setSelectedItem] = useState<CrudItem | null>(null);

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'text-green-500';
      case 'POST': return 'text-blue-500';
      case 'PUT': return 'text-violet-500';
      case 'DELETE': return 'text-red-500';
      case 'PATCH': return 'text-purple-500';
      case 'STREAM': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {CRUD_DATA.map((category, catIndex) => (
        <div key={catIndex} className="accordion-category flex flex-col gap-1">
          {/* Header */}
          <div
            className="accordion-header flex items-center gap-2 p-2 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors select-none group"
            onClick={() => toggleCategory(catIndex)}
          >
            <i
              className={`fas fa-chevron-right text-xs text-gray-500 transition-transform duration-200 ${
                expandedCategories.has(catIndex) ? 'rotate-90' : ''
              }`}
            ></i>
            <i
              className={`fas fa-folder text-sm text-gray-600 transition-colors duration-200 ${
                expandedCategories.has(catIndex) ? 'text-blue-400 opacity-100' : 'group-hover:text-gray-400'
              }`}
            ></i>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wide group-hover:text-white transition-colors category-title">
              {category.category}
            </span>
          </div>

          {/* Content */}
          <div className={`accordion-content flex flex-col gap-1 pl-4 border-l border-gray-700/50 ml-3 ${expandedCategories.has(catIndex) ? '' : 'hidden'}`}>
            {category.items.map((item, itemIndex) => {
              const isActive = selectedItem === item;
              return (
                <div
                  key={itemIndex}
                  className={`flex items-center gap-2 px-2 rounded-md group cursor-pointer transition-all duration-200 nav-item-row ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30 shadow-sm'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100 border border-transparent'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <span className={`font-black font-mono w-10 flex-none text-[12px] opacity-90 ${getMethodColor(item.methods)}`}>
                    {item.methods.toUpperCase()}
                  </span>
                  <span className="flex-1 truncate text-[14px]" title={item.label}>
                    {item.label}
                  </span>
                  <button
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-white text-gray-500 transition-opacity"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Edit clicked', catIndex, itemIndex);
                    }}
                  >
                    <i className="fas fa-pen text-[12px]"></i>
                  </button>
                </div>
              );
            })}

             {/* Add Route Button */}
            <button
                className="mt-2 flex items-center gap-2 px-2 py-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all group border border-dashed border-gray-700 hover:border-blue-500/50 add-route-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log('Add Route clicked', catIndex);
                }}
            >
                <i className="fas fa-plus text-[14px]"></i>
                <span className="text-[14px]">Add Route</span>
            </button>
          </div>
        </div>
      ))}

      {/* Manage Categories Button */}
      <div className="mt-4 px-2 mb-8">
        <button
            className="w-full border border-dashed border-gray-700 hover:border-blue-500/50 text-gray-500 hover:text-blue-400 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group bg-gray-800/20 hover:bg-blue-500/5"
            onClick={() => console.log('Manage clicked')}
        >
            <i className="fas fa-cog group-hover:rotate-90 transition-transform"></i>
            Manage
        </button>
      </div>
    </div>
  );
}
