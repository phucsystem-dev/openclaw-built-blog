---
title: "Getting Started with OpenClaw"
date: "2024-03-15"
author: "OpenClaw Team"
category: "Tutorial"
excerpt: "Learn how to set up your first OpenClaw instance and create your initial skills."
---

# Getting Started with OpenClaw

OpenClaw is an open-source personal assistant framework that runs on your own infrastructure. This guide will walk you through setting up your first instance.

## Prerequisites

Before you begin, make sure you have:

- A machine running Linux, macOS, or Windows (WSL2)
- Node.js 18 or higher
- Python 3.8 or higher (for some skills)
- Git installed

## Installation

### Quick Install

The easiest way to install OpenClaw is using npm:

```bash
npm install -g openclaw
```

Or using the install script:

```bash
curl -fsSL https://install.openclaw.ai | bash
```

### Manual Installation

If you prefer manual installation:

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
npm install
npm run build
```

## Initial Setup

After installation, run the setup wizard:

```bash
openclaw setup
```

The wizard will guide you through:
1. Creating your workspace directory
2. Setting up your first agent
3. Configuring your preferred AI model
4. Connecting to messaging platforms (optional)

## Creating Your First Skill

Skills are the building blocks of OpenClaw. Let's create a simple "Hello World" skill:

1. Create a new skill directory:
```bash
mkdir -p ~/.openclaw/skills/hello-world
cd ~/.openclaw/skills/hello-world
```

2. Create `SKILL.md`:
```markdown
# Hello World Skill

A simple skill that responds with greetings.

## Commands
- `hello` - Responds with a greeting
- `time` - Returns the current time
```

3. Create `index.js`:
```javascript
module.exports = {
  name: 'hello-world',
  setup(claw) {
    claw.onCommand('hello', async (args, context) => {
      return `Hello ${context.user?.name || 'there'}! 👋`;
    });
    
    claw.onCommand('time', async () => {
      return `The current time is ${new Date().toLocaleTimeString()}`;
    });
  }
};
```

4. Register the skill:
```bash
openclaw skill register ./hello-world
```

## Testing Your Setup

Start OpenClaw in development mode:

```bash
openclaw dev
```

Then try your new skill:
```
> hello
Hello there! 👋

> time
The current time is 14:30:25
```

## Next Steps

Now that you have OpenClaw running, you can:

1. **Explore existing skills** from [ClawHub](https://clawhub.ai)
2. **Connect to messaging platforms** like Telegram, Discord, or WhatsApp
3. **Create more complex skills** that interact with APIs, databases, or IoT devices
4. **Set up cron jobs** for automated tasks
5. **Configure voice synthesis** for audio responses

## Troubleshooting

### Common Issues

**Permission errors**: Make sure you have write permissions to the installation directory.

**Node.js version**: OpenClaw requires Node.js 18+. Check with `node --version`.

**Port conflicts**: OpenClaw uses port 3000 by default. Change it with `--port` flag.

**Getting help**: Join the [OpenClaw Discord](https://discord.gg/clawd) for community support.

## Conclusion

You now have a working OpenClaw installation! The real power comes from building and combining skills to automate your workflows. Check out the [documentation](https://docs.openclaw.ai) for more advanced topics and examples.

Happy automating! 🚀