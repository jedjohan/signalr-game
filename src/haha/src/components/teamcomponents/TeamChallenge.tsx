import React, { useEffect, useState } from 'react';
import { takeNewChallenge } from '../../services/GameService'; // Adjust the import path as needed

interface TeamChallengeProps {
  gameSessionId?: string;
  teamId?: string;
  challengeId?: string; // Add the challengeId prop
}

const TeamChallenge: React.FC<TeamChallengeProps> = ({ gameSessionId, teamId, challengeId }) => {
  const defaultLocation = { type: 'Point', coordinates: [15.567535, 35.5656356] }; // Default location
  const deviceId = 'dacoolheaderdeviceid'; // Replace with actual deviceId
  const [challengeDetails, setChallengeDetails] = useState<any | null>(null);

  const handleGetNewChallenge = async () => {
    try {
      const location = defaultLocation; // Use default location for now
      if (gameSessionId && teamId) {
        await takeNewChallenge(gameSessionId, teamId, deviceId, location);
      }
      console.log('New challenge requested successfully');
    } catch (error) {
      console.error('Failed to request new challenge:', error);
    }
  };

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        if (challengeId) {
          const details = {
            id: challengeId,
            description: "Solve the puzzle at the marked location.",
            difficulty: "Medium",
            reward: 100,
          }; // Default object for now
          setChallengeDetails(details);
        }
      } catch (error) {
        console.error('Failed to fetch challenge details:', error);
      }
    };

    fetchChallengeDetails();
  }, [challengeId]);

  return (
    <div>
      <h2>Team Challenge</h2>
      <button onClick={handleGetNewChallenge}>Get New Challenge</button>
      <h3>Current challenge</h3>
      <p>Game Session ID: {gameSessionId}</p>
      <p>Team ID: {teamId}</p>
      {challengeDetails ? (
        <div>
          <p>Challenge ID: {challengeDetails.id}</p>
          <p>Description: {challengeDetails.description}</p>
          <p>Difficulty: {challengeDetails.difficulty}</p>
          <p>Reward: {challengeDetails.reward}</p>
          {/* Add more challenge details as needed */}
        </div>
      ) : (
        <p>No active challenge</p>
      )}
    </div>
  );
}

export default TeamChallenge;
