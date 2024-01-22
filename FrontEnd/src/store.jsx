import {create} from 'zustand';

const useStore = create((set) => ({
  userEmail: null,

  setUserEmail: (email) => set({ userEmail: email }),
}));

export default useStore;