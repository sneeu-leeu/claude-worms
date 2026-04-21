# 🪱 Claude Worms

A Worms-game-themed dashboard for managing Claude Code terminal instances. Visualize, spawn, monitor, and destroy Claude Code instances with game-style interactions.

## Features

### Game Mechanics
- **🪱 Real-time Worm Tracking** - Watch Claude Code instances as animated worms on destructible terrain
- **💥 Explosions & Knockback** - Destroy terrain and apply forces to nearby worms
- **🪂 Parachute Drops** - Spawn animation for new instances
- **🌧️ Dynamic Weather** - Rain, lightning, and atmospheric effects tied to system load
- **💬 Chat Bubbles** - Live current task display above each worm
- **❤️ Health System** - Color-coded health bars (green > red) based on activity

### Management
- **🔫 Weapon Menu** - Bazooka (SIGTERM), Grenade (SIGHUP), Dynamite (SIGKILL)
- **📺 Spectate Mode** - View worm's transcript in real-time
- **🎮 Instance Control** - Spawn, focus, kill with iTerm2 integration
- **📊 Live Scoreboard** - Total messages, avg health, strongest/most active worms
- **🎨 5 Biomes** - Grass, Sand, Lava, Ice, Space (different physics each)

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

- [x] **Phase 1**: Backend core (session watching, iTerm integration, Socket.io)
- [x] **Phase 2**: Frontend state layer (Zustand stores, socket events)
- [x] **Phase 3**: Phaser canvas (terrain, worms, physics)
- [x] **Phase 4**: Game features (explosions, parachutes, spectate mode)
- [x] **Phase 5**: Polish (pixel art, retro fonts, biomes, themes)

## Visual Polish

- **Pixel Art**: Canvas-generated worm sprites with color variations
- **Retro Theme**: CRT scanlines, Press Start 2P pixel font, terminal green text
- **Biome System**: 5 different terrain biomes with unique physics parameters
- **Health Colors**: Green (healthy) → Yellow (hurt) → Red (critical)
- **Status Indicators**: Blinking pixel lights showing worm state
- **Sound Manager**: Infrastructure ready for sound effects (placeholder)

## How to Play

1. **Spawn Worms** - Click "+ SPAWN" button, enter project path
2. **Monitor Health** - Health bars drain when idle, restore on activity
3. **Select Worm** - Click a worm in the list or on the canvas
4. **Kill Worms** - Click "KILL" button or right-click in canvas for weapon menu
5. **Spectate** - Click "VIEW" to see live transcript of worm's work
6. **Check Stats** - Scoreboard at bottom shows game-wide metrics

### Game Mechanics
- **Gravity** - Worms fall and interact with terrain (varies by biome)
- **Terrain Destruction** - Explosions destroy tiles in radius
- **Knockback** - Nearby worms get pushed by explosions
- **Physics** - Each biome has different friction, bounce, gravity
- **Weather** - System load affects visual atmosphere (clear → cloudy → storm)

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