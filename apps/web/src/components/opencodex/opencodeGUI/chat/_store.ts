import { create } from 'zustand';
import { createSelectors } from '../../../../appstates/zustandSelector';


interface ChatStore {

}

const useChatStoreBase = create<ChatStore>((_set, _get) => ({
   
}))

const useChatStore = createSelectors(useChatStoreBase);
export default useChatStore;
