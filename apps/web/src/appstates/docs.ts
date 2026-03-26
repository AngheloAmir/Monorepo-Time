import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import apiRoute from 'apiroute';
import config from 'config';

interface CrudContext {

    sample: () => Promise<void>;
}

const crudState = create<CrudContext>()((set, get) => ({

    sample: async () => {
        //this is a sample
        // await fetch(`${config.serverPath}${apiRoute.crudTest}`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({ crudtest: data }),
        //     });
    },

}));

const useCrudState = createSelectors(crudState);
export default useCrudState;
