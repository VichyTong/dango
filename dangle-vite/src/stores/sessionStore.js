import { create } from 'zustand';

export const useSessionStore = create((set, get) => ({
    client_id: "", // current session id
    setClientId: (id) => set({ client_id: id }),
    clearClientId: () => set({ client_id: "" }),
    session_demonstration: [], // array of {client_id, demo}

    setSessionDemonstration: (list) => set({ session_demonstration: list }),

    updateDemo(client_id, file_name, changes) {
        set((state) => {
            // Find the session with the given client_id
            const sessionIndex = state.session_demonstration.findIndex(d => d.client_id === client_id);

            if (sessionIndex !== -1) {
                // Update the session with the given client_id
                const updatedSessionDemonstration = [...state.session_demonstration];
                const demoIndex = updatedSessionDemonstration[sessionIndex].demo.findIndex(f => f.file_name === file_name);

                if (demoIndex !== -1) {
                    // Update the demo for the existing file_name
                    updatedSessionDemonstration[sessionIndex].demo[demoIndex].changes += `\n${changes}`;
                } else {
                    // Add a new demo entry for the file_name
                    updatedSessionDemonstration[sessionIndex].demo.push({ file_name, changes });
                }

                return { session_demonstration: updatedSessionDemonstration };
            } else {
                // Add a new session object to the list
                const newSession = { client_id, demo: [{ file_name, changes }] };
                return { session_demonstration: [...state.session_demonstration, newSession] };
            }
        });
    },


    getSessionLength: () => get().session_demonstration.length,

    getSessionDemo: (client_id, file_name) => {
        const sessionIndex = get().session_demonstration.findIndex(d => d.client_id === client_id);
        if (sessionIndex !== -1) {
            const demoIndex = get().session_demonstration[sessionIndex].demo.findIndex(f => f.file_name === file_name);
            if (demoIndex !== -1) {
                return get().session_demonstration[sessionIndex].demo[demoIndex];
            }
        }
        return null;
    },
    getSession: () => get().session_demonstration,

    deleteSession: (client_id) => {
        set((state) => {
            const updatedSessionDemonstration = state.session_demonstration.filter(d => d.client_id !== client_id);
            return { session_demonstration: updatedSessionDemonstration };
        });
    },
}));

