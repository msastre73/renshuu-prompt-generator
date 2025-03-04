import "@mantine/core/styles.css";
import { Anchor, MantineProvider, Paper, Stack, Text, Title } from "@mantine/core";
import { theme } from "./theme";
import { Shell } from "./layout/Shell";
import { StepperWrapper } from "./components/Stepper/StepperWrapper";
import { Provider } from 'react-redux';
import { store } from './store/store';

export default function App() {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Shell>
          <Stack align="center">
            <Paper shadow="xs" p="xl" w="100%" maw={800} >
              <Stack gap="xs" mb="xl">
                <Title order={2}>Welcome!</Title>
                <Text>
                  This is a tiny utility app that connects to your Reinshuu account and generates prompts
                  you can use in LLM chats, like{' '}
                  <Anchor target="_blank" href="https://chatgpt.com">ChatGPT</Anchor>,{' '}
                  <Anchor target="_blank" href="https://claude.ai">Claude</Anchor>,{' '}
                  <Anchor target="_blank" href="https://gemini.google.com">Gemini</Anchor>, etc.
                </Text>
                <Text>
                  It's nothing too crazy, it just saves you the hassle of copying and pasting the same prompt over and over again.
                </Text>
              </Stack>
              <StepperWrapper />
            </Paper>
          </Stack>
        </Shell>
      </MantineProvider>
    </Provider>
  );
}
