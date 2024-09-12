import { create } from "zustand";

export const useTableMetaStore = create((set, get) => ({
    tableMeta: {}, // Stores metadata indexed by filename

    // Set metadata for a specific file
    setMetaForFile: (filename, meta) => set(state => ({
        tableMeta: {
            ...state.tableMeta,
            [filename]: meta
        }
    })),

    // Get metadata for a specific file
    getMetaForFile: (filename) => get().tableMeta[filename] || {},

    // Clear metadata for a specific file
    clearMetaForFile: (filename) => set(state => {
        const newTableMeta = { ...state.tableMeta };
        delete newTableMeta[filename];
        return { tableMeta: newTableMeta };
    }),

    // Optional: Clear all metadata
    clearAllMeta: () => set({ tableMeta: {} })
}));
