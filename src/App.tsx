import React, {useEffect, useState} from 'react';
import './App.css';
import {CompatClient, Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {cleanup} from "@testing-library/react";

const App: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [testingMessage, setTestingMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [stompClient, setStompClient] = useState<CompatClient|any>(null);

  useEffect(() => {
    initializeWebSocket();
  }, []);

  const initializeWebSocket = () => {

    if(stompClient && stompClient.connected) return;

    console.log('Attempting to connect to WebSocket');
    let token = localStorage.getItem("access_token");
    if (!token) {
      console.log("No token found");
      return;
    }

    const headers = {
      "Authorization" : `Bearer ${token}`,
      "Access-Control-Allow-Origin" : "*",
    };
    let socket = new SockJS(`http://localhost:8080/chat-app`);
    const client = Stomp.over(function(){
      return socket;
    })

    client.connect(headers, () =>{
      client.subscribe("/topic/rabbitmqchat", (message) =>{
        console.log('Received message:', message.body);
      });
    });
    setStompClient(client);

  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        console.log(data);
        initializeWebSocket();
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSend = () => {
    if (stompClient) {
      stompClient.publish({ destination: '/chat/sendMessage', body: JSON.stringify({ content: message }) });
    } else {
      console.log('STOMP client is not connected');
    }
  };

  const handleTestingSend = async () => {
    try {
      const chatMessage = {
        type: 'Message',
        content: testingMessage,
        sender: 'Jan Novák',
      };

      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8080/api/chat/testMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: chatMessage }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
      } else {
        console.error('Request failed:', response.statusText);
      }
    } catch (error) {
      console.error('Request error:', error);
    }
  };

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: regEmail,
          password: regPassword
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
      } else {
        console.error('Registration failed:', response.statusText);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
      <div>
        <h1>Register</h1>
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input type="text" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
        <hr />

        <h1>Login</h1>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <hr />
        <input type="text" placeholder="RabbitMQ Message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={handleSend}>Send Message</button>

        <input type="text" placeholder="Testing Message" value={testingMessage} onChange={(e) => setTestingMessage(e.target.value)} />
        <button onClick={handleTestingSend}>Send Message</button>

        <div>
          <h2>Received Messages:</h2>
          <ul>
            {messages.map((msg, index) => (
                <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default App;

