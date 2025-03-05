import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type JLPTLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';



export type Category = 'kanji' | 'sentences' | 'vocabulary' | 'grammar';

export type CategoryProgress = {
    [key in Category]: number;
};

export type LevelProgress = {
    [key in JLPTLevel]: CategoryProgress;
};

interface UserState {
    name: string | null;
    kaoPic: string | null;
    userLevel: number | null;
    levelProgress: LevelProgress | null;
    lastPromptConfig: Record<string, unknown>;
}

const initialState: UserState = {
    name: null,
    kaoPic: null,
    userLevel: null,
    levelProgress: null,
    lastPromptConfig: {},
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<{ 
            name: string; 
            kaoPic: string; 
            userLevel: number;
            levelProgress: LevelProgress;
        }>) => {
            state.name = action.payload.name;
            state.kaoPic = action.payload.kaoPic;
            state.userLevel = action.payload.userLevel;
            state.levelProgress = action.payload.levelProgress;
        },
        setLastPromptConfig: (state, action: PayloadAction<Record<string, unknown>>) => {
            state.lastPromptConfig = action.payload;
        },
        clearUserData: (state) => {
            state.name = null;
            state.kaoPic = null;
            state.userLevel = null;
            state.levelProgress = null;
            state.lastPromptConfig = {};
        },
    },
});

export const { setUserData, setLastPromptConfig, clearUserData } = userSlice.actions;

export default userSlice.reducer; 