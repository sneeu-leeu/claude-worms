import React, { useEffect, useState } from 'react';
import { getSocket } from '../socket/SocketClient';
import { useWormStore } from '../store/useWormStore';

interface Message {
  role: string;
  text: string;
  timestamp?: string;
}

export function SpectatePanel() {
  const spectatingWormPid = useWormStore((state) => state.spectatingWormPid);
  const worms = useWormStore((state) => state.getAllWorms());
  const spectatingWorm = spectatingWormPid ? worms.find((w) => w.pid === spectatingWormPid) : null;
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!spectatingWorm) {
      setMessages([]);
      return;
    }

    const socket = getSocket();

    const handleContent = (data: { messages: Message[] }) => {
      setMessages(data.messages);
    };

    const handleError = (data: { message: string }) => {
      setMessages([{ role: 'system', text: `Error: ${data.message}` }]);
    };

    socket.emit('client:spectate', { pid: spectatingWorm.pid });
    socket.on('spectate:content', handleContent);
    socket.on('spectate:error', handleError);

    return () => {
      socket.off('spectate:content', handleContent);
      socket.off('spectate:error', handleError);
      socket.emit('client:spectate:stop');
    };
  }, [spectatingWorm]);

  if (!spectatingWorm) {
    return null;
  }

  return (
    <div className="w-80 bg-gray-900 text-white border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-sm">{spectatingWorm.cwd.split('/').pop()}</h3>
            <p className="text-xs text-gray-400">{spectatingWorm.sessionId.slice(0, 8)}</p>
          </div>
          <button
            onClick={() => useWormStore.getState().setSpectating(null)}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 font-mono text-xs bg-gray-950">
        {messages.length === 0 ? (
          <div className="text-gray-500">Loading transcript...</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.role === 'assistant' ? 'text-green-400' : 'text-blue-400'}`}>
              <span className="text-gray-600">[{msg.role}]</span> {msg.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
