import { Stack, Checkbox, TextInput, Box, Image, Text, Flex, Radio } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight } from '@tabler/icons-react';

interface PromptConfig {
    includeFurigana: boolean;
    excludeScheduledWords: 'none' | 'all' | 'studied';
    includeSuperscript: boolean;
    conversationTopic: string;
}

export function PromptConfigForm() {
    const form = useForm<PromptConfig>({
        initialValues: {
            includeFurigana: true,
            excludeScheduledWords: 'studied',
            includeSuperscript: true,
            conversationTopic: '',
        },
    });

    const handleSubmit = async (values: PromptConfig) => {
        // Handle the form submission here
        console.log(values);
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: '100%', maxWidth: 500 }}>
            <Stack style={{ border: '1px solid var(--mantine-color-gray-4)', borderRadius: 'var(--mantine-radius-md)' }}

                p="md"
                align="flex-start">
                <Checkbox
                    mb={0}
                    label="Include furigana between '<>'"
                    description="Furigana are the small kana characters that appear above kanji characters representing their pronunciation.
                    Most AI Chats can't handle furigana, so this option is a workaround."
                    {...form.getInputProps('includeFurigana', { type: 'checkbox' })}
                />
                <Flex gap="xs" align="center" justify="center" w="100%">
                    <Text > <ruby> 漢字<rt>かんじ</rt></ruby>  </Text>
                    <IconArrowRight />
                    <Text > {" 漢字<かんじ>"} </Text>
                </Flex>
                {form.values.includeFurigana && (
                    <Stack ml={40} align="center" >
                        <Radio.Group
                            label="How would you like to handle furigana for vocabulary?"
                            {...form.getInputProps('excludeScheduledWords')}
                        >
                            <Stack mt="xs" gap="xs">
                                <Radio size='xs' value="none" label="Show furigana for all words" />
                                <Radio size='xs' value="all" label="Hide furigana for all words in selected schedules" />
                                <Radio size='xs' value="studied" label="Hide furigana only for words you've already studied in selected schedules" />
                            </Stack>
                        </Radio.Group>
                    </Stack>
                )}
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
                    label="Conversation Topic (optional)"
                    placeholder="Enter a topic for the conversation"
                    {...form.getInputProps('conversationTopic')}
                />
            </Stack>
        </form>
    );
}
