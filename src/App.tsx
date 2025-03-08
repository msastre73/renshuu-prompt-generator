import "@mantine/core/styles.css";
import { Anchor, Button, MantineProvider, Paper, Stack, Text, Title, Image } from "@mantine/core";
import { theme } from "./theme";
import { Shell } from "./layout/Shell";
import { StepperWrapper } from "./components/Stepper/StepperWrapper";
import './globalStyles.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { useEffect, useState } from "react";
import { RENSHUU_TOKEN_KEY, RENSHUU_PROMPT_CONFIG_KEY } from "./constants";
import { renshuuService } from "./services/renshuuService";
import processProfileData from "./business_logic/processProfileData";
import { clearAllUserDataAndState, setLastPromptConfig, setStoreDataLocally } from "./store/slices/userSlice";
import { IconLogout2, IconBrandGithub } from "@tabler/icons-react";
export default function App() {
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.stepper.activeStep);
  const token = useSelector((state: RootState) => state.token.value);
  const [appInitialized, setAppInitialized] = useState(false);
  const [appLoading, setAppLoading] = useState(false);


  useEffect(() => {

    const initializeApp = async () => {
      const token = localStorage.getItem(RENSHUU_TOKEN_KEY);
      if (token) {
        setAppLoading(true);
        // Try to get the profile data
        const profile = await renshuuService.getProfile(token);
        if (profile) {
          // If there's prompt config data, also get that
          const promptConfig = localStorage.getItem(RENSHUU_PROMPT_CONFIG_KEY);
          if (promptConfig) {
            const promptConfigData = JSON.parse(promptConfig);
            dispatch(setLastPromptConfig(promptConfigData));
          }
          dispatch(setStoreDataLocally(true));
          processProfileData(profile, token, false);
        }
      }
      setAppInitialized(true);
      setAppLoading(false);
    };

    initializeApp();
  }, []);

  return (
    <MantineProvider theme={theme}>
      <Shell>
        {appInitialized ? (
          <Stack align="center">
            <Paper shadow="xs" p="xl" w="100%" maw={800}>

              {step === 0 && <Stack gap="xs" mb="xl">
                <Image
                  src="/android-chrome-512x512.png"
                  alt="Renshuu Prompt Generator Logo"
                  w={80}
                  h={80}
                  style={{ alignSelf: 'center', borderRadius: '10px' }}
                />
                <Title order={3} ta="center"> ようこそ! </Title>
                <Title order={2}> Welcome to the Renshuu Prompt Generator!</Title>
                <Text>
                  This is a tiny utility app that connects to your Reinshuu account and generates{' '}
                  prompts based on your selected schedules, for practicing conversation with LLM chats, like{' '}
                  <Anchor target="_blank" href="https://chatgpt.com">ChatGPT</Anchor>,{' '}
                  <Anchor target="_blank" href="https://claude.ai">Claude</Anchor>,{' '}
                  <Anchor target="_blank" href="https://gemini.google.com">Gemini</Anchor>, etc.
                </Text>
                <Text>
                  The full prompt does not always works as expected, so I've created a GPT{' '}
                  fine-tuned for this use case which performs better and needs less input.
                </Text>
              </Stack>}
              {token &&<Button mb="md"
                leftSection={<IconLogout2 />}
                color="gray.5"
                variant="subtle"
                onClick={() => clearAllUserDataAndState(dispatch)}>
                Log Out
              </Button>}
              <StepperWrapper />
            </Paper>
            <Text size="xs"  c="dimmed">Made with ❤️ by <Anchor href="https://www.linkedin.com/in/msastre73/" target="_blank">Marcos Sastre</Anchor> using <Anchor href="https://mantine.dev/" target="_blank">Mantine UI</Anchor> | <Anchor href="https://github.com/msastre73/renshuu-prompt-generator" target="_blank"> Github repo <IconBrandGithub size={10} /></Anchor></Text>

          </Stack>
        ) : (
          <Stack align="center">
            {appLoading && <Text size="sm" c="dimmed">Loading...</Text>}
          </Stack>
        )}
      </Shell>
    </MantineProvider>
  );
}
