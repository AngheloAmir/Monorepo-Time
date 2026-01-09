import { Group, Title, ActionIcon, useMantineColorScheme, useComputedColorScheme, Container, Image } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export default function Header() {
    return (
        <header className="h-16 w-full bg-stone-900 dark:bg-black border-b-4 border-stone-600 dark:border-stone-800 shadow-md z-50">
            <Container fluid h="100%" className="px-6">
                <Group justify="space-between" h="100%">
                    <Group gap="md">
                        <div className="bg-white p-1 rounded-sm">
                            <Image src={'/brand.png'} h={40} w="auto" fit="contain" />
                        </div>
                        <div className="flex flex-col">
                            <Title
                                order={4}
                                className="text-stone-100 uppercase tracking-widest"
                                ff="monospace"
                            >
                                Amir Online Restaurant <span className="text-stone-500">/</span> CSR / SALES CLERK
                            </Title>
                        </div>
                    </Group>
                    <ThemeToggle />
                </Group>
            </Container>
        </header>
    )
}

function ThemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    return (
        <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="default"
            size="xl"
            aria-label="Toggle color scheme"
            className="dark:bg-gray-700 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
            {computedColorScheme === 'dark' ? <IconSun stroke={1.5} /> : <IconMoon stroke={1.5} />}
        </ActionIcon>
    );
}
