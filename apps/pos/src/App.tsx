import { AppShell, Title, Text, Container } from '@mantine/core';
import Header from './components/Header';
import { useState } from 'react';
import { Login } from './components/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <AppShell
      header={{ height: 100 }}
      padding="md"
    >
      <Header />

      <AppShell.Main className="bg-white dark:bg-gray-800 transition-colors duration-300 min-h-screen">
        <Container size="xl" py="xl">
          <Title order={1} mb="md">Welcome to our refined dining experience</Title>
          <Text>
            This application uses Vite, React, TypeScript, Mantine UI, and Tailwind CSS v4.
          </Text>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
