import { Stack, Text } from '@mantine/core';
import { TokenForm } from '../TokenForm';
import { TokenLocationInfo } from '../TokenLocationInfo';

export function FirstStepConnect() {
    return (
        <Stack mt="xl">
            <Text>First you need to connect to Renshuu using your API key.</Text>
            <TokenLocationInfo />
            <TokenForm />
        </Stack>
    );
}
