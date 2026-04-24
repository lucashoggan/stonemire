import { useState, useEffect, useRef } from 'react';
import { T } from '../tokens';
import type { Convo, ChatMessage } from '../App';

interface Props {
  username: string;
  convo: Convo;
  messages: ChatMessage[];
  onSend: (toUsername: string, text: string) => void;
  onBack: () => void;
}

export function ChatScreen({ username, convo, messages, onSend, onBack }: Props) {
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  function send() {
    const t = draft.trim();
    if (!t) return;
    onSend(convo.username, t);
    setDraft('');
    inputRef.current?.focus();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px', borderBottom: `1px solid ${T.line}`,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none',
            color: T.dim, cursor: 'pointer',
            fontFamily: T.mono, fontSize: 18,
            padding: 0, lineHeight: 1,
            transition: 'color 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = T.text}
          onMouseLeave={e => e.currentTarget.style.color = T.dim}
        >{'\u2039'}</button>
        <span style={{
          fontFamily: T.mono, fontSize: 13,
          color: T.text, letterSpacing: '-0.01em',
        }}>{convo.username}</span>
        <span style={{
          marginLeft: 'auto', fontFamily: T.mono,
          fontSize: 9, color: T.muted,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>e2e encrypted</span>
      </div>

      {/* messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 20px 0',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {messages.length === 0 && (
          <div style={{
            fontFamily: T.mono, fontSize: 11,
            color: T.muted, textAlign: 'center',
            marginTop: 40, letterSpacing: '0.06em',
          }}>say something</div>
        )}
        {messages.map(m => (
          <div key={m.id} style={{
            display: 'flex',
            justifyContent: m.from === username ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '72%',
              padding: '10px 14px',
              background: m.from === username ? T.accent : T.bg3,
              color: m.from === username ? '#000' : T.text,
              fontFamily: T.sans, fontSize: 14, lineHeight: 1.5,
              fontWeight: m.from === username ? 400 : 300,
            }}>{m.text}</div>
          </div>
        ))}
        <div ref={bottomRef} style={{ height: 20 }} />
      </div>

      {/* composer */}
      <div style={{
        borderTop: `1px solid ${T.line}`,
        padding: '12px 20px',
        display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <textarea
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="message"
          rows={1}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1, resize: 'none',
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${focused ? T.accent : T.line}`,
            padding: '8px 0',
            fontSize: 14, fontFamily: T.sans,
            color: T.text, outline: 'none',
            caretColor: T.accent,
            lineHeight: 1.5,
            transition: 'border-color 0.15s',
          }}
        />
        <button
          onClick={send}
          style={{
            background: draft.trim() ? T.accent : T.bg3,
            border: 'none', cursor: draft.trim() ? 'pointer' : 'default',
            color: draft.trim() ? '#000' : T.muted,
            fontFamily: T.mono, fontSize: 11,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '8px 14px', transition: 'all 0.15s',
            fontWeight: 600, flexShrink: 0,
          }}
          onMouseEnter={e => { if (draft.trim()) e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >send</button>
      </div>
    </div>
  );
}
