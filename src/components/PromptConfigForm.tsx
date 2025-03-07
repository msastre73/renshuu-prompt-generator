import { Stack, Checkbox, TextInput, Box, Text, Flex, Button, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight } from '@tabler/icons-react';
import { ScheduleItems } from './ScheduleItems';

export interface PromptConfig {
    includeFurigana: boolean;
    includeSuperscript: boolean;
    conversationTopic: string;
    selectedSchedulesIds: string[];
    selectedWordsStatus: ('studied' | 'notStudied')[];
    japaneseLevel: 'beginner' | 'n5' | 'n4' | 'n3' | 'n2' | 'n1' | '';
}

// Add these props to the component
interface PromptConfigFormProps {
    onSubmit: (values: PromptConfig) => Promise<void>;
    isLoading: boolean;
    isPromptError: boolean;
}

export function PromptConfigForm({ onSubmit, isLoading, isPromptError }: PromptConfigFormProps) {
    const form = useForm<PromptConfig>({
        initialValues: {
            includeFurigana: true,
            includeSuperscript: true,
            conversationTopic: '',
            selectedSchedulesIds: [],
            selectedWordsStatus: ['studied'],
            japaneseLevel: '',
        },
        validate: {
            japaneseLevel: (value) => {
                if (!value) {
                    return 'Please select a Japanese level';
                }
            },
            selectedSchedulesIds: (value) => {
                if (!value || value.length === 0) {
                    return 'Please select at least one schedule';
                }
            },
        },
    });

    const japaneseLevelOptions = [
        { value: 'beginner', label: 'Total Beginner' },
        { value: 'n5', label: 'JLPT N5' },
        { value: 'n4', label: 'JLPT N4' },
        { value: 'n3', label: 'JLPT N3' },
        { value: 'n2', label: 'JLPT N2' },
        { value: 'n1', label: 'JLPT N1' },
    ];

    return (
        <form onSubmit={form.onSubmit(onSubmit)} style={{ width: '100%', maxWidth: 500, }}>

            <Stack style={{ border: '1px solid var(--mantine-color-gray-4)', borderRadius: 'var(--mantine-radius-md)' }}
                p="md"
                mb="md">
                <ScheduleItems form={form} />
            </Stack>
            <Stack style={{ border: '1px solid var(--mantine-color-gray-4)', borderRadius: 'var(--mantine-radius-md)' }}
                p="md"
                align="flex-start">
                <Checkbox
                    mb={0}
                    label="Include furigana between parentheses"
                    description="Furigana are the small kana characters that appear above kanji characters representing their pronunciation.
                    Most AI Chats can't handle furigana, so this option is a workaround."
                    {...form.getInputProps('includeFurigana', { type: 'checkbox' })}
                />
                <Flex gap="xs" align="center" justify="center" w="100%">
                    <Text > <ruby> 漢字<rt>かんじ</rt></ruby>  </Text>
                    <IconArrowRight />
                    <Text > {" 漢字(かんじ)"} </Text>
                </Flex>        
                <Checkbox
                    label="Include superscript to get the meaning of words"
                    description="There is no 'click to get the definition' button in AI Chats. But we can instruct the AI to add a small number after 
                    each word, and give the meaning when you just send that number as a message."
                    {...form.getInputProps('includeSuperscript', { type: 'checkbox' })}
                />

                <Box ml={40}>
                    <Stack gap="xs" w="100%" p={5}
                        style={{
                            border: '1px solid rgb(3, 177, 3)',
                            borderRadius: 'var(--mantine-radius-md)',
                            backgroundColor: 'rgba(0, 255, 0, 0.03)'
                        }} >
                        <Flex gap="md" align="flex-start">
                            <Stack gap={1} style={{ flex: 1 }}>
                                <Text size="xs" style={{ fontSize: '10px' }} fw={700}>ChatAI</Text>
                                <Box p="xs" style={{ backgroundColor: 'var(--mantine-color-gray-1)', borderRadius: 'var(--mantine-radius-md)' }}>
                                    <Text size="xs">今日¹ は² 暑い³ ですね⁴</Text>
                                </Box>
                            </Stack>
                        </Flex>

                        <Flex gap="md" align="flex-start" justify="flex-end">
                            <Stack gap={1} style={{ flex: 1 }} align="flex-end">
                                <Text size="xs" style={{ fontSize: '10px' }} fw={700}>You</Text>
                                <Box p="xs" style={{ backgroundColor: 'var(--mantine-color-blue-1)', borderRadius: 'var(--mantine-radius-md)' }}>
                                    <Text size="xs">3</Text>
                                </Box>
                            </Stack>
                        </Flex>

                        <Flex gap="md" align="flex-start">
                            <Stack gap={1} style={{ flex: 1 }}>
                                <Text size="xs" style={{ fontSize: '10px' }} fw={700}>ChatAI</Text>
                                <Box p="xs" style={{ backgroundColor: 'var(--mantine-color-gray-1)', borderRadius: 'var(--mantine-radius-md)' }}>
                                    <Text size="xs">暑い (あつい, atsui) means "hot" (referring to weather/temperature)</Text>
                                </Box>
                            </Stack>
                        </Flex>
                    </Stack>
                </Box>

                <TextInput
                    w="100%"
                    label="Conversation Topic (optional)"
                    description="Leave blank if you want the AI to choose a topic for the conversation"
                    placeholder="Enter a topic for the conversation"
                    {...form.getInputProps('conversationTopic')}
                />
                <Select
                    label="Japanese Level"
                    placeholder="Select your Japanese level"
                    data={japaneseLevelOptions}
                    {...form.getInputProps('japaneseLevel')}
                    required
                />
            </Stack>
            <Flex justify="flex-end">
                <Button
                    type="submit"
                    mt="md"
                    loading={isLoading}
                    color="var(--mantine-color-black)"
                >
                    Generate Prompt 🚀
                </Button>
            </Flex>
            {isPromptError && <Text c="red">Error generating prompt. Please refresh the page and try again.</Text>}


        </form>
    );
}
