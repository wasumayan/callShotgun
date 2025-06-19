import React from 'react';
import styled from 'styled-components';
import { Button, Typography } from '@mui/material';
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

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
`;

const Title = styled(Typography)`
  color: white;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
`;

const ChoiceButton = styled(Button)`
  flex: 1;
  height: 200px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.95);
  }
`;

const ChoiceScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <LiveMap />
      <ContentContainer>
        <Title variant="h3">
          What would you like to do?
        </Title>
        <ButtonContainer>
          <ChoiceButton
            variant="contained"
            color="primary"
            onClick={() => navigate('/plan-trip')}
          >
            <Typography variant="h6">I'm Planning a Trip</Typography>
            <Typography variant="body2" color="text.secondary">
              Find travel buddies and plan your next adventure
            </Typography>
          </ChoiceButton>
          <ChoiceButton
            variant="contained"
            color="secondary"
            onClick={() => navigate('/local-meetups')}
          >
            <Typography variant="h6">I'm Already Here</Typography>
            <Typography variant="body2" color="text.secondary">
              Join local meetups or create your own
            </Typography>
          </ChoiceButton>
        </ButtonContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default ChoiceScreen; 