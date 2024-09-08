import { useEffect, useRef, useState } from 'react';
import './App.css';
import Header from '../../components/Header/Header';
import NewChat from '../../components/NewChat/NewChat';
import ChatTitle from '../../components/ChatTitle/ChatTitle';
import Human from '../../components/Conversation/Human';
import AI from '../../components/Conversation/AI';
import Input from '../../components/Input/Input';
import SignIn from '../../components/SignIn/SignIn';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../js/auth';
import { getAllChats, getChat, newChat, queryModel } from '../../js/api';
import { useSignMessage } from 'wagmi';

function App() {
  const convo = useRef(null);
  const [user, setUser] = useState(null);
  const [currentChat, setCurrentChat] = useState('');
  const [chatTitles, setChatTitles] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [userSignature, setUserSignature] = useState(null); // For storing the user's signature

  // useSignMessage hook for signing message
  const { data: signature, signMessage, isSuccess } = useSignMessage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    if (user) {
      populateData();
      // Sign a message to get the user's signature when the app starts
      signMessage({ message: 'Sign this message to authenticate your session in the app.' });
    } else {
      clearChatData();
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess && signature) {
      // When the message is successfully signed, store the signature
      setUserSignature(signature);
    }
  }, [isSuccess, signature]);

  useEffect(() => {
    if (currentChat && user) {
      populateData();
      fetchConversation();
    }
  }, [currentChat]);

  const clearChatData = () => {
    setChatTitles([]);
    setConversations([]);
    setCurrentChat('');
  };

  const populateData = async () => {
    setChatLoading(true);
    try {
      const res = await getAllChats(user.uid);
      setChatTitles(res.data.chats);
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const getNewChat = async () => {
    if (user) {
      try {
        const nC = await newChat(user.uid);
        setCurrentChat(nC.data.id);
      } catch (error) {
        console.error('Error creating new chat:', error);
      }
    }
  };

  const fetchConversation = async () => {
    if (user) {
      try {
        const res = await getChat(user.uid, currentChat);
        setConversations(res.data.chat.conversation);
        scrollToBottom();
      } catch (err) {
        console.error('Error fetching chat:', err);
      }
    }
  };

  const query = async (queryData) => {
    setLoading(true);
    try {
      const res = await queryModel(user.uid, currentChat, queryData);
      const newConversation = [
        { author: 'user', message: queryData },
        { author: 'model', message: res.data.response },
      ];
      setConversations([...conversations, ...newConversation]);

      if (conversations.length === 1) {
        populateData();
      }
    } catch (err) {
      console.error('Error during query:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (convo.current) {
      convo.current.scrollTop = convo.current.scrollHeight;
    }
  };

  const formatAnswer = (rawString) => {
    const lines = rawString.split(/\r?\n/);
    const formattedAnswer = [];
    let isCodeBlock = false;
    let codeContent = [];

    lines.forEach((line) => {
      if (line.startsWith('```')) {
        if (isCodeBlock) {
          formattedAnswer.push(
            <div className="code-block">
              <pre><code>{codeContent.join('\n')}</code></pre>
            </div>
          );
          codeContent = [];
        }
        isCodeBlock = !isCodeBlock;
      } else if (isCodeBlock) {
        codeContent.push(line);
      } else if (line.startsWith('>')) {
        formattedAnswer.push(<blockquote>{line.slice(1).trim()}</blockquote>);
      } else if (line.trim()) {
        formattedAnswer.push(<p>{line.trim()}</p>);
      }
    });

    return formattedAnswer;
  };

  return (
    <>
      <div className={`app ${user ? '' : 'blur'}`}>
        <div className="all-chats">
          <NewChat onClick={getNewChat} user={user} currentChat={currentChat} setCurrentChat={setCurrentChat} />
          <div className="previous-chats">
            {chatLoading ? (
              <div>Loading your chats! Please be patient (The first time takes up to 50 seconds)</div>
            ) : (
              chatTitles.map((chat, index) => (
                <ChatTitle chat={chat} key={index} currentChat={currentChat} setCurrentChat={setCurrentChat} />
              ))
            )}
          </div>
        </div>
        <div className="chat-screen">
          <div className="current-conversation">
            <Header user={user} />
            <div ref={convo} className={`conversation ${currentChat.length ? 'active-chat' : ''}`}>
              {conversations.map((conversation, index) =>
                conversation.author === 'user' ? (
                  <Human data={conversation.message} key={index} />
                ) : (
                  <AI data={formatAnswer(conversation.message)} key={index} />
                )
              )}
            </div>
          </div>
          <div className="prompt-wrapper">
            <Input
              user={user}
              currentChat={currentChat}
              query={query}
              loading={loading}
              setLoading={setLoading}
              getNewChat={getNewChat}
              userSignature={userSignature}
            />
          </div>
        </div>
      </div>
      {!user && <SignIn />}
    </>
  );
}

export default App;
