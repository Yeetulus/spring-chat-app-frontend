import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../auth/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {BACKEND_URL} from "../constants/contants";
const Login: React.FC = () => {
    const {authenticated, setAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch( '/api/auth/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            setAuthenticated(true);
            console.log("Authenticated: " + authenticated);
            navigate("/");

        } else {
            console.log("Error: " + response);
        }
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="mb-4">Login</h2>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className={"mt-2"}>
                            <Link to="/register">
                                Sign up
                            </Link>
                        </div>
                        <div className={"mt-3"}>
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;