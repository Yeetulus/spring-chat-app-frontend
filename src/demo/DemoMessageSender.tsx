import React, {useEffect, useState} from 'react';
import {BACKEND_URL} from "../constants/contants";

export interface DemoChatRoom {
    id: number;
    exchange: string;
    chatName: string;
    owner: DemoUser;
    userQueues: DemoUsers[];
}
export interface DemoChatObject {
    chat: DemoChatRoom;
    queues: string[];
}
export interface DemoUser{
    id: number,
    email: string,
    firstName: string,
    lastName: string
}
export interface DemoUsers {
    id: number;
    user: DemoUser;
    queue: string;
}

const DemoMessageSender: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [chats, setChats] = useState<DemoChatObject[]>();
    const [selectedChat, setSelectedChat] = useState<DemoChatObject | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            console.log('No access token found');
            return;
        }

        const fetchChats = async () => {
            try {
                const response = await fetch(BACKEND_URL + '/api/chat/exchanges', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Chats from user:', data);
                    setChats(data);

                    if (data.length > 0) {
                        setSelectedChat(data[0]);
                    }
                } else {
                    console.error('Failed to fetch chats:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching queues:', error);
            }
        };

        fetchChats();
    }, []);


    const handleSend = async () => {
        if (message.trim() !== '') {

            const chatMessage = {
                type: 'Text',
                chatId: selectedChat?.chat.id,
                content: message,
                senderId: selectedChat?.chat.owner.id
            };

            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(BACKEND_URL + "/api/chat/send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(chatMessage),
                });

                if (response.ok) {
                    console.log('Message sent successfully');
                } else {
                    console.error('Message sending failed:', response.statusText);
                }
            } catch (error) {
                console.error('Message sending error:', error);
            }

            setMessage('');
        }
    };



    return (
        <div>
            <h2>Send a Message</h2>
            <div>
                <label>Select Chat:</label>
                <select
                    value={selectedChat ? selectedChat.chat.id: ''}
                    onChange={(e) => {
                        const selectedId = parseInt(e.target.value);
                        const selected = chats?.find((chat) => chat.chat.id === selectedId);
                        setSelectedChat(selected || null);
                    }} >
                    {chats?.map((chat) => (
                        <option key={chat.chat.id} value={chat.chat.id}>
                            {chat.chat.chatName}
                        </option>
                    ))}
                </select>
            </div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default DemoMessageSender;