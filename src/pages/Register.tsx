import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useContext, useState} from "react";
import {AuthContext} from "../auth/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {BACKEND_URL} from "../constants/contants";

const Register: React.FC = () => {
    const {authenticated, setAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch(BACKEND_URL + '/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password, firstName, lastName}),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            setAuthenticated(true);
            navigate("/");
        } else {
            console.log(response);
        }
        console.log("Authenticated: " + authenticated);
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="mb-4">Register</h2>
                    <Form onSubmit={handleRegister}>
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

                        <Form.Group controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
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

                        <div className={"mt-2"} >
                            <Link to={"/login"}>
                                Already registered? log in!
                            </Link>
                        </div>

                        <div className={"mt-3"}>
                            <Button variant="primary" type="submit" className="mr-2">
                                Register
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;