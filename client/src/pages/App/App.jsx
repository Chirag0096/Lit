import { useEffect, useRef, useState } from 'react'

import './App.css';
import Header from '../../components/Header/Header';
import NewChat from '../../components/NewChat/NewChat';
import ChatTitle from '../../components/ChatTitle/ChatTitle';
import Human from '../../components/Conversation/Human';
import AI from '../../components/Conversation/AI';
import Input from '../../components/Input/Input';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../js/auth';
import SignIn from '../../components/SignIn/SignIn';
import { getAllChats, getChat, newChat, queryModel } from '../../js/api';

function App() {

  const convo = useRef(null);
  const [user, setUser] = useState(null);
  const [currentChat, setcurrentChat] = useState("");
  const [chatTitles, setChatTitles] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setloading] = useState(false);
  const [chatLoading, setchatLoading] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (user) {
      populateData();
    } else {
      setChatTitles([]);
      setConversations([]);
      setcurrentChat("");
    }
  }, [user]);


  useEffect(() => {
    if (currentChat && user) {
      populateData();
      fetchConversation();
    }
  }, [currentChat]);


  const populateData = async () => {
    setchatLoading(true);
    getAllChats(user.uid)
    .then(res => {
      setChatTitles(res.data.chats);
      setchatLoading(false);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      setchatLoading(false);
    })
  }


  const getNewChat = async () => {
    if (user) {
      try {
        let nC = await newChat(user.uid);
        setcurrentChat(nC.data.id);

        return
      } catch (error) {
        console.log("Error while trying to create a new chat", error);
      }
    }
  }

  const scrollToBottom = () => {
    if (convo.current) {
      convo.current.scrollTop = convo.current.scrollHeight;
    }
  }


  const fetchConversation = async () => {
    if (user) {
      getChat(user.uid, currentChat)
      .then(res => {
        setConversations(res.data.chat.conversation);
        scrollToBottom();
      })
      .catch(err => {
        console.log("Error while trying to fetch chat", err);
      })
    }
  }


  const query = async (query) => {
    setloading(true);
    
    queryModel(user.uid, currentChat, query)
    .then(res => {
      let l = conversations.length;

      let converstaion = [{
        'author': 'user',
        'message': query
        }, 
        {
          'author': 'model',
          'message': res.data.response
        }
      ];

      setConversations([...conversations, ...converstaion]);

      if (l == 1) {
        populateData();
      }

      setloading(false);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      setloading(false);
    })
  }


  function formatAnswer(rawString) {
    // Split the string into lines based on line breaks
    const lines = rawString.split(/\r?\n/);
    
    // Define an empty array to store the formatted answer parts
    const formattedAnswer = [];
    
    let isCodeBlock = false;
    let codeContent = [];
  
    for (const line of lines) {
      // Check for code block start/end markers
      if (line.startsWith('```')) {
        if (isCodeBlock) {
          // Closing code block
          formattedAnswer.push(
            <div className="code-block">
              <pre><code>{codeContent.join('\n')}</code></pre>
            </div>
          );
          codeContent = [];
        }
        isCodeBlock = !isCodeBlock;
      } else if (isCodeBlock) {
        // If inside a code block, keep adding lines to the codeContent
        codeContent.push(line);
      } else if (line.startsWith('>')) {
        // If the line is a quote (starting with '>'), render it as a blockquote
        formattedAnswer.push(<blockquote>{line.slice(1).trim()}</blockquote>);
      } else if (line.trim()) {
        // Render normal text as a paragraph
        formattedAnswer.push(<p>{line.trim()}</p>);
      }
    }
  
    // Return the formatted answer as an array of React elements
    return formattedAnswer;
  }
  
  

  return (
    <>
      <div className={`app ${user ? '' : 'blur'}` }>
        <div className="all-chats">
          <NewChat onClick={getNewChat} user={user}  currentChat={currentChat} setcurrentChat={setcurrentChat}/>

          <div className="previous-chats">

            {chatLoading && 
              <div>
                Loading your chats! Please be patient
                (The first time takes upto 50 seconds)
              </div>}
            {chatTitles.map((chat, index) => 
              <ChatTitle chat={chat} key={index} currentChat={currentChat} setcurrentChat={setcurrentChat}/>
            )}
            
          </div>
        </div>
        <div className="chat-screen">
          <div className="current-conversation">
            <Header user={user}/>
            
            <div ref={convo} className={`conversation ${currentChat.length ? 'active-chat': ''}` }>
              {conversations.map((conversation, index) => {
                if (conversation.author == 'user')
                  return <Human data={conversation.message} key={index}/>
                else
                  return <AI data={formatAnswer(conversation.message)} key={index}/>
              })}

            </div>
          </div>

          <div className="prompt-wrapper">
              <Input user={user} currentChat={currentChat} query={query} loading={loading} setloading={setloading} getNewChat={getNewChat} />
          </div>
        </div>

      </div>
        {!user &&
        <SignIn />
        }
      </>
  )
}

export default App
