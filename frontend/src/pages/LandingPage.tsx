import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LiveMap from '../components/LiveMap';

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AuthContainer = styled(Paper)`
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled(Typography)`
  text-align: center;
  margin-bottom: 2rem;
  color: #1a237e;
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    console.log('Form submitted:', { email, password });
    // For now, just navigate to the choice screen
    navigate('/choice');
  };

  return (
    <PageContainer>
      <LiveMap />
      <AuthContainer elevation={3}>
        <Title variant="h4">
          {isLogin ? 'Welcome Back!' : 'Call Shotgun!'}
        </Title>
        <Form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            {isLogin ? 'Login' : 'Get Started'}
          </Button>
          <Button
            onClick={() => setIsLogin(!isLogin)}
            color="secondary"
            fullWidth
          >
            {isLogin ? 'New to Call Shotgun? Sign Up' : 'Already have an account? Login'}
          </Button>
        </Form>
      </AuthContainer>
    </PageContainer>
  );
};

export default LandingPage; 