import { useState, useEffect, useRef } from 'react';
import type { FormEventHandler, ChangeEvent } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

type Message = {
  value: string;
  id: string;
};

function App() {
  const [value, setValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messageBox = useRef<HTMLDivElement>(null);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (value) {
      socket.emit('chat message', { id: socket.id, value });
      setValue('');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    socket.on('chat message', (msg) => {
      const { id, value } = msg;
      setMessages((prev) => [...prev, { id, value }]);
    });
  }, []);

  useEffect(() => {
    const elem = messageBox.current;
    if (elem) {
      elem.scrollTo({ top: elem.scrollHeight });
    }
  }, [messageBox, messages]);

  return (
    <div className="App">
      <div id="container">
        <h1>{`${socket.id}`} is here</h1>
        <div ref={messageBox} className="message_container">
          {messages.map(({ id, value }, i) => {
            if (id === socket.id)
              return (
                <div key={`${id}_${value}_${Date.now()}_${i}`} className="my msg">
                  {value}
                </div>
              );
            return (
              <div key={`${id}_${value}_${Date.now()}_${i}`} className="other msg">
                {value}
              </div>
            );
          })}
        </div>
        <form id="form" action="" onSubmit={handleSubmit}>
          <input id="input" onChange={handleInputChange} value={value} aria-autocomplete="none" />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
