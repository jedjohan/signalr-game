import React from 'react';

interface TeamTravelProps {
  gameSessionId?: string;
  teamId?: string;
}

const TeamTravel: React.FC<TeamTravelProps> = ({ gameSessionId, teamId }) => {

  const handleTeamTravel = async () => {
    try {
      // we need to have saved the ways of travel so we easy can give the options
      // select number of stations or minutes depending on travel type
      // make sure it is captain, we might manipulate this in the beginning - captaincy has special choices
    } catch (error) {
      console.error('Failed to request new challenge:', error);
    }
  };

  return (
    <div>
      <h2>Team Travel</h2>
      <button onClick={handleTeamTravel}> Report new travel</button>
      <p>Game Session ID: {gameSessionId}</p>
      <p>Team ID: {teamId}</p>
      {/* Add functionality for team travel here */}
    </div>
  );
}

export default TeamTravel;
