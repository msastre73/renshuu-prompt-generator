import axios from 'axios';
import { store } from '../store/store';

const BASE_URL = 'https://api.renshuu.org/v1';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for auth
api.interceptors.request.use(
    (config) => {
        const token = store.getState().token.value;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            store.dispatch({ type: 'token/clearToken' });
        }
        return Promise.reject(error);
    }
);

// Types
interface StudiedCounts {
    today_all: number;      // Number of terms (of all types) studied today
    today_vocab: number;
    today_grammar: number;
    today_kanji: number;
    today_sent: number;
    today_conj: number;     // Verb conjugation terms (special schedule)
    today_aconj: number;    // Adjective conjugation terms (special schedule)
}

interface JLPTLevels {
    n1: number;  // JLPT N1 / Advanced level
    n2: number;  // JLPT N2 / Pre-Advanced level
    n3: number;  // JLPT N3 / Intermediate level
    n4: number;  // JLPT N4 / Pre-Intermediate level
    n5: number;  // JLPT N5 / Beginner level
}

interface JLPTLevelsWithBasics extends JLPTLevels {
    n6: number;  // Japanese Basics level
    kana: number;  // Hiragana
    kata: number;  // Katakana
}

interface LevelProgress {
    vocab: JLPTLevelsWithBasics;
    kanji: JLPTLevels;
    grammar: JLPTLevels;
    sent: JLPTLevels;
}

interface StreakStats {
    correct_in_a_row: number;           // Number of terms correct in a row in quizzing (currently)
    correct_in_a_row_alltime: number;   // Number of terms correct in a row in quizzing (all-time)
    days_studied_in_a_row: number;
    days_studied_in_a_row_alltime: number;
}

interface Streaks {
    vocab: StreakStats;
    kanji: StreakStats;
    grammar: StreakStats;
    sent: StreakStats;
    conj: StreakStats;
    aconj: StreakStats;
}

export interface RenshuuProfile {
    id: number;
    real_name: string;
    adventure_level: number;
    user_length: string;
    kao: string;
    studied: StudiedCounts;
    level_progress_percs: LevelProgress;
    streaks: Streaks;
}

// API methods
export const renshuuService = {
    // Get user profile
    getProfile: async (token?: string): Promise<RenshuuProfile | null> => {
        console.log("Getting profile with token:", token);
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
            const response = await api.get<RenshuuProfile>('/profile', { headers });
            return response.data;
        } catch {
            return null;
        }
    },
}; 