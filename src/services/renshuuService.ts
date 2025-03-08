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

export interface Schedule {
    id: string;
    name: string;
    is_frozen: number;
    today: {
        review: number;
        new: number;
    };
    upcoming: Array<{
        days_in_future: string;
        terms_to_review: string;
    }>;
    terms: {
        total_count: number;
        studied_count: number;
        unstudied_count: number;
        hidden_count: number;
    };
    new_terms: {
        today_count: string;
        rolling_week_count: string;
    };
}

export interface SchedulesResponse {
    schedules: Schedule[];
    api_usage: {
        calls_today: number;
        daily_allowance: number;
    };
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

interface ScheduleTerm {
    kanji_full?: string;
    kanji?: string;
    hiragana_full?: string;
    hiragana?: string;
    id: string;
    meaning?: {
        eng: string;
    };
    title_japanese?: string;
    user_data?: {
        mastery_avg_perc: number;
        correct_count: number;
        missed_count: number;
    };
    japanese?: string;
}

interface ScheduleListResponse {
    schedules: [{
        name: string;
    }];
    contents: {
        pg: number;
        total_pg: number;
        terms: ScheduleTerm[];
    };
    api_usage: {
        calls_today: number;
        daily_allowance: number;
    };
}

export interface ProcessedSchedule {
    [scheduleId: string]: {
        name: string;
        words: {
            studied: {
                kanji: string;
                reading: string;
                id: string;
                mastery: number;
                encountered_count: number;
            }[];
            not_studied: {
                kanji: string;
                reading: string;
                id: string;
            }[];
        };
    };
}

// API methods
export const renshuuService = {
    // Get user profile
    getProfile: async (token?: string): Promise<RenshuuProfile | null> => {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
            const response = await api.get<RenshuuProfile>('/profile', { headers });
            return response.data;
        } catch {
            return null;
        }
    },

    // Get all schedules
    getAllSchedules: async (token?: string): Promise<SchedulesResponse | null> => {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
            const response = await api.get<SchedulesResponse>('/schedule', { headers });
            return response.data;
        } catch {
            return null;
        }
    },

    getAllScheduleWords: async (scheduleId: string, token?: string): Promise<ProcessedSchedule | null> => {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
            let currentPage = 1;
            let allTerms: ScheduleTerm[] = [];
            let scheduleName = '';

            // Get first page to get total pages and schedule name
            const firstResponse = await api.get<ScheduleListResponse>(
                `/schedule/${scheduleId}/list`,
                { 
                    headers,
                    params: { pg: 1 }
                }
            );
           
            scheduleName = firstResponse.data.schedules[0].name; // ?? Will it always be the first schedule?
            const totalPages = firstResponse.data.contents.total_pg;
            allTerms = [...firstResponse.data.contents.terms];

            // Fetch remaining pages
            while (currentPage < totalPages) {
                currentPage++;
                const response = await api.get<ScheduleListResponse>(
                    `/schedule/${scheduleId}/list`,
                    {
                        headers,
                        params: { pg: currentPage }
                    }
                );
                allTerms = [...allTerms, ...response.data.contents.terms];
            }

            // Workaround for when the schedule has grammar terms
            const processKanji = (term: ScheduleTerm) => {
                if (term.kanji_full) {
                    return term.kanji_full;
                }
                if (term.kanji) {
                    return `${term.kanji}(kanji)`;
                }
                if (term.title_japanese && term.meaning?.eng) {
                    return `${term.title_japanese} (${term.meaning.eng})`;
                } if(term.japanese){
                    return `${term.japanese}(sentence)`;
                }
                else{
                    return '';
                }
            }

            // Group terms by studied status
            const studiedWords = allTerms
                .filter(term => term.user_data)
                .map(term => ({
                    kanji: processKanji(term),
                    reading: term.hiragana_full || '',
                    id: term.id,
                    mastery: term.user_data!.mastery_avg_perc,
                    encountered_count: term.user_data!.correct_count + term.user_data!.missed_count
                }));

            const notStudiedWords = allTerms
                .filter(term => !term.user_data)
                .map(term => ({
                    kanji: processKanji(term),
                    reading: term.hiragana_full || '',
                    id: term.id
                }));

            const processedData: ProcessedSchedule = {
                [scheduleId]: {
                    name: scheduleName,
                    words: {
                        studied: studiedWords,
                        not_studied: notStudiedWords
                    }
                }
            };

            return processedData;
        } catch (error) {
            console.error('Error fetching all schedule words:', error);
            return null;
        }
    },
}; 