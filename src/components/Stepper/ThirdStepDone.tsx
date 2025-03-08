import { Stack, Text, Button, Group, Spoiler, CopyButton, Code, Anchor, Divider } from '@mantine/core';
import { IconCheck, IconBrandOpenai, IconBrandDiscord, IconMail } from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setStep } from '../../store/slices/stepperSlice';
import { ga } from '../../analytics/ga';

export function ThirdStepDone() {
    const dispatch = useDispatch();

    const { fullPrompt, gptPrompt, vocabListOnly } = useSelector((state: RootState) => state.user);


    return (
        <Stack mt="xl" align="center">
            <Group align="center">
                <IconCheck size={24} style={{ color: 'var(--mantine-color-green-6)' }} />
                <Text fw={500} size="lg">Your prompt is ready!</Text>
            </Group>

            <Text size="lg" ta="center">
                For the best experience, I've created a GPT fine-tuned for this. Open it and paste the prompt (it's already copied to your clipboard!)
            </Text>
            <Text ta="center">
                If you have any issues or feedback please contact me via  <Anchor href="https://discord.gg/8sewDJUAs9" target="_blank"><IconBrandDiscord size={14} />Discord</Anchor> or  <Anchor href="mailto:marcossastre73@gmail.com"><IconMail size={14} />email</Anchor>.
            </Text>

            <Button
                component="a"
                href="https://chatgpt.com/g/g-67cadd09de188191a45150dda040bff7-practice-japanese-with-your-renshuu-vocab"
                onClick={() => ga.trackGPTFunnel('external_gpt_opened')}
                target="_blank"
                leftSection={<IconBrandOpenai size={20} />}
                size="lg"
                variant="gradient"
                gradient={{ from: 'grape', to: 'pink', deg: 45 }}
            >
                Open GPT
            </Button>
            <Button variant="subtle" onClick={() => {
                ga.trackGPTFunnel('new_prompt_started');
                dispatch(setStep(1))
            }}>← Generate a new prompt</Button>

            <CopyButton value={gptPrompt || ''}>
                {({ copied, copy }) => (
                    <Button variant="transparent" size="xs" onClick={
                        () => {
                            ga.trackGPTFunnel('gpt_prompt_copied');
                            copy();

                    }}>
                        {copied ? 'Copied!' : 'Copy this prompt again'}
                    </Button>
                )}
            </CopyButton>
            <>
                <Divider w="50%" my="md" />
            </>

            <Text size="sm" c="dimmed" mt="md">
                You can also copy the full prompt to use with any other LLM chat:
            </Text>

            {/* Full Prompt Spoiler */}
            <Stack w="100%" gap="xs">
                <Group justify="space-between">
                    <Text size="sm" fw={500} c="dimmed">Full Prompt (for any LLM chat)</Text>
                    <CopyButton value={fullPrompt || ''}>
                        {({ copied, copy }) => (
                            <Button variant="light" size="xs" onClick={
                                () => {
                                    ga.trackGPTFunnel('full_prompt_copied');
                                    copy();

                                }}>
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        )}
                    </CopyButton>
                </Group>
                <Spoiler maxHeight={100} showLabel="Show more" hideLabel="Hide">
                    <Code block>{fullPrompt}</Code>
                </Spoiler>
            </Stack>

            <Text size="sm" c="dimmed" mt="md" ta="center">
                Below is the list of terms you have selected, with information about how many times{" "}
                you have studied them and your mastery of them. If you want to craft your own prompt, this can come handy.
            </Text>

            {/* Full Prompt Spoiler */}
            <Stack w="100%" gap="xs">
                <Group justify="space-between">
                    <Text size="sm" fw={500} c="dimmed">Vocabulary List (with mastery info)</Text>
                    <CopyButton value={vocabListOnly || ''}>
                        {({ copied, copy }) => (
                            <Button variant="light" size="xs" onClick={
                                () => {
                                    ga.trackGPTFunnel('vocab_list_copied');
                                    copy();

                                }}>
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        )}
                    </CopyButton>
                </Group>
                <Spoiler maxHeight={100} showLabel="Show more" hideLabel="Hide">
                    <Code block>{vocabListOnly}</Code>
                </Spoiler>
            </Stack>
        </Stack>
    );
}
