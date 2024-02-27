import {create} from 'zustand';

const useStore = create((set) => ({
  userEmail: null,

  setUserEmail: (email) => set({ userEmail: email }),

  verifiedEmail: null,

  setVerifiedEmail: (email) => set({ verifiedEmail: email }),

  userLogged: null,

  setUserLogged: (user) => set({ userLogged: user }),

  game: null,

  setGame: (currentGame) => set({ game: currentGame }),
  
}));

export default useStore;