import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';

const DemoChat: React.FC = () => {
    const [stompClient, setStompClient] = useState<CompatClient | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');

    useEffect(() => {
        const initializeWebSocket = () => {
            if (stompClient && stompClient.connected) return;

            const token = localStorage.getItem("access_token");

            if (!token) {
                console.log("No access token found");
                return;
            }

            const socket = new SockJS('http://localhost:8080/ws-message');
            const client = Stomp.over(socket);

            const headers = {
                "Authorization": `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
            };

            client.connect(headers, () => {
                console.log('Connected to WebSocket');
                setStompClient(client);
                setConnectionStatus('Connected');
                subscribeToMessages(client);
            });

            client.onWebSocketClose(() => {
                console.log('Disconnected from WebSocket');
                setConnectionStatus('Disconnected');
            });

            return () => {
                if (stompClient) {
                    stompClient.disconnect();
                }
            };
        };

        const intervalId = setInterval(() => {
            if (!stompClient || !stompClient.connected) {
                initializeWebSocket();
            }
        }, 5000);

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
            clearInterval(intervalId);
        };
    }, [stompClient]);

    const subscribeToMessages = (client: CompatClient) => {
        client.subscribe('/topic/message', (message) => {
            try {
                const body = message.body;
                console.log(body);
                const receivedMessage = JSON.parse(body);
                setMessages((prevMessages) => [...prevMessages, body.slice(1, -1)]);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });
    };

    return (
        <div>
            <h1>WebSocket Example</h1>
            <p>WebSocket connection status: {connectionStatus}</p>
            <h2>Received Messages:</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default DemoChat;
