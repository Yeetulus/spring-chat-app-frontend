import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import {DemoChatObject} from "./DemoMessageSender";

const DemoChat: React.FC = () => {
    const [stompClient, setStompClient] = useState<CompatClient | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
    const [chats, setChats] = useState<DemoChatObject[]>([]);

    const baseUrl = "http://localhost:8080"

    useEffect(() => {
        const initializeWebSocket = () => {
            if (stompClient && stompClient.connected) return;

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.log("No access token found");
                return;
            }

            const socket = new SockJS(baseUrl+'/ws-message');
            const client = Stomp.over(socket);

            const headers = {
                "Authorization": `Bearer ${token}`
            };

            client.connect(headers, async () => {
                console.log('Connected to WebSocket');
                setStompClient(client);
                setConnectionStatus('Connected');

                const fetchedChats = await fetchChats(token);
                setChats(fetchedChats);

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
        }, 10000);

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
            clearInterval(intervalId);
        };
    }, [stompClient]);

    const subscribeToMessages = (client: CompatClient) => {
        chats.forEach((chat) => {
            console.log(`Subscribing to /${chat.chat.exchange}`)
            chat.queues.forEach((queue) => {
                client.subscribe(`/${chat.chat.exchange}/${queue}`, (message) => {
                    try {
                        const body = message.body;
                        console.log("Received message: " + body);

                        // TODO PLACE MESSAGES INTO THEIR SPECIFIC CHATS
                        setMessages((prevMessages) => [...prevMessages, body.slice(1, -1)]);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });
            })
        });
    };


    const fetchChats = async (token: string | null): Promise<DemoChatObject[]> => {
        try {
            const response = await fetch(baseUrl + '/api/chat/exchanges', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Queues from user: \n" + data.toString());
                return data;
            } else {
                console.error('Failed to fetch queues:', response.statusText);
                return [];
            }
        } catch (error) {
            console.error('Error fetching queues:', error);
            return [];
        }
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
