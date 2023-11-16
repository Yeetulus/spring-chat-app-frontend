import React, { useState } from 'react';

const DemoMessageSender: React.FC = () => {
    const [message, setMessage] = useState<string>('');

    const handleSend = async () => {
        if (message.trim() !== '') {
            const chatMessage = {
                type: 'Text',
                content: message,
                sender: 'Your Sender Name',
            };

            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch("http://localhost:8080/api/chat/send", {
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
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default DemoMessageSender;