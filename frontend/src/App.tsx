import { useState, useEffect, useRef } from 'react';
import { T } from './tokens';
import { RegisterScreen } from './components/RegisterScreen';
import { ChatsScreen } from './components/ChatsScreen';
import { ChatScreen } from './components/ChatScreen';
import { NewChatModal } from './components/NewChatModal';
import { useSocket } from './context/socket';
import { generateKeyPair, decryptWithPrivateKey } from './utils/crypto-functions';
import { _sendMessage, _attemptRegister } from './utils/server-interface';
import type { User, Message } from './types/socket';

export interface Convo {
  username: string;
}

export interface ChatMessage {
  id: number;
  from: string;
  text: string;
}

type Screen = 'register' | 'chats' | 'chat';

export default function App() {
  const { socket } = useSocket();
  const [screen, setScreen] = useState<Screen>('register');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [showNewChat, setShowNewChat] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [keyPair, setKeyPair] = useState<CryptoKeyPair>();
  const msgIdRef = useRef(1);

  // Generate key pair on mount
  useEffect(() => {
    generateKeyPair().then(setKeyPair);
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const onRegisterSuccess = () => {
      setRegistering(false);
      setScreen('chats');
    };

    const onNameExists = () => {
      setRegistering(false);
      setRegisterError('username already taken');
    };

    const onUserList = (userList: User[]) => {
      setUsers(userList);
    };

    const onMsgRecv = (msg: Message) => {
      if (!keyPair?.privateKey) return;
      decryptWithPrivateKey(msg.content, keyPair.privateKey).then((plaintext) => {
        setMessages(prev => {
          const key = msg.fromUsername;
          const existing = prev[key] || [];
          return {
            ...prev,
            [key]: [...existing, {
              id: msgIdRef.current++,
              from: msg.fromUsername,
              text: plaintext,
            }],
          };
        });
      }).catch((err) => {
        console.error('Failed to decrypt message:', err);
      });
    };

    socket.on('register-success', onRegisterSuccess);
    socket.on('error:register->name-already-exists', onNameExists);
    socket.on('user-list', onUserList);
    socket.on('msg-recv', onMsgRecv);

    return () => {
      socket.off('register-success', onRegisterSuccess);
      socket.off('error:register->name-already-exists', onNameExists);
      socket.off('user-list', onUserList);
      socket.off('msg-recv', onMsgRecv);
    };
  }, [socket, keyPair]);

  function register(name: string) {
    setRegisterError('');
    _attemptRegister(
      socket,
      keyPair,
      name,
      () => { setRegistering(true); setUsername(name); },
      (err) => { setRegisterError(err); setRegistering(false); },
      () => {},
    );
  }

  function openChat(convo: Convo) {
    setActiveChat(convo.username);
    setScreen('chat');
  }

  function sendMessage(toUsername: string, text: string) {
    _sendMessage(
      toUsername,
      username,
      text,
      users,
      socket,
      () => {},
      () => {
        // Store plaintext locally for the sender
        setMessages(prev => ({
          ...prev,
          [toUsername]: [
            ...(prev[toUsername] || []),
            { id: msgIdRef.current++, from: username, text },
          ],
        }));
      },
      (err) => { console.error('Send error:', err); },
      () => {},
    );
  }

  function handleNewChat(toUser: string, firstMsg: string) {
    sendMessage(toUser, firstMsg);
    setShowNewChat(false);
    setActiveChat(toUser);
    setScreen('chat');
  }

  // Derive conversation list from messages
  const convos: Convo[] = Object.keys(messages).map(u => ({ username: u }));

  const activeConvo = activeChat ? { username: activeChat } : null;

  return (
    <div className="phone-outer" style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', height: '100%',
      background: '#080808',
    }}>
      {/* phone shell */}
      <div className="phone-shell" style={{
        width: 390, height: 720,
        background: T.bg,
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 0 0 1px #1f1f1f, 0 32px 80px rgba(0,0,0,0.8)',
      }}>

        {screen === 'register' && (
          <RegisterScreen
            onRegister={register}
            error={registerError}
            loading={registering}
          />
        )}

        {(screen === 'chats' || screen === 'chat') && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
          }}>
            <ChatsScreen
              username={username}
              convos={convos}
              onNewChat={() => setShowNewChat(true)}
              onOpenChat={openChat}
            />
          </div>
        )}

        {screen === 'chat' && activeConvo && (
          <div style={{
            position: 'absolute', inset: 0,
            background: T.bg,
            animation: 'slideInRight 0.2s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <ChatScreen
              username={username}
              convo={activeConvo}
              messages={messages[activeConvo.username] || []}
              onSend={sendMessage}
              onBack={() => setScreen('chats')}
            />
          </div>
        )}

        {showNewChat && (
          <NewChatModal
            onClose={() => setShowNewChat(false)}
            onSend={handleNewChat}
          />
        )}
      </div>
    </div>
  );
}
