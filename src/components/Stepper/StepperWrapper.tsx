import { Stepper } from '@mantine/core';
import { FirstStepConnect } from './FirstStepConnect';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { SecondStepConfigure } from './SecondStepConfigure';
import { ThirdStepDone } from './ThirdStepDone';
// import { useEffect } from 'react';
// import { ga } from '../../analytics/ga';

export function StepperWrapper() {
    const active = useSelector((state: RootState) => state.stepper.activeStep);

    return (
        <>
            <Stepper active={active}>
                <Stepper.Step
                    label="Connect to Renshuu"
                    description="With your API key"
                    allowStepSelect={false}
                >
                   <FirstStepConnect />
                </Stepper.Step>
                <Stepper.Step
                    label="Configure prompt"
                    description="Select schedules and options"
                    allowStepSelect={false}
                >
                    <SecondStepConfigure />
                </Stepper.Step>
                <Stepper.Step
                    label="Done!"
                    description="The prompt is ready"
                    allowStepSelect={false}
                >
                    Prompt Generated {/* NOTE: This should never be reached */}
                </Stepper.Step>

                <Stepper.Completed>
                    <ThirdStepDone />
                </Stepper.Completed>
            </Stepper>

        </>
    );
}