import { AppShell, Button, Group, Title } from '@mantine/core';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={2}>App Name</Title>
          <Button>Action</Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main bg="gray.0">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
