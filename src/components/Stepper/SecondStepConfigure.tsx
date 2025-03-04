import { Stack, Text, Group, Avatar, Paper, Title, Flex, Loader, Anchor } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import { renshuuService } from '../../services/renshuuService';
import { selectSchedules, setSchedules, ScheduleInfo } from '../../store/slices/schedulesSlice';
import { PromptConfigForm } from '../PromptConfigForm';
export function SecondStepConfigure() {
    const { name, kaoPic, userLevel } = useSelector((state: RootState) => state.user);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
    const [schedulesError, setSchedulesError] = useState<string | null>(null);
    const schedules = useSelector(selectSchedules);
    const dispatch = useDispatch();

    useEffect(() => {
        const loadSchedules = async () => {
            setIsLoadingSchedules(true);
            console.log('Loading schedules...');
            const response = await renshuuService.getAllSchedules();
            if (response?.schedules) {
                const transformedSchedules: ScheduleInfo[] = response.schedules.map(schedule => ({
                    id: schedule.id,
                    name: schedule.name,
                    termCounts: {
                        hidden: schedule.terms.hidden_count,
                        studied: schedule.terms.studied_count,
                        unstudied: schedule.terms.unstudied_count
                    }
                }));
                dispatch(setSchedules(transformedSchedules));
                console.log(transformedSchedules);
            } else {
                setSchedulesError('Failed to load schedules');
            }
            setIsLoadingSchedules(false);
        };

        loadSchedules();
    }, [dispatch]);

    return (
        <Stack mt="xl" align="center" justify="center" >
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

            {isLoadingSchedules ? (
                <Flex align="center" gap="xs">
                    <Loader size="xs" type="bars" />
                    <Text size="sm" c="dimmed" fs="italic">Loading your schedules...</Text>
                </Flex>
            ) : schedulesError ? (
                <Text c="red">{schedulesError}</Text>
            ) : schedules.length === 0  ? (
                <Text>
                    No schedules found. <Anchor target="_blank" href="https://www.renshuu.org/">Add some in your Renshuu account.</Anchor>
                </Text>
            ) : (
                <PromptConfigForm />
            )}
        </Stack>
    );
} 