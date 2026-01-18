import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { CrudCategory } from 'types';
import apiRoute from 'apiroute';
import config from 'config';
import INITIAL_CRUD_DATA from './demo/defaultCurd';

interface CrudContext {
    noData: boolean;
    crudData: CrudCategory[];
    useDevURL: boolean;
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
    devURL:  "",
    prodURL: "",
    params:  "",

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
    setParams: (params: string) => set({ params }),
    setMethod: (method) => set({ method }),

    setCurrentCategoryIndex: (index: number) => set({ currentCategoryIndex: index }),
    setCurrentCrudIndex: (index: number) => set({ currentCrudIndex: index }),

    setCrudData: async (data) => {
        if(config.useDemo) return;

        try {
            await fetch(`${config.serverPath}${apiRoute.crudTest}`, {
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
        if(config.useDemo) {
            set({ crudData: INITIAL_CRUD_DATA, noData: false });
            return;
        }

        try {
            const response = await fetch(`${config.serverPath}${apiRoute.crudTest}`);

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
        if(config.useDemo) {
            set({
                isFetching: false,
                executionTime: 9999,
                output: "Demo mode is enabled\nPlease use it in your local machine\nVisit https://www.npmjs.com/package/monorepotime to know more."
            });
            return;
        }

        const { useDevURL, params, method, crudData, currentCategoryIndex, currentCrudIndex } = get();
        const queryString        = params ? (params.startsWith('?') ? params : `?${params}`) : "";
        const encodedQueryString = encodeURI(queryString);
        const currentURL         = useDevURL ? crudData[currentCategoryIndex].devurl : crudData[currentCategoryIndex].produrl;
        const url                = `${currentURL}${crudData[currentCategoryIndex].items[currentCrudIndex].route}${encodedQueryString}`;
        const startTime          = Date.now();

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
