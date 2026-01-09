import { Button, Center, PasswordInput, Stack, Text, TextInput, Title, Group } from '@mantine/core';
import { IconHeadset, IconLock } from '@tabler/icons-react';
import { useState } from 'react';

interface LoginProps {
    onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (username === 'admin' && password === 'admin') {
            onLogin();
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <Center h="100vh" className="bg-stone-100 dark:bg-stone-950">
            <div className="w-[400px] relative">
                {/* Industrial Header Tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-300/50 backdrop-blur-sm shadow-sm z-10 border-l border-r border-stone-400/30"></div>

                <div className="bg-white dark:bg-stone-900 border-x-4 border-b-4 border-t-4 border-stone-300 dark:border-stone-800 shadow-xl p-8 relative overflow-hidden">
                    {/* Decorative striped edge */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-10"></div>

                    <Stack gap="lg">
                        <div className="text-center mb-4">
                            <Center mb="md">
                                <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-full border-2 border-stone-200 dark:border-stone-700">
                                    <IconHeadset size={42} className="text-stone-700 dark:text-stone-300" stroke={1.5} />
                                </div>
                            </Center>
                            <Title order={2} ff="monospace" className="uppercase tracking-widest text-stone-800 dark:text-stone-100">
                                CSR ACCESS
                            </Title>
                            <Text size="sm" c="dimmed" ff="monospace" className="mt-2">
                                CUSTOMER SERVICE PORTAL
                            </Text>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-sm font-mono">
                                ERROR: {error}
                            </div>
                        )}

                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <Stack>
                                <TextInput
                                    label={<Text size="sm" ff="monospace" fw={700} className="uppercase text-stone-500">Agent ID</Text>}
                                    placeholder="Enter ID"
                                    value={username}
                                    onChange={(event) => setUsername(event.currentTarget.value)}
                                    error={!!error}
                                    size="md"
                                    radius="md"
                                    classNames={{
                                        input: "bg-stone-50 dark:bg-stone-950/50 border-stone-200 dark:border-stone-800 focus:border-stone-500 font-mono"
                                    }}
                                />

                                <PasswordInput
                                    label={<Text size="sm" ff="monospace" fw={700} className="uppercase text-stone-500">Access Key</Text>}
                                    placeholder="Enter Key"
                                    value={password}
                                    onChange={(event) => setPassword(event.currentTarget.value)}
                                    error={!!error}
                                    size="md"
                                    radius="md"
                                    classNames={{
                                        input: "bg-stone-50 dark:bg-stone-950/50 border-stone-200 dark:border-stone-800 focus:border-stone-500 font-mono"
                                    }}
                                />

                                <Button
                                    fullWidth
                                    onClick={handleSubmit}
                                    color="dark"
                                    size="md"
                                    mt="md"
                                    className="bg-stone-800 hover:bg-black text-stone-100 uppercase tracking-wider font-mono transition-colors"
                                >
                                    <Group gap="xs">
                                        <IconLock size={16} />
                                        <span>Authentication</span>
                                    </Group>
                                </Button>
                            </Stack>
                        </form>

                        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800/50 text-center">
                            <div className="inline-block relative">
                                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-2 text-xs font-mono border border-yellow-200 dark:border-yellow-800/50 shadow-sm rotate-1">
                                    <Text span fw={700}>HINT:</Text> admin / admin
                                </div>
                            </div>
                        </div>
                    </Stack>
                </div>
            </div>
        </Center>
    );
}
