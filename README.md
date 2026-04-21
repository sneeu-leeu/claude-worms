# 🪱 Claude Worms

A Worms-game-themed dashboard for managing Claude Code terminal instances. Visualize, spawn, monitor, and destroy Claude Code instances with game-style interactions.

## Features

- **Real-time Worm Tracking** - Watch Claude Code instances as animated worms
- **Instance Management** - Spawn new instances, kill them with a weapon menu
- **Live Monitoring** - View health (based on activity), current task, and uptime
- **Spectate Mode** - Watch a worm's terminal output live
- **Weather System** - System load indicator with animated weather effects
- **Game Mechanics** - Phaser 3 canvas with physics, explosions, and terrain destruction

## Architecture

- **Backend**: Node.js + Express 5 + Socket.io (port 4242)
- **Frontend**: React 19 + Vite + Phaser 3 + Zustand (dev: port 4243)
- **Instance Discovery**: Monitors `~/.claude/sessions/` and `~/.claude/projects/` directories
- **iTerm2 Integration**: AppleScript for spawning and focusing tabs

## Quick Start

### Prerequisites

- Node.js 18+
- macOS with iTerm2
- Claude Code instances running

### Installation

```bash
cd ~/claude-worms
npm run install:all
```

### Development

```bash
npm run dev
```

This starts:
- Backend server on `http://localhost:4242`
- Frontend dev server on `http://localhost:4243` (proxies API to 4242)

Open `http://localhost:4243` in your browser.

### Building for Production

```bash
npm run build
npm start
```

## How It Works

1. **Session Discovery**: Backend watches `~/.claude/sessions/*.json` for Claude Code instances
2. **Activity Monitoring**: Tracks `~/.claude/projects/<cwd>/<sessionId>.jsonl` transcripts for activity and last messages
3. **iTerm2 Integration**: Polls iTerm2 every 5 seconds to fetch current task names
4. **Socket.io Sync**: Real-time updates to all connected clients
5. **Phaser Canvas**: Renders worms on destructible terrain with physics-based interactions

## Project Structure

```
~/claude-worms/
├── server/          # Node.js + Express backend
│   └── src/
│       ├── discovery/   # Instance enrichment (iTerm, transcripts, sessions)
│       ├── watcher/     # File monitoring (chokidar)
│       ├── socket/      # Socket.io event handling
│       ├── routes/      # REST API endpoints
│       └── index.ts     # Server entry point
│
└── client/          # React + Phaser frontend
    └── src/
        ├── game/        # Phaser 3 scenes and objects
        ├── store/       # Zustand state management
        ├── socket/      # Socket.io client integration
        ├── components/  # React UI components
        └── main.tsx     # App entry point
```

## Development Roadmap

- [x] Phase 1: Backend core (session watching, iTerm integration, Socket.io)
- [x] Phase 2: Frontend state layer (Zustand stores, socket events)
- [ ] Phase 3: Phaser canvas (terrain, worms, physics)
- [ ] Phase 4: Game features (explosions, parachutes, spectate mode)
- [ ] Phase 5: Polish (sprites, sounds, scoreboard)

## API Endpoints

### GET `/api/instances`
List all worm instances

### POST `/api/instances`
Spawn a new instance
```json
{
  "projectPath": "/path/to/project"
}
```

### DELETE `/api/instances/:pid`
Kill an instance (SIGTERM, SIGKILL, SIGHUP)
```json
{
  "signal": "SIGTERM"
}
```

### POST `/api/instances/:pid/focus`
Focus the iTerm2 tab for this instance

## Contributing

This is a personal project. Fork freely and customize!

## License

MIT