import { useState } from 'react';
import { Stepper, Button, Group, Text } from '@mantine/core';
import { FirstStepConnect } from './FirstStepConnect';

export function StepperWrapper() {
    const [active, setActive] = useState(1);

    const handleStepChange = (nextStep: number) => {
        const isOutOfBounds = nextStep > 3 || nextStep < 0;

        if (isOutOfBounds) {
            return;
        }

        setActive(nextStep);
    };

    // Allow the user to freely go back and forth between visited steps.

    return (
        <>
            <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step
                    label="Connect to Renshuu"
                    description="With your API key"
                    allowStepSelect={false}
                >
                   <FirstStepConnect />
                </Stepper.Step>
                <Stepper.Step
                    label="Generate a prompt"
                    description="Select the prompt options"
                    allowStepSelect={false}
                >
                    Step 2 content: Verify email
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