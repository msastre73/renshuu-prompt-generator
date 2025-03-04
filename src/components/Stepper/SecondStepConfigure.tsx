import { Stack, Text, Group, Avatar, Paper, Title } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export function SecondStepConfigure() {
    const { name, kaoPic, userLevel } = useSelector((state: RootState) => state.user);

    return (
        <Stack mt="xl" align="center" justify="center">
            <Group align="center" >
                <IconCheck size={24} style={{ color: 'var(--mantine-color-green-6)' }} />
                <Text fw={500} size="lg">You're connected!!</Text>
            </Group>

            <Paper withBorder p="md" radius="xl" bg="var(--mantine-color-grape-1)">
                <Group>
                    <Avatar
                        bg="white"
                        src={kaoPic}
                        size="md"
                        radius="xl"
                        style={{ border: '1px solid var(--mantine-color-gray-5)' }}
                        alt={name ? `${name}'s kao` : 'User avatar'}
                        className="kao-avatar"
                    />
                    <div>
                        <Text fw={500}>{name}</Text>
                        <Text size="sm" c="dimmed">Level {userLevel}</Text>
                    </div>
                </Group>
            </Paper>
            <Text size="sm" c="dimmed" fs="italic">What a cute kao! 😍 And I don't say that lightly... <Text span style={{ fontSize: 8 }}>👀</Text></Text>
            <Title order={3}>Now let's configure your prompt</Title>
        </Stack>
    );
} 