import React, { useEffect, useState } from 'react';
import { takeNewChallenge, getChallenge } from '../../services/GameService'; // Adjust the import path as needed
import { ChallengeResponse } from '../../Models/models';

interface TeamChallengeProps {
  gameSessionId?: string;
  teamId?: string;
  challengeId?: string; // Add the challengeId prop
}

const TeamChallenge: React.FC<TeamChallengeProps> = ({ gameSessionId, teamId, challengeId }) => {
  const defaultLocation = { type: 'Point', coordinates: [15.567535, 35.5656356] }; // Default location
  const deviceId = 'dacoolheaderdeviceid'; // Replace with actual deviceId
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null);

  const handleGetNewChallenge = async () => {
    try {
      const location = defaultLocation; // Use default location for now
      if (gameSessionId && teamId) {
        const gameSession = await takeNewChallenge(gameSessionId, teamId, location);
        setChallenge(await getChallenge("lcc001", gameSession.team1?.activeChallengeId!));
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
          console.log('Fetching challenge details for challenge ID:', challengeId); // Log trigger
          const challengeDetails: ChallengeResponse = await getChallenge("lcc001", challengeId);
          setChallenge(challengeDetails);
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
      {challenge ? (
        <div>
          <p>Challenge ID: {challenge.challengeId}</p>
          <p>Title: {challenge.title}</p>
          <p>Description: {challenge.description}</p>
          <p>Points: {challenge.points}</p>
          <p>Failure Time: {challenge.failureTime}</p>
          <p>Probability of Succeeding: {challenge.probabilitySucceeding}</p>
          <p>Expected Duration: {challenge.expectedDuration}</p>
          <p>Area ID: {challenge.areaId}</p>
          <p>Required Players: {challenge.requiredPlayers}</p>
          <p>Estimated Cost: {challenge.estimatedCostInLocalCurrency}</p>
          <p>Ranking Points: {challenge.rankingPoints}</p>
          {/* Add more challenge details as needed */}
        </div>
      ) : (
        <p>No active challenge</p>
      )}
    </div>
  );
}

export default TeamChallenge;
