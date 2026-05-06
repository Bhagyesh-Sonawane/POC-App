import { create } from 'zustand';

const useStore = create((set) => ({
  isOrderWindowOpen: true,

  setOrderWindow: (status) => set({ isOrderWindowOpen: status }),
}));

export default useStore;