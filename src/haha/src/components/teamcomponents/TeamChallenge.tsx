import React from 'react';

interface TeamChallengeProps {
  gameSessionId?: string;
  teamId?: string;
}

const TeamChallenge: React.FC<TeamChallengeProps> = ({ gameSessionId, teamId }) => {
  return (
    <div>
      <h2>Team Challenge</h2>
      <p>Game Session ID: {gameSessionId}</p>
      <p>Team ID: {teamId}</p>
      {/* Add functionality for team challenges here */}
    </div>
  );
}

export default TeamChallenge;
