import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './slices/tokenSlice';
import stepperReducer from './slices/stepperSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    stepper: stepperReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 