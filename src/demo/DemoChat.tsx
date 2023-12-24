import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import {DemoChatMessage, DemoChatObject} from './DemoMessageSender';
import {BACKEND_URL} from "../constants/contants";

const DemoChat: React.FC = () => {
    const [stompClient, setStompClient] = useState<CompatClient | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
    const [chats, setChats] = useState<DemoChatObject[]>([]);
    const [chatMessages, setChatMessages] = useState<{ [key: string]: DemoChatMessage[] }>({});

    useEffect(() => {

        const token = localStorage.getItem('access_token');
        if (!token) {
            console.log('No access token found');
            return;
        }

        const initializeWebSocket = async () => {
            try {
                const response = await fetch(BACKEND_URL + '/api/chat/exchanges', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Chats from user: ', data);
                    setChats(data);
                    connectWebSocket(token, data);
                } else {
                    console.error('Failed to fetch chats:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching queues:', error);
            }
        };

        initializeWebSocket();

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, []);

    const connectWebSocket = (token: string, data: DemoChatObject[]) => {
        const client = Stomp.over(() => new SockJS(BACKEND_URL + '/ws-message'));
        client.configure({
            reconnectDelay: 10000,
        });

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        client.connect(headers, () => {
            console.log('Connected to WebSocket');
            setStompClient(client);
            setConnectionStatus('Connected');
            subscribeToMessages(client, data);
        });

        client.onWebSocketClose(() => {
            setStompClient(null);
            console.log('Disconnected from WebSocket');
            setConnectionStatus('Disconnected');
        });
    };

    const subscribeToMessages = (client: CompatClient, data: DemoChatObject[]) => {
        console.log('Subscribing');
        data.forEach((chat) => {
            chat.queues.forEach((queue) => {
                client.subscribe(`/chat/${queue}`, (message) => {
                    console.log(message);
                    try {
                        const body: DemoChatMessage = JSON.parse(message.body);
                        console.log('Received message: ' + body);

                        setChatMessages((prevChatMessages) => {
                            const chatKey = chat.chat.exchange;
                            const messages = prevChatMessages[chatKey] || [];
                            return {
                                ...prevChatMessages,
                                [chatKey]: [...messages, body],
                            };
                        });
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });
            });
        });
    };

    return (
        <div>
            <h1>WebSocket Example</h1>
            <p>WebSocket connection status: {connectionStatus}</p>
            <h2>Received Messages:</h2>
            {chats.map((chat) => (
                <div key={chat.chat.exchange}>
                    <h2>Chat: {chat.chat.chatName}</h2>
                    <ul>
                        {(chatMessages[chat.chat.exchange] || []).map((msg, index) => (
                            <div key={index}>
                                <span>{chat.chat.userQueues.find(uq => uq.user.id === msg.senderId)?.user.firstName}</span>
                                <li>{msg.content}</li>
                            </div>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default DemoChat;
