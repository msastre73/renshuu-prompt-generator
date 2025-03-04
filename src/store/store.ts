import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './slices/tokenSlice';
import stepperReducer from './slices/stepperSlice';
import userReducer from './slices/userSlice';
import schedulesReducer from './slices/schedulesSlice';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    stepper: stepperReducer,
    user: userReducer,
    schedules: schedulesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 