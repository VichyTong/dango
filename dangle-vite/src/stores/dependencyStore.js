import { create } from 'zustand';

export const useDependencyStore = create((set, get) => ({
    dependencyList: [],
    // the format is [{sheet_id: "", dependency: [{sheet_id: "", action: ""}, ...]}, ...]

    // update dependency list
    updateDependencyList: (newList) => {
        set({ dependencyList: newList });
    },

    getDependencyList: () => get().dependencyList,

}));

