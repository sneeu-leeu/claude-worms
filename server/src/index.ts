import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { config } from './config.js';
import { SessionWatcher } from './watcher/SessionWatcher.js';
import { ProcessMonitor } from './watcher/ProcessMonitor.js';
import { TranscriptWatcher } from './watcher/TranscriptWatcher.js';
import { ItermBridge } from './discovery/ItermBridge.js';
import { SocketServer } from './socket/SocketServer.js';
import { createInstanceRoutes } from './routes/instances.js';
import { createSystemRoutes } from './routes/system.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ['http://localhost:4243', 'http://localhost:4242'],
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize watchers and managers
const sessionWatcher = new SessionWatcher();
const processMonitor = new ProcessMonitor();
const transcriptWatcher = new TranscriptWatcher();
const socketServer = new SocketServer(io);

// Setup watcher callbacks
sessionWatcher.start(
  (instance) => {
    console.log('Worm spawned:', instance.sessionId);
    socketServer.emit('worm:spawned', instance);
  },
  (pid, sessionId) => {
    console.log('Worm died:', sessionId);
    socketServer.emit('worm:died', { pid, sessionId });
  },
);

// Setup process monitor
processMonitor.start(
  () => sessionWatcher.getAllInstances(),
  (pid, sessionId) => {
    socketServer.emit('worm:died', { pid, sessionId });
  },
);

// Setup transcript watcher
transcriptWatcher.start(
  () => sessionWatcher.getAllInstances(),
  (update) => {
    socketServer.emit('worm:activity', {
      pid: update.pid || 0,
      lastOutput: update.lastOutput || '',
      health: update.health || 0,
      status: update.status || 'waiting',
      currentTask: update.currentTask || 'Unknown',
    });
  },
);

// Start weather updates
socketServer.startWeatherUpdates();

// Setup routes
app.use(createInstanceRoutes(sessionWatcher));
app.use(createSystemRoutes());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Periodic iTerm name refresh (every 5 seconds)
setInterval(async () => {
  try {
    const itermNames = await ItermBridge.getSessionNames();
    const instances = sessionWatcher.getAllInstances();

    for (const instance of instances) {
      const newTask = itermNames.get(instance.tty) || instance.currentTask;
      if (newTask !== instance.currentTask) {
        socketServer.emit('worm:activity', {
          pid: instance.pid,
          lastOutput: instance.lastOutput,
          health: instance.health,
          status: instance.status,
          currentTask: newTask,
        });
      }
    }
  } catch (err) {
    console.error('Error refreshing iTerm names:', err);
  }
}, config.ITERM_POLL_INTERVAL);

// Start server
httpServer.listen(config.PORT, () => {
  console.log(`Claude Worms server running on port ${config.PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  sessionWatcher.stop();
  processMonitor.stop();
  transcriptWatcher.stop();
  socketServer.stop();
  process.exit(0);
});
