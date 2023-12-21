import React, { useState, useEffect } from 'react';

const DemoChatCreation: React.FC = () => {
    const [chatName, setChatName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [createdChat, setCreatedChat] = useState<any>(null);

    const baseUrl = "http://localhost:8080"
    const handleCreateChat = async () => {
        try {
            const token = localStorage.getItem('access_token');

            if (!token) {
                setError('No access token found');
                return;
            }

            const response = await fetch(baseUrl + `/api/chat/create?chatName=${chatName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCreatedChat(data);
                setError(null);
            } else {
                setError('Chat creation failed.');
            }
        } catch (error) {
            setError('An error occurred during chat creation.');
        }
    };

    useEffect(() => {
        if (createdChat) {
            console.log('Chat created:', createdChat);
        }
    }, [createdChat]);

    return (
        <div>
            <h1>Create Chat</h1>
            <div>
                <label>Chat Name:</label>
                <input type="text" value={chatName} onChange={(e) => setChatName(e.target.value)} />
            </div>
            <button onClick={handleCreateChat}>Create Chat</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default DemoChatCreation;
