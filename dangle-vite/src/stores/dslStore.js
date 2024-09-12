import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export const useDslStore = create((set, get) => ({
    curDSL: [], // Current DSL
    dslList: [], // List of all DSLs
    requiredTables: [], // New state for required tables
    stepByStepPlan: '', // New state for step-by-step plan

    // Set the current DSL and add it to the DSL list with an index
    setDSL: (newDsl) => {
        // check if exists

        set({ curDSL: newDsl.map(item => ({ ...item, id: uuidv4() })) });
    },

    deleteStatement: (id) => {
        const curDSL = get().curDSL;
        console.log("curDSL:", curDSL);
        console.log("id:", id);
        const updatedDSL = curDSL.filter(item => item.id !== id);
        console.log("updatedDSL:", updatedDSL);
        set({ curDSL: updatedDSL });
    },

    addDSL2List: (newDsl) => {
        // check if exists
        if (get().dslList.find((item) => item.dsl === newDsl)) {
            return;
        }

        const dslList = get().dslList;
        const newIndex = dslList.length;
        const updatedDslList = [...dslList, { index: newIndex, dsl: newDsl }];
        set({ dslList: updatedDslList });
    },
    deleteDSLFromList: (dsl) => {
        const dslList = get().dslList;
        const updatedDslList = dslList.filter((item) => item.dsl !== dsl);
        set({ dslList: updatedDslList });
    },

    // New function to set required tables
    setRequiredTables: (tables) => {
        set({ requiredTables: tables });
    },

    // New function to set step-by-step plan
    setStepByStepPlan: (plan) => {
        set({ stepByStepPlan: plan });
    },

    // New getter functions
    getRequiredTables: () => get().requiredTables,
    getStepByStepPlan: () => get().stepByStepPlan,

    // Get the current DSL
    getDSL: () => get().curDSL,

    // Get the list of all DSLs
    getDSLList: () => get().dslList,

    // Clear the current DSL
    clearDSL: () => set({ curDSL: [] }),

    deleteDSL: (dsl) => {
        const dslList = get().dslList;
        const updatedDslList = dslList.filter((item) => item.dsl !== dsl);
        set({ dslList: updatedDslList });
        if (dsl === get().curDSL) {
            set({ curDSL: [] });
        }
    },

    addEmptyDSL: () => {
        const emptyDSL = {
            id: uuidv4(),
            function_name: null,
            arguments: [],
            natural_language: "",
            condition: null
        };
        set(state => ({ curDSL: [...state.curDSL, emptyDSL] }));
    }
}));

export default useDslStore;