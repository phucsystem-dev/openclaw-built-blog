---
title: "Building Custom Skills for OpenClaw"
date: "2024-03-10"
author: "OpenClaw Team"
category: "Development"
excerpt: "A deep dive into creating powerful custom skills for OpenClaw with Python and JavaScript."
---

# Building Custom Skills for OpenClaw

Skills are the heart of OpenClaw. They extend its capabilities and allow you to automate virtually anything. This guide covers everything you need to know about creating custom skills.

## Skill Architecture

A skill in OpenClaw consists of:

1. **SKILL.md** - Documentation and metadata
2. **Implementation files** - JavaScript, Python, or other languages
3. **Configuration** - Optional settings and dependencies
4. **Assets** - Images, templates, or data files

## Creating a Skill Structure

The basic structure of a skill directory:

```
my-skill/
├── SKILL.md          # Skill documentation
├── index.js          # Main skill file (JavaScript)
├── skill.py          # Alternative Python implementation
├── package.json      # Node.js dependencies (optional)
├── requirements.txt  # Python dependencies (optional)
├── config/           # Configuration files
├── scripts/          # Helper scripts
└── references/       # Documentation and examples
```

## JavaScript Skills

### Basic Skill Template

```javascript
// index.js
module.exports = {
  name: 'my-skill',
  version: '1.0.0',
  
  setup(claw, config) {
    // Register commands
    claw.onCommand('greet', async (args, context) => {
      const name = args[0] || context.user?.name || 'there';
      return `Hello ${name}! 👋`;
    });
    
    // Register event handlers
    claw.onEvent('message.received', async (message) => {
      if (message.text.includes('hello')) {
        await claw.reply(message, 'I heard you say hello!');
      }
    });
    
    // Register cron jobs
    claw.onCron('0 9 * * *', async () => {
      await claw.sendToUser('Good morning! ☀️');
    });
    
    // Register HTTP endpoints
    claw.onHttp('GET', '/api/my-skill/data', async (req, res) => {
      return { data: 'Hello from my skill!' };
    });
  },
  
  teardown(claw) {
    // Cleanup resources when skill is unloaded
    console.log('My skill is being unloaded');
  }
};
```

### Advanced Features

**State Management:**
```javascript
setup(claw) {
  const state = claw.getState('my-skill');
  
  claw.onCommand('counter', async () => {
    state.count = (state.count || 0) + 1;
    await claw.saveState('my-skill', state);
    return `Count: ${state.count}`;
  });
}
```

**External API Calls:**
```javascript
setup(claw) {
  claw.onCommand('weather', async (args) => {
    const location = args[0] || 'London';
    const response = await claw.fetch(`https://wttr.in/${location}?format=3`);
    return await response.text();
  });
}
```

**File Operations:**
```javascript
setup(claw) {
  claw.onCommand('readfile', async (args) => {
    const path = args[0];
    const content = await claw.readFile(path);
    return `File content:\n\`\`\`\n${content}\n\`\`\``;
  });
}
```

## Python Skills

OpenClaw also supports Python skills through the Python bridge:

```python
# skill.py
from openclaw.skill import Skill

class MySkill(Skill):
    def setup(self):
        # Register commands
        self.register_command('python_hello', self.python_hello)
        
        # Register events
        self.register_event('message.received', self.on_message)
    
    def python_hello(self, args, context):
        name = args[0] if args else context.get('user', {}).get('name', 'there')
        return f"Hello from Python, {name}! 🐍"
    
    def on_message(self, message):
        if 'python' in message.get('text', '').lower():
            self.reply(message, "Python skill activated!")
    
    def teardown(self):
        print("Python skill cleanup")
```

## Skill Configuration

Skills can have configuration files in `config/`:

```yaml
# config/default.yaml
api_key: ${ENV:MY_API_KEY}
settings:
  enabled: true
  timeout: 30
  retries: 3
```

Access configuration in your skill:
```javascript
setup(claw, config) {
  const apiKey = config.api_key;
  const timeout = config.settings.timeout;
  
  if (!config.settings.enabled) {
    console.log('Skill is disabled in config');
    return;
  }
}
```

## Skill Dependencies

### Node.js Dependencies
```json
{
  "name": "my-skill",
  "dependencies": {
    "axios": "^1.0.0",
    "cheerio": "^1.0.0"
  }
}
```

### Python Dependencies
```txt
# requirements.txt
requests>=2.28.0
beautifulsoup4>=4.11.0
pandas>=1.5.0
```

## Testing Skills

Create test files in your skill directory:

```javascript
// test/my-skill.test.js
const { setup } = require('../index.js');

describe('My Skill', () => {
  let mockClaw;
  
  beforeEach(() => {
    mockClaw = {
      onCommand: jest.fn(),
      onEvent: jest.fn(),
      reply: jest.fn(),
      getState: jest.fn(),
      saveState: jest.fn()
    };
  });
  
  test('registers greet command', () => {
    setup(mockClaw, {});
    expect(mockClaw.onCommand).toHaveBeenCalledWith('greet', expect.any(Function));
  });
});
```

## Publishing Skills

Once your skill is ready, you can publish it to [ClawHub](https://clawhub.ai):

1. Create a `package.json` with metadata
2. Add a comprehensive `SKILL.md`
3. Test thoroughly
4. Use the ClawHub CLI to publish:

```bash
clawhub publish ./my-skill
```

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Logging**: Use `claw.log()` for structured logging
3. **Configuration**: Make skills configurable via environment variables
4. **State Management**: Use `claw.getState()` for persistent storage
5. **Security**: Never hardcode secrets; use environment variables or config
6. **Documentation**: Keep `SKILL.md` updated with examples
7. **Testing**: Write tests for critical functionality
8. **Versioning**: Use semantic versioning for releases

## Example: Weather Skill

Here's a complete example of a weather skill:

```javascript
// index.js
module.exports = {
  name: 'weather',
  version: '1.0.0',
  
  setup(claw, config) {
    const apiKey = config.api_key || process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      claw.log('warn', 'Weather API key not configured');
    }
    
    claw.onCommand('weather', async (args) => {
      if (!apiKey) {
        return 'Weather API key not configured. Set WEATHER_API_KEY environment variable.';
      }
      
      const location = args.join(' ') || 'London';
      
      try {
        const response = await claw.fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}`
        );
        
        const data = await response.json();
        
        return `
🌤️ **Weather for ${data.location.name}, ${data.location.country}**
• Temperature: ${data.current.temp_c}°C (feels like ${data.current.feelslike_c}°C)
• Condition: ${data.current.condition.text}
• Humidity: ${data.current.humidity}%
• Wind: ${data.current.wind_kph} kph ${data.current.wind_dir}
        `.trim();
      } catch (error) {
        claw.log('error', 'Weather API error', { error: error.message });
        return `Failed to get weather for ${location}. Error: ${error.message}`;
      }
    });
  }
};
```

## Conclusion

Building skills for OpenClaw is a powerful way to extend its capabilities. Whether you're automating simple tasks or building complex integrations, the skill system provides the flexibility you need.

Start with simple skills and gradually add complexity as you become more familiar with the API. The OpenClaw community is always ready to help in the [Discord server](https://discord.gg/clawd).

Happy skill building! 🛠️