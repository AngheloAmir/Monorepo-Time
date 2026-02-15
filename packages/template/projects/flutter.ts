import type { ProjectTemplate } from "../../types";

export const FlutterApp: ProjectTemplate = {
  name: 'Flutter App',
  description: 'Multi-platform app with Flutter',
  notes: "Flutter SDK must be installed and in your PATH.",
  type: "app",
  category: "Project",
  icon: "fas fa-mobile-alt text-blue-400",
  templating: [
    {
      action: 'command',
      cmd: 'rm -rf ./* ./.[!.]*', // Clean directory
      args: []
    },
    {
      action: 'command',
      cmd: 'flutter',
      args: ['create', '.']
    }
  ]
};
