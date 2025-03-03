import { Button, TextInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { setToken } from '../store/slices/tokenSlice';
import { useDispatch } from 'react-redux';
import { renshuuService } from '../services/renshuuService';
interface TokenFormValues {
  token: string;
}

export function TokenForm() {
  const dispatch = useDispatch();
  const form = useForm<TokenFormValues>({
    initialValues: {
      token: '',
    },
  });

  const handleSubmit = async (values: TokenFormValues) => {
    dispatch(setToken(values.token));
    const profile = await renshuuService.getProfile(values.token);
    console.log(profile);

  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack mx="auto" w="100%" maw={400}>
        <TextInput
          label="API Key"
          placeholder="Enter your API key"
          {...form.getInputProps('token')}
        />
        <Button type="submit">Connect</Button>
        <Text size="sm" c="dimmed">
          The API Key will only be stored locally on your device. This app does NOT store your API Key anywhere.
        </Text>
        <Text size="sm" c="red">
          ⚠️ NEVER include your API key directly on posts, emails, Discord messages, etc. Treat it like a password!
        </Text>
      </Stack>
    </form>
  );
}
