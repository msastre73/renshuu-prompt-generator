import { store } from '../store/store';
import { JLPTLevel, LevelProgress, setStoreDataLocally, setUserData } from '../store/slices/userSlice';
import { setToken } from '../store/slices/tokenSlice';
import { setStep } from '../store/slices/stepperSlice';
import { RENSHUU_TOKEN_KEY } from '../constants';

export default function processProfileData(profile: any, token: string, storeDataLocally: boolean) {
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
    const levelProgress = levels.reduce((acc, level) => {
        acc[level as JLPTLevel] = {
            kanji: profile?.level_progress_percs?.kanji?.[level.toLowerCase()] ?? 0,
            sentences: profile?.level_progress_percs?.sent?.[level.toLowerCase()] ?? 0,
            vocabulary: profile?.level_progress_percs?.vocab?.[level.toLowerCase()] ?? 0,
            grammar: profile?.level_progress_percs?.grammar?.[level.toLowerCase()] ?? 0,
        };
        return acc;
    }, {} as LevelProgress);

    // Set user data with correct mapping
    if(storeDataLocally) {
        store.dispatch(setStoreDataLocally(true));
        // Store the token in the local storage
        localStorage.setItem(RENSHUU_TOKEN_KEY, token);
    }
    store.dispatch(setUserData({
        name: profile.real_name,
        kaoPic: profile.kao,
        userLevel: profile.adventure_level,
        levelProgress,
    }));
    store.dispatch(setToken(token));
    store.dispatch(setStep(1));
}
