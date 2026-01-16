import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { CrudCategory } from 'types';
import apiRoute from 'apiroute';
import { path } from './_relative';

interface CrudContext {
    noData: boolean;
    crudData: CrudCategory[];
    useDevURL: boolean;
    devURL: string;
    prodURL: string;
    params: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "STREAM";

    header: string;
    body: string;
    setHeader: (header: string) => void;
    setBody: (body: string) => void;

    output: string;
    expectedOutput: string;
    setOutput: (output: string) => void;
    setExpectedOutput: (expectedOutput: string) => void;

    currentCategoryIndex: number;
    setCurrentCategoryIndex: (index: number) => void;
    currentCrudIndex: number;
    setCurrentCrudIndex: (index: number) => void;

    loadCrudData: () => Promise<void>;
    setUseDevURL: (useDevURL: boolean) => void;
    setURL: (devURL: string, prodURL: string) => void;
    setParams: (params: string) => void;
    setMethod: (method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "STREAM") => void;

    requestStartTime: number;
    isFetching: boolean;
    executionTime: number;
    sendRequest: () => Promise<void>;

    setCrudData: (data: CrudCategory[]) => Promise<void>;
}

const crudState = create<CrudContext>()((set, get) => ({
    noData: true,
    crudData: [],
    currentCategoryIndex: -1,
    currentCrudIndex: -1,
    useDevURL: true,
    devURL: "http://localhost:3000",
    prodURL: "",
    params: "",

    method: "GET",

    requestStartTime: 0,
    isFetching: false,
    executionTime: 0,

    header: `{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer token",
  "x-refresh-token": "refresh-token",
  "X-CSRF-Token": "csrf-token-placeholder",
 "Cache-Control": "no-cache"
}
`,
    body: `{
  "key": "value"
}
`,
    output: `{
  "key": "value"
}
`,
    expectedOutput: `Contains what to expect from the response
example:
{
    "key": "value"
}
`,

    setHeader: (header: string) => set({ header }),
    setBody: (body: string) => set({ body }),
    setOutput: (output: string) => set({ output }),
    setExpectedOutput: (expectedOutput: string) => set({ expectedOutput }),

    setUseDevURL: (useDevURL: boolean) => set({ useDevURL }),
    setURL: (devURL: string, prodURL: string) => set({ devURL, prodURL }),
    setParams: (params: string) => set({ params }),
    setMethod: (method) => set({ method }),

    setCurrentCategoryIndex: (index: number) => set({ currentCategoryIndex: index }),
    setCurrentCrudIndex: (index: number) => set({ currentCrudIndex: index }),

    setCrudData: async (data) => {
        console.log('called')

        try {
            await fetch(`${path}${apiRoute.crudTest}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ crudtest: data }),
            });
        }
        catch(err) {
            console.log(err);
        }
        set({ crudData: data })
    },

    loadCrudData: async () => {
        try {
            const response = await fetch(`${path}${apiRoute.crudTest}`);

            if (!response.ok) {
                set({ noData: true });
                return;
            }

            const data = await response.json();
            set({ crudData: data.crudtest, noData: false });
        } catch (error) {
            set({ noData: true });
        }
    },

    sendRequest: async () => {
        const { useDevURL, devURL, prodURL, params, method, crudData, currentCategoryIndex, currentCrudIndex } = get();
        const queryString = params ? (params.startsWith('?') ? params : `?${params}`) : "";
        const encodedQueryString = encodeURI(queryString);
        const url = `${useDevURL ? devURL : prodURL}${crudData[currentCategoryIndex].items[currentCrudIndex].route}${encodedQueryString}`;
        const startTime = Date.now();

        set({ isFetching: true, requestStartTime: startTime, executionTime: 0 });

        //check if stream
        if (method === "STREAM") {
            try {
                set({ output: "" });
                const response = await fetch(url, {
                    method: "GET",
                    headers: JSON.parse(get().header),
                });

                if (!response.body) {
                    set({ isFetching: false, executionTime: Date.now() - startTime });
                    return;
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    set((state) => ({ output: state.output + chunk }));
                }
                set({ isFetching: false, executionTime: Date.now() - startTime });
            } catch (error: any) {
                let str = "";
                try {
                    str = error.toString();
                } catch (e) {
                    str = "Error: " + e;
                }
                set({ output: str, isFetching: false, executionTime: Date.now() - startTime });
            }
            return;
        }

        try {
            const options: RequestInit = {
                method,
                headers: JSON.parse(get().header),
            };

            if (method !== "GET") {
                options.body = get().body;
            }

            const response = await fetch(url, options);
            const data = await response.text();

            set({ output: data, isFetching: false, executionTime: Date.now() - startTime });
        } catch (error: any) {
            let str = "";
            try {
                str = error.toString();
            } catch (e) {
                str = "Error: " + e;
            }
            set({ output: str, isFetching: false, executionTime: Date.now() - startTime });
        }
    }
}));

const useCrudState = createSelectors(crudState);
export default useCrudState;
