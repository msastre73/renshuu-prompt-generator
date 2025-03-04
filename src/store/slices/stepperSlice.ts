import { createSlice } from '@reduxjs/toolkit';

interface StepperState {
    activeStep: number;
}

const initialState: StepperState = {
    activeStep: 0,
};

export const stepperSlice = createSlice({
    name: 'stepper',
    initialState,
    reducers: {
        nextStep: (state) => {
            state.activeStep += 1;
        },
        previousStep: (state) => {
            state.activeStep = Math.max(0, state.activeStep - 1);
        },
        setStep: (state, action: { payload: number }) => {
            state.activeStep = action.payload;
        },
        resetStepper: (state) => {
            state.activeStep = 0;
        },
    },
});

export const { nextStep, previousStep, setStep, resetStepper } = stepperSlice.actions;

export default stepperSlice.reducer; 