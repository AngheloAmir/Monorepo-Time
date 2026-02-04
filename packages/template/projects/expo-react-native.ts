import type { ProjectTemplate } from "../../types";

export const ExpoReactNative: ProjectTemplate = {
  name: 'Expo React Native',
  description: 'React Native (Bare Minimum + TypeScript)',
  notes: "Node.js and NPM must be installed. Uses Expo.",
  type: "app",
  category: "Project",
  icon: "fas fa-mobile-alt text-white/50",
  templating: [
    {
      action: 'command',
      cmd: 'rm -rf ./* ./.[!.]*',
      args: []
    },
    {
      action: 'command',
      cmd: 'npx',
      args: ['create-expo-app', '.', '-t', 'bare-minimum']
    },
    {
      action: 'command',
      cmd: 'mv',
      args: ['App.js', 'App.tsx']
    },
    {
      action: 'command',
      cmd: 'npm',
      args: ['install', '-D', 'typescript', '@types/react', '@types/react-native']
    },
    {
      action: 'file',
      file: 'tsconfig.json',
      filecontent: '{}'
    },
    {
      action: 'command',
      cmd: 'npx',
      args: ['expo', 'install', 'expo-dev-client']
    },
    {
      action: 'file',
      file: 'App.tsx',
      filecontent: `import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{activeTab}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>Current Screen: {activeTab}</Text>
        <Text style={styles.subText}>Welcome to Expo React Native</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {['Home', 'Search', 'Settings'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
  },
  subText: {
    color: '#888',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabItem: {
    borderTopWidth: 2,
    borderTopColor: '#BB86FC',
  },
  tabText: {
    color: '#888',
    fontSize: 12,
  },
  activeTabText: {
    color: '#BB86FC',
    fontWeight: 'bold',
  },
});`
    },
    {
      action: 'command',
      cmd: 'npm',
      args: ['pkg', 'set', 'name=$(basename $PWD)']
    },
    {
        action: 'command',
        cmd: 'npm',
        args: ['pkg', 'set', 'description=Expo React Native']
    },
    {
        action: 'command',
        cmd: 'npm',
        args: ['pkg', 'set', 'scripts.dev=expo start --go']
    },
    {
        action: 'command',
        cmd: 'npm',
        args: ['pkg', 'set', 'scripts.start=expo run:android']
    },
    {
        action: 'command',
        cmd: 'npm',
        args: ['pkg', 'set', 'scripts.android=expo run:android']
    },
    {
        action: 'command',
        cmd: 'npm',
        args: ['pkg', 'set', 'scripts.ios=expo run:ios']
    },
    {
        action: 'command',
        cmd: 'npm',
        args: ['pkg', 'set', 'fontawesomeIcon=fas fa-mobile-alt text-white/50']
    }
  ]
};
