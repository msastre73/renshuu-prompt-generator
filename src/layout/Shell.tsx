import { Alert, Anchor, AppShell,  Stack, } from '@mantine/core';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { TEST_MODE_TOKEN } from '../constants';
import { IconInfoCircle } from '@tabler/icons-react';
import { clearAllUserDataAndState } from '../store/slices/userSlice';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.value);

  const handleExitTestMode = () => {
    console.log('Clearing all data link clicked');
    clearAllUserDataAndState(dispatch);
  };

  return (
    <AppShell
      header={{ height: 0 }}
      padding="md"
    >
      <AppShell.Main bg="gray.0">
        <Stack >
          {token && token === TEST_MODE_TOKEN && (
            <Stack w="100%" bg="gray.0" pos="sticky" top={0} style={{ zIndex: 100 }}>
              <Alert
                className="test-mode-alert"
                variant="light"
                color="yellow"
                title="Test mode"
                icon={<IconInfoCircle />}>
                You are in TEST mode. <Anchor onClick={handleExitTestMode}  >Exit test mode</Anchor> to connect to your Renshuu account.
              </Alert>
            </Stack>
          )}
          {children}
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
