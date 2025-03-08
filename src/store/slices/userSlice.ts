import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PromptConfig } from '../../components/PromptConfigForm';
import { RENSHUU_TOKEN_KEY, RENSHUU_PROMPT_CONFIG_KEY } from '../../constants';
import { clearToken } from './tokenSlice';
import { clearSchedules } from './schedulesSlice';
import { resetStepper } from './stepperSlice';
import { AppDispatch } from '../store';


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
    lastPromptConfig: PromptConfig | null;
    fullPrompt: string | null;
    gptPrompt: string | null;
    vocabListOnly: string | null;
    storeDataLocally: boolean;
}

export type UserProfileData = {
    name: string;
    kaoPic: string;
    userLevel: number;
    levelProgress: LevelProgress;
}

const initialState: UserState = {
    name: null,
    kaoPic: null,
    userLevel: null,
    levelProgress: null,
    lastPromptConfig: null,
    fullPrompt: null,
    gptPrompt: null,
    vocabListOnly: null,
    storeDataLocally: false,
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
        setLastPromptConfig: (state, action: PayloadAction<PromptConfig>) => {
            state.lastPromptConfig = action.payload;
        },
        setFullPrompt: (state, action: PayloadAction<string>) => {
            state.fullPrompt = action.payload;
        },
        setGptPrompt: (state, action: PayloadAction<string>) => {
            state.gptPrompt = action.payload;
        },
        setVocabListOnly: (state, action: PayloadAction<string>) => {
            state.vocabListOnly = action.payload;
        },
        clearUserData: (state) => {
            state.name = null;
            state.kaoPic = null;
            state.userLevel = null;
            state.levelProgress = null;
            state.lastPromptConfig = null;
            state.fullPrompt = null;
            state.gptPrompt = null;
            state.vocabListOnly = null;
            state.storeDataLocally = false;
        },
        setStoreDataLocally: (state, action: PayloadAction<boolean>) => {
            state.storeDataLocally = action.payload;
        },
    },
});

export const { 
    setUserData, 
    setLastPromptConfig, 
    setFullPrompt,
    setGptPrompt,
    setVocabListOnly,
    clearUserData,
    setStoreDataLocally,
} = userSlice.actions;

export const clearAllUserDataAndState = (dispatch: AppDispatch) => {
    dispatch(clearToken());
    localStorage.removeItem(RENSHUU_TOKEN_KEY);
    dispatch(clearSchedules());
    dispatch(clearUserData());
    localStorage.removeItem(RENSHUU_PROMPT_CONFIG_KEY);
    dispatch(resetStepper());
};

export default userSlice.reducer; 