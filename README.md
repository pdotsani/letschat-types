# letschat-types

Shared TypeScript types library for letschat.

## Usage

```typescript
import { Role, RoleTypes, ResponseMessage } from 'letschat-types';

// Using RoleTypes constant
const userRole = RoleTypes.User;      // 'user'
const systemRole = RoleTypes.System;  // 'system'
const assistantRole = RoleTypes.Assistant; // 'assistant'

// Using the Role type
const role: Role = 'user';

// Using the ResponseMessage interface
const message: ResponseMessage = {
  content: 'Hello!',
  messageRole: 'user',
  timestamp: new Date(),
};
```

## Exports

### Types

- **`Role`** - Union type of `'user' | 'system' | 'assistant'`
- **`RoleTypes`** - Constant object containing role values

### Interfaces

- **`ResponseMessage`** - Message structure with `content`, `messageRole`, and `timestamp`

## Development

```bash
# Build the package
npm run build

# Watch for changes
npm run watch

# Clean build artifacts
npm run clean
```

## License

MIT
