import useCrudState from "../../appstates/crud";
import CustomAceEditor from "./CustomAceEditor";

interface CodeExampleProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CodeExample({ isOpen, onClose }: CodeExampleProps) {
    const { 
        crudData, 
        currentCategoryIndex, 
        currentCrudIndex, 
        useDevURL, 
        params, 
        method, 
        header, 
        body 
    } = useCrudState();

    if (!isOpen || currentCategoryIndex === -1 || currentCrudIndex === -1) return null;

    const item    = crudData[currentCategoryIndex].items[currentCrudIndex];
    const baseUrl = useDevURL ?
        crudData[currentCategoryIndex].devurl :
        crudData[currentCategoryIndex].produrl;
    const fullUrl = `${baseUrl}${item.route}${params ? `?${params}` : ""}`;
    
    let code = "";

    if (method === "STREAM") {
        code = `const url = "${fullUrl}";

const response = await fetch(url, {
  method: "GET",
  headers: ${header}
});

if (!response.body) throw new Error("No response body");

const reader = response.body.getReader();
const decoder = new TextDecoder("utf-8");

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value, { stream: true });
  console.log(chunk);
}`;
    } else {
        const hasBody = method !== "GET";
        
        // Manually constructing string to control formatting better than JSON.stringify for code generation
        let optionsString = `{\n  method: "${method}",\n  headers: ${header}`;
        
        if (hasBody) {
             // Try to format body if it's JSON
             let bodyStr = body;
             try {
                // Formatting JSON body for readability
                 bodyStr = JSON.stringify(JSON.parse(body), null, 2).replace(/\n/g, '\n  ');
                 optionsString += `,\n  body: JSON.stringify(${bodyStr})`;
             } catch (e) {
                 // Fallback if body is not valid JSON
                 optionsString += `,\n  body: ${JSON.stringify(body)}`;
             }
        }
        
        optionsString += "\n}";

        code = `const url = "${fullUrl}";
        
const response = await fetch(url, ${optionsString});

const data = await response.json();
console.log(data);`;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-3xl flex flex-col h-[70vh]">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <i className="fas fa-code text-blue-400"></i>
                         Code Example
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="flex-1 overflow-hidden p-1 relative">
                    <CustomAceEditor
                        value={code}
                        mode="javascript"
                        theme="monokai"
                        readOnly={true}
                        transparent={true}
                    />
                </div>

                <div className="p-4 border-t border-white/5 flex justify-end gap-2">
                     <button 
                        onClick={() => {
                            navigator.clipboard.writeText(code);
                            alert("Code copied to clipboard!");
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Copy Code
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
