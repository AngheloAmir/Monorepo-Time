## Monorepo Time
**Monorepo Time** provides a modern, interactive web interface to manage, visualize, and control your monorepo workspaces. Stop wrestling with endless terminal tabs and get a clear overview of your project structure, scripts, and build tasks.

## Installation

Install as a dev dependency in your project:

```bash
npm install -D monorepotime
```

Then initialize it in your project:

```bash
npx monorepotime init
```

This will add the following script to your `package.json`:

```json
{
  "packageManager": "npm@<the version of you package manager>",
  "scripts": {
    "monorepotime": "monorepotime"
  }
}
```

Now you can run it with:

```bash
npm run monorepotime
```

This will:
1. Start a local server.
2. Open the dashboard in your default browser.
3. Allow you to interact with your workspaces immediately.

## License

ISC © [Anghelo Amir](https://github.com/AngheloAmir/Monorepo-Time)
