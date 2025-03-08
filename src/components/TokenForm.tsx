import { Button, Stack, Text, PasswordInput, Checkbox, Modal, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useEffect, useState } from 'react';

export interface TokenFormValues {
  token: string;
  rememberToken: boolean;
}

interface TokenFormProps {
  onSubmit: (values: TokenFormValues) => Promise<void>;
  isConnecting: boolean;
  tokenError: boolean;
  resentTokenError: () => void;
}

export function TokenForm({ onSubmit, isConnecting, tokenError, resentTokenError  }: TokenFormProps) {
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const form = useForm<TokenFormValues>({
    initialValues: {
      token: '',
      rememberToken: true,
    },
    validate: {
      token: (value) => value.length === 0 ? 'API Key is required' : null,
    },
  });

  useEffect(() => {
    if (tokenError) {
      form.setFieldError('token', 'Invalid API Key');
    }
  }, [tokenError]);

  // Handle form submit
  const handleSubmit = (values: TokenFormValues) => {
    resentTokenError();
    onSubmit(values);
  };

  return (
    <>
      <Modal
        opened={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title="Terms and Conditions - API Key Storage"
      >
        <Stack>
          <Text>
            By enabling the "Remember API Key" option, you acknowledge and agree to the following:
          </Text>
          <Text>
            1. Your API key will be stored locally on your device for convenience.
          </Text>
          <Text>
            2. While we implement security best practices, there are inherent risks in storing sensitive information:<br />
            - Other users with access to your device might be able to access the key<br />
            - In the unlikely event of security vulnerabilities (such as cross-site scripting attacks or malware), stored data could be compromised
          </Text>
          <Text>
            3. This application does not have a server and does not store or transmit your API key anywhere outside your device and <Anchor href="https://api.renshuu.org/docs/" target="_blank">Renshuu's API</Anchor>.
          </Text>
          <Text>
            4. You are responsible for managing access to your device and can remove the stored API key at any time.
          </Text>
        </Stack>
      </Modal>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack mx="auto" w="100%" maw={400}>
          <PasswordInput
            label="API Key"
            placeholder="Enter your API key"
            {...form.getInputProps('token')}
          />
          <Checkbox
            label={
              <Text span size="sm">
                Remember my API Key on this device. I agree to the{' '}
                <Anchor
                  component="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTermsModalOpen(true);
                  }}
                >
                  Terms and Conditions
                </Anchor>
              </Text>
            }
            {...form.getInputProps('rememberToken', { type: 'checkbox' })}
          />
          <Button type="submit" loading={isConnecting}>Connect</Button>
          <Text size="sm" c="red">
            ⚠️ NEVER include your API key directly on posts, emails, Discord messages, etc. Treat it like a password!
          </Text>
        </Stack>
      </form>
    </>
  );
}
