import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface TermCounts {
    hidden: number;
    studied: number;
    unstudied: number;
}

export interface ScheduleInfo {
    id: string;
    name: string;
    termCounts: TermCounts;
}

interface SchedulesState {
    items: ScheduleInfo[];
}

// Initial state
const initialState: SchedulesState = {
    items: [],
};

// Slice
export const schedulesSlice = createSlice({
    name: 'schedules',
    initialState,
    reducers: {
        setSchedules: (state, action: PayloadAction<ScheduleInfo[]>) => {
            state.items = action.payload;
        },
        clearSchedules: (state) => {
            state.items = [];
        },
    },
});

// Actions
export const { setSchedules, clearSchedules } = schedulesSlice.actions;

// Selectors
export const selectSchedules = (state: { schedules: SchedulesState }) => state.schedules.items;

export default schedulesSlice.reducer; 