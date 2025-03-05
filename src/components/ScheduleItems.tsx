import { Box, Text, Chip, Button, Group, Stack, TextInput, Badge, CloseButton, Pagination } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import { PromptConfig } from './PromptConfigForm';
import { useSelector } from 'react-redux';
import { selectSchedules } from '../store/slices/schedulesSlice';

interface ScheduleItemsProps {
    form: UseFormReturnType<PromptConfig>;
}

export function ScheduleItems({ form }: ScheduleItemsProps) {
    const [search, setSearch] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const schedules = useSelector(selectSchedules);

    const selectedSchedules = schedules.filter(s =>
        form.values.selectedSchedulesIds.includes(s.id)
    );
    const availableSchedules = search.trim() === ''
        ? schedules.filter(s => 
            !form.values.selectedSchedulesIds.includes(s.id) && 
            (s.termCounts.studied + s.termCounts.unstudied + s.termCounts.hidden) > 0)
        : schedules.filter(s =>
            !form.values.selectedSchedulesIds.includes(s.id) &&
            s.name.toLowerCase().includes(search.toLowerCase().trim()) &&
            (s.termCounts.studied + s.termCounts.unstudied + s.termCounts.hidden) > 0
        );

    const totalWords = selectedSchedules.reduce((acc, schedule) => {
        const counts = schedule.termCounts;
        return acc + form.values.selectedWordsStatus.reduce((sum, status) =>
            sum + (status === 'notStudied' ? counts.unstudied : (counts.studied + counts.hidden)), 0);
    }, 0);

    const totalPages = Math.ceil(availableSchedules.length / itemsPerPage);
    const paginatedSchedules = availableSchedules.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    useEffect(() => {
        if (form.errors.selectedSchedulesIds && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [form.errors.selectedSchedulesIds]);

    return (
        <Stack gap="xs">
            <Text size="sm" fw={500}>Select schedules</Text>
            <Text size="xs" c="dimmed">
                Select which schedules' items to include in the conversation
            </Text>

            <Text size="xs" fw={500} mt="sm">Which types of items do you want to include</Text>
            <Chip.Group
                multiple
                value={form.values.selectedWordsStatus}
                onChange={(value) => {
                    if (value.length > 0) {
                        form.setFieldValue('selectedWordsStatus', value as ('studied' | 'notStudied')[]);
                    }
                }}
            >
                <Group gap="xs">
                    <Chip size="xs" value="studied">Studied</Chip>
                    <Chip size="xs" value="notStudied">Not Studied</Chip>
                </Group>
            </Chip.Group>

            <Text size="xs" fw={500} mt="sm">Selected schedules</Text>
            <Text size="xs" c="dimmed">Total items: {totalWords}</Text>

            <Box>
                <Group gap="xs">
                    {selectedSchedules.map(schedule => (
                        <Badge
                            key={schedule.id}
                            variant="light"
                            rightSection={
                                <CloseButton
                                    size="xs"
                                    onClick={() => {
                                        form.setFieldValue('selectedSchedulesIds',
                                            form.values.selectedSchedulesIds.filter(id => id !== schedule.id)
                                        );
                                    }}
                                />
                            }
                        >
                            {schedule.name} +{
                                form.values.selectedWordsStatus.reduce((sum, status) =>
                                    sum + (status === 'notStudied' ? schedule.termCounts.unstudied : 
                                        (schedule.termCounts.studied + schedule.termCounts.hidden)), 0
                                )
                            }
                        </Badge>
                    ))}
                </Group>
                {form.errors.selectedSchedulesIds && (
                    <Text size="xs" c="red" mt={4}>
                        {form.errors.selectedSchedulesIds}
                    </Text>
                )}
            </Box>

            <Box mt="xs">
                <TextInput
                    ref={searchInputRef}
                    size="xs"
                    placeholder="Search schedules..."
                    leftSection={<IconSearch size={14} />}
                    rightSection={
                        search.trim() !== '' && (
                            <CloseButton
                                size={14}
                                onClick={() => setSearch('')}
                                aria-label="Clear search"
                            />
                        )
                    }
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                />

                <Stack gap="xs" mt="xs">
                    {paginatedSchedules.map(schedule => (
                        <Group key={schedule.id} wrap="nowrap" p="xs"
                            style={{
                                border: '1px solid var(--mantine-color-gray-3)',
                                borderRadius: 'var(--mantine-radius-sm)'
                            }}
                        >
                            <Box style={{ flex: 1, minWidth: 0 }}>
                                <Text size="sm" fw={700} truncate>{schedule.name} ({schedule.termCounts.studied + schedule.termCounts.unstudied + schedule.termCounts.hidden})</Text>
                                <Text size="xs" c="dimmed">
                                    Studied: {schedule.termCounts.studied + schedule.termCounts.hidden} |
                                    Not Studied: {schedule.termCounts.unstudied}
                                </Text>
                            </Box>
                            <Button
                                size="xs"
                                variant="light"
                                px={8}
                                onClick={() => {
                                    form.setFieldValue('selectedSchedulesIds', [
                                        ...form.values.selectedSchedulesIds,
                                        schedule.id
                                    ]);
                                }}
                            >
                                <IconPlus size={14} />
                            </Button>
                        </Group>
                    ))}
                </Stack>

                {totalPages > 1 && (
                    <Group justify="center" mt="md">
                        <Pagination
                            total={totalPages}
                            value={currentPage}
                            onChange={setCurrentPage}
                            size="sm"
                            radius="md"
                        />
                    </Group>
                )}
            </Box>
        </Stack>
    );
} 