import { store } from '../store/store';
import { setUserData } from '../store/slices/userSlice';
import { setToken } from '../store/slices/tokenSlice';
import { setStep } from '../store/slices/stepperSlice';

export default function processProfileData(profile: any, token: string) {
    // Map the level progress data
    const levelProgress = {
        kanji: profile.level_progress_percs.kanji,
        sentences: profile.level_progress_percs.sent,
        vocabulary: profile.level_progress_percs.vocab,
        grammar: profile.level_progress_percs.grammar,
    };

    // Set user data with correct mapping
    store.dispatch(setUserData({
        name: profile.real_name,
        kaoPic: profile.kao,
        userLevel: profile.adventure_level,
        levelProgress,
    }));
    store.dispatch(setToken(token));
    store.dispatch(setStep(1));
}
