import React from 'react';
import { useParams } from 'react-router-dom';
import TeamStatus from './TeamStatus'; // Ensure you create this component
import TeamChallenge from './TeamChallenge'; // Ensure you create this component
import TeamTravel from './TeamTravel'; 
import './TeamApp.css'; 

const TeamApp: React.FC = () => {
  const { gameSessionId, teamId } = useParams<{ gameSessionId: string; teamId: string }>();

  return (
    <div className="team-app">
      <div className="left-column">
        <TeamStatus gameSessionId={gameSessionId} teamId={teamId} />
      </div>
      <div className="center-column">
        <TeamChallenge gameSessionId={gameSessionId} teamId={teamId} />
      </div>
      <div className="right-column">
        <TeamTravel gameSessionId={gameSessionId} teamId={teamId} />
      </div>
    </div>
  );
}

export default TeamApp;
