import { create } from 'zustand';

// Define states as constants in an object
export const DangoState = Object.freeze({
    INITIAL: "INITIAL",
    INITIAL_DONE: "INITIAL_DONE",
    RECORDING: "RECORDING",
    RECORDING_STOPPED: "RECORDING_STOPPED",
    OTHER_ANSWER: "OTHER_ANSWER",
    OTHER_ANSWER_DONE: "OTHER_ANSWER_DONE",
    CLARIFICATION: "CLARIFICATION",
    GENERATING_DSL: "GENERATING_DSL",
    REGENERATING_DSL: "REGENERATING_DSL",
    REVIEW_DSL: "REVIEW_DSL",
    EDIT_DSL: "EDIT_DSL",
    RUNNING_DSL: "RUNNING_DSL",
    COMPLETED: "COMPLETED",
});

// Create the Zustand store using these states
export const useDangoStateStore = create((set) => ({
    curState: DangoState.INITIAL, // Initialize with the INITIAL state
    setCurState: (state) => {
        if (Object.values(DangoState).includes(state)) {
            set({ curState: state });
        } else {
            console.error(`Invalid state: ${state}`);
        }
    },
}));

