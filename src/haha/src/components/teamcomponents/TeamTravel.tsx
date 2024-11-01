import React from 'react';

interface TeamTravelProps {
  gameSessionId?: string;
  teamId?: string;
}

const TeamTravel: React.FC<TeamTravelProps> = ({ gameSessionId, teamId }) => {
  return (
    <div>
      <h2>Team Travel</h2>
      <p>Game Session ID: {gameSessionId}</p>
      <p>Team ID: {teamId}</p>
      {/* Add functionality for team travel here */}
    </div>
  );
}

export default TeamTravel;
