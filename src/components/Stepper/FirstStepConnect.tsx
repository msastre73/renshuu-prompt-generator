import { Stack, Text } from '@mantine/core';
import { TokenForm } from '../TokenForm';
import { TokenLocationInfo } from '../TokenLocationInfo';
import { useState } from 'react';
import { renshuuService } from '../../services/renshuuService';
import processProfileData from '../../business_logic/processProfileData';
import type { TokenFormValues } from '../TokenForm';
import { ga } from '../../analytics/ga';
import { TEST_MODE_TOKEN } from '../../constants';


export function FirstStepConnect() {
    const [connecting, setConnecting] = useState(false);
    const [tokenError, setTokenError] = useState(false);


    const handleSubmit = async (values: TokenFormValues) => {
        setConnecting(true);
        const profile = await renshuuService.getProfile(values.token);

        if (profile) {
            ga.trackGPTFunnel('connected', values.token == TEST_MODE_TOKEN);
            processProfileData(profile, values.token, values.rememberToken);
        } else {
            setTokenError(true);
        }
        setConnecting(false);
    };

    return (
        <Stack mt="xl">
            <Text>First you need to connect to Renshuu using your API key.</Text>
            <TokenLocationInfo />
            <TokenForm
                onSubmit={handleSubmit}
                isConnecting={connecting}
                tokenError={tokenError}
                resentTokenError={() => setTokenError(false)} />
        </Stack>
    );
}
