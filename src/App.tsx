import "@mantine/core/styles.css";
import { Anchor, MantineProvider, Paper, Stack, Text, Title } from "@mantine/core";
import { theme } from "./theme";
import { Shell } from "./layout/Shell";
import { StepperWrapper } from "./components/Stepper/StepperWrapper";
import './globalStyles.css';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

export default function App() {
  // Stepper stepp from store
  const step = useSelector((state: RootState) => state.stepper.activeStep);

  return (
      <MantineProvider theme={theme}>
        <Shell>
          <Stack align="center">
            <Paper shadow="xs" p="xl" w="100%" maw={800} >
              {step === 0 && <Stack gap="xs" mb="xl">
                <Title order={2}> ようこそ! / Welcome!</Title>
                <Text>
                  This is a tiny utility app that connects to your Reinshuu account and generates{' '}
                  prompts based on your selected schedules, for practicing conversation with LLM chats, like{' '}
                  <Anchor target="_blank" href="https://chatgpt.com">ChatGPT</Anchor>,{' '}
                  <Anchor target="_blank" href="https://claude.ai">Claude</Anchor>,{' '}
                  <Anchor target="_blank" href="https://gemini.google.com">Gemini</Anchor>, etc.
                </Text>
                <Text>
                  The full prompt not always works as expected, so I've created a GPT{' '}
                  fine-tuned for this use case which performs better and needs less input.
                </Text>
              </Stack>}
              <StepperWrapper />
            </Paper>
          </Stack>
        </Shell>
      </MantineProvider>
  );
}
