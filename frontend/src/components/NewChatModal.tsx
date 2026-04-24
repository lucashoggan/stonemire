import { useState, useEffect, useRef } from 'react';
import { T } from '../tokens';

interface Props {
  onClose: () => void;
  onSend: (toUser: string, firstMsg: string) => void;
}

export function NewChatModal({ onClose, onSend }: Props) {
  const [to, setTo] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const toRef = useRef<HTMLInputElement>(null);

  useEffect(() => { toRef.current?.focus(); }, []);

  function submit() {
    const u = to.trim(); const m = msg.trim();
    if (!u) { setError('enter a username'); return; }
    if (!m) { setError('enter a first message'); return; }
    onSend(u, m);
  }

  function clearErr() { if (error) setError(''); }

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 10,
          animation: 'fadeIn 0.18s ease',
        }}
      />

      {/* sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: T.bg2,
        borderTop: `1px solid ${T.line}`,
        padding: '28px 24px 36px',
        zIndex: 11,
        animation: 'slideUp 0.22s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {/* handle */}
        <div style={{
          position: 'absolute', top: 10,
          left: '50%', transform: 'translateX(-50%)',
          width: 32, height: 3,
          background: T.line, borderRadius: 2,
        }} />

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', marginBottom: 28,
        }}>
          <span style={{
            fontFamily: T.mono, fontSize: 11,
            letterSpacing: '0.14em', color: T.dim,
            textTransform: 'uppercase',
          }}>new conversation</span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: T.muted, cursor: 'pointer',
              fontFamily: T.mono, fontSize: 16,
              padding: 0, lineHeight: 1,
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = T.text}
            onMouseLeave={e => e.currentTarget.style.color = T.muted}
          >{'\u00D7'}</button>
        </div>

        {/* username input */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block', fontFamily: T.mono,
            fontSize: 10, letterSpacing: '0.12em',
            color: T.muted, textTransform: 'uppercase', marginBottom: 8,
          }}>username</label>
          <input
            ref={toRef}
            value={to}
            onChange={e => { setTo(e.target.value); clearErr(); }}
            onKeyDown={e => {
              if (e.key === 'Enter') document.getElementById('msg-input')?.focus();
            }}
            onFocus={() => setFocusedField('to')}
            onBlur={() => setFocusedField(null)}
            placeholder="who are you messaging?"
            autoComplete="off"
            spellCheck={false}
            style={{
              width: '100%', background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${focusedField === 'to' ? T.accent : T.line}`,
              padding: '8px 0', fontSize: 16,
              fontFamily: T.mono, color: T.text,
              outline: 'none', caretColor: T.accent,
              transition: 'border-color 0.15s',
            }}
          />
        </div>

        {/* message input */}
        <div style={{ marginBottom: 6 }}>
          <label style={{
            display: 'block', fontFamily: T.mono,
            fontSize: 10, letterSpacing: '0.12em',
            color: T.muted, textTransform: 'uppercase', marginBottom: 8,
          }}>first message</label>
          <input
            id="msg-input"
            value={msg}
            onChange={e => { setMsg(e.target.value); clearErr(); }}
            onKeyDown={e => { if (e.key === 'Enter') submit(); }}
            onFocus={() => setFocusedField('msg')}
            onBlur={() => setFocusedField(null)}
            placeholder="type something"
            autoComplete="off"
            spellCheck={false}
            style={{
              width: '100%', background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${focusedField === 'msg' ? T.accent : T.line}`,
              padding: '8px 0', fontSize: 16,
              fontFamily: T.sans, color: T.text,
              outline: 'none', caretColor: T.accent,
              transition: 'border-color 0.15s',
            }}
          />
        </div>

        {/* error */}
        <div style={{
          height: 18, marginBottom: 20,
          fontFamily: T.mono, fontSize: 10,
          color: 'var(--danger)',
          opacity: error ? 1 : 0,
          transition: 'opacity 0.15s',
        }}>{error || ' '}</div>

        {/* send button */}
        <button
          onClick={submit}
          style={{
            width: '100%', padding: '14px 0',
            background: T.accent, color: '#000',
            border: 'none', cursor: 'pointer',
            fontFamily: T.mono, fontSize: 12,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            fontWeight: 600, transition: 'opacity 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >send message</button>

        {/* session note */}
        <div style={{
          marginTop: 14, textAlign: 'center',
          fontFamily: T.mono, fontSize: 10,
          color: T.muted, letterSpacing: '0.06em',
        }}>messages exist only for this session</div>
      </div>
    </>
  );
}
