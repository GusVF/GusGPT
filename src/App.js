/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('');
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  }

    const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options);
      if (!response.ok) {
        console.log(`HTTP error! Status: ${response.status}`)
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
      const data = await response.json();
      setMessage(data.choices[0].message)

    } catch (error) {
      console.error(error, 'this is an error in app.js');
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    getMessages();
  }

  useEffect(() => {
    if (!currentTitle && message && value) {
      setCurrentTitle(value);
    }
    if (currentTitle && message && value) {
      setPreviousChats(prevChats => (
        [...prevChats,
        {
          title: currentTitle,
          role: 'user',
          content: value
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content
        }
        ]
      ))
      setValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, currentTitle])

  useEffect(() => {
    const storedChats = localStorage.getItem('chatKey');
    if(storedChats && storedChats.length > 0) {
      setPreviousChats(JSON.parse(storedChats))
    } else {
      setPreviousChats([])
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatKey', JSON.stringify(previousChats));
  }, [previousChats]);

  const currentChat = previousChats.filter((previousChat) => previousChat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)));

  const deleteChat = (e, chatTitle) => {
    e.stopPropagation();
    const filteredChat = previousChats.filter((chat) => chat.title !== chatTitle);
    setPreviousChats(filteredChat);

    localStorage.setItem('chatKey', JSON.stringify(filteredChat));

    if(currentTitle === chatTitle) {
      setCurrentTitle(null)
    }
  }

  const truncate = (str, number) => {
    if(str.length <= number) {
      return str;
    }
    return str.slice(0, number) + '...';
  }

  return (
    <div className="app">
      <section className="side-bar">
        <button
          data-testid="newChatButton"
          onClick={createNewChat}
        >
          + New chat
        </button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => 
            <li 
            data-testid="chat-history"
            className="chat-history"
            key={index}
            onClick={() => handleClick(uniqueTitle)}
            >
              {truncate(uniqueTitle, 10)}
              <div 
              className="trash-can"
              >
                <FontAwesomeIcon icon={faTrashAlt} 
                onClick={(e) => deleteChat(e, uniqueTitle)}
                data-testid={`trash-can-${index}`}
                />
              </div>
            </li>
          )}
        </ul>
        <nav className="navbar">
          <p>Made by Gus Ferreira</p>
        </nav>
      </section>
      <section className="main">
        <h1 className="header">GusGPT</h1>
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li
           key={index}
           data-testid="content"
          >
            <p className="role">{chatMessage.role + " :"}</p>
            <p>{chatMessage.content}</p>
          </li>
          )}
        </ul>
        <div className="bottom-section">
          <form className="input-container" onSubmit={handleFormSubmit}>
            <input
              className="input"
              placeholder="send message"
              value={value} onChange={(e) => setValue(e.target.value)}
            />
            <div id="submit"
            data-testid="submit"
            onClick={handleFormSubmit}>➢</div>
          </form>
          <p className="info" data-testid="footer">
            Your feedback will help us improve.
            This application uses OpenAI's API and it is meant for learning purposes only. You need an OpenAI API key to make this application work.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
