import React, { useState } from 'react';

const DemoLogin: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const baseUrl = "http://localhost:8080"

    const handleLogin = async () => {
        try {
            const response = await fetch(baseUrl + '/api/auth/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.body.access_token);
                localStorage.setItem('refresh_token', data.body.refresh_token);
                console.log(response.body);
            } else {
                console.log(response.body);
            }
        } catch (error) {
            console.log('An error occurred during login.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <div>
                <label>Email:</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default DemoLogin;