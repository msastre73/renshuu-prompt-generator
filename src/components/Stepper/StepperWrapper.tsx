import { Stepper } from '@mantine/core';
import { FirstStepConnect } from './FirstStepConnect';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { nextStep, setStep } from '../../store/slices/stepperSlice';
import { SecondStepConfigure } from './SecondStepConfigure';
export function StepperWrapper() {
    const active = useSelector((state: RootState) => state.stepper.activeStep);
    const dispatch = useDispatch();

    const handleStepChange = (nextStepIndex: number) => {
        const isOutOfBounds = nextStepIndex > 3 || nextStepIndex < 0;

        if (isOutOfBounds) {
            return;
        }

        dispatch(setStep(nextStepIndex));
    };

    // Allow the user to freely go back and forth between visited steps.

    return (
        <>
            <Stepper active={active} onStepClick={handleStepChange}>
                <Stepper.Step
                    label="Connect to Renshuu"
                    description="With your API key"
                    allowStepSelect={false}
                >
                   <FirstStepConnect />
                </Stepper.Step>
                <Stepper.Step
                    label="Generate the prompt"
                    description="Select the prompt options"
                    allowStepSelect={false}
                >
                    <SecondStepConfigure />
                </Stepper.Step>
                <Stepper.Step
                    label="Done!"
                    description="Copy the prompt"
                    allowStepSelect={false}
                >
                    Step 3 content: Get full access
                </Stepper.Step>

                <Stepper.Completed>
                    Completed, click back button to get to previous step
                </Stepper.Completed>
            </Stepper>

        </>
    );
}