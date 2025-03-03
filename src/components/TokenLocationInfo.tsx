import { Spoiler, Text, Image, Stack } from '@mantine/core';

export function TokenLocationInfo() {
  return (
    <Spoiler maxHeight={0} showLabel="Where can I find the API key?" hideLabel="Hide">
      <Stack gap="md">
        <Stack gap="xs">
          <Text size="sm" c="dimmed">1. Open the menu on the top left corner</Text>
          <Image
            src="/images/token-location-1.png"
            alt="Top left menu"
            radius="md"
            w={400}
            fallbackSrc="https://placehold.co/400x200?text=Top+Left+Menu"
          />
          <Text size="sm" c="dimmed" mt="md">2. Click on "renshuu API", under "Tools". On desktop, it's located under "Resources".</Text>
          <Image
            src="/images/token-location-2.png"
            alt="renshuu API"
            radius="md"
            w={400}
            fallbackSrc="https://placehold.co/400x200?text=renshuu+API"
          />
          <Text size="sm" c="dimmed" mt="md">3. The letters and numbers under <b>"Your read-only API key"</b> is what we need.<br />
           Copy it and past it in the input field.<br />
           Remember to never share it with anyone, don't include it in posts, discord messages, emails, etc. Treat it like a password.
           </Text>
          <Image
            src="/images/token-location-3.png"
            alt="Copy token"    
            radius="md"
            w={400}
            fallbackSrc="https://placehold.co/400x200?text=Copy+token"
          />
        </Stack>
      </Stack>
    </Spoiler>
  );
}
