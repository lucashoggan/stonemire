import { useState } from 'react';
import { T } from '../tokens';
import type { Convo } from '../App';

interface Props {
  username: string;
  convos: Convo[];
  onNewChat: () => void;
  onOpenChat: (convo: Convo) => void;
}

function ComposeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 13.5V15h1.5l8.813-8.813-1.5-1.5L3 13.5z" fill="currentColor" />
      <path d="M14.78 4.22a1 1 0 0 0 0-1.414l-1.586-1.586a1 1 0 0 0-1.414 0l-1.22 1.22 3 3 1.22-1.22z" fill="currentColor" />
    </svg>
  );
}

function ChatRow({ convo, onClick }: { convo: Convo; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center',
        width: '100%', padding: '16px 20px',
        background: hover ? T.bg3 : 'transparent',
        border: 'none', cursor: 'pointer',
        transition: 'background 0.1s',
        borderBottom: `1px solid ${T.line}`,
      }}
    >
      <span style={{
        fontFamily: T.mono, fontSize: 14,
        color: T.text, letterSpacing: '-0.01em',
      }}>{convo.username}</span>
      <span style={{
        marginLeft: 'auto', color: T.muted,
        fontSize: 16, lineHeight: 1,
        transform: hover ? 'translateX(2px)' : 'none',
        transition: 'transform 0.1s',
      }}>{'\u203A'}</span>
    </button>
  );
}

export function ChatsScreen({ username, convos, onNewChat, onOpenChat }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* header */}
      <div style={{
        padding: '20px 20px 12px',
        borderBottom: `1px solid ${T.line}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: T.mono, fontSize: 13,
            color: T.text, letterSpacing: '-0.01em',
          }}>{username}</span>
          <button
            onClick={onNewChat}
            style={{
              background: 'transparent', border: 'none',
              color: T.accent, cursor: 'pointer',
              padding: 4, display: 'flex', alignItems: 'center',
              borderRadius: 2,
              transition: 'opacity 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            title="New conversation"
          >
            <ComposeIcon />
          </button>
        </div>
        <div style={{
          marginTop: 6, fontSize: 10, fontFamily: T.mono,
          color: T.muted, letterSpacing: '0.06em',
        }}>session only — all data erased on reload</div>
      </div>

      {/* list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {convos.length === 0 ? (
          <div style={{
            padding: '48px 20px', textAlign: 'center',
            fontFamily: T.mono, fontSize: 12,
            color: T.muted, letterSpacing: '0.06em',
          }}>no conversations yet</div>
        ) : (
          convos.map(c => (
            <ChatRow key={c.username} convo={c} onClick={() => onOpenChat(c)} />
          ))
        )}
      </div>
    </div>
  );
}
