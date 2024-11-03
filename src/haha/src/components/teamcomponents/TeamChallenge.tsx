import React, { useEffect, useState } from 'react';
import { takeNewChallenge, getChallenge, takeNewChallengeAsCaptain, reportChallengeAsCaptain } from '../../services/ChallengeService'; // Adjust the import path as needed
import { ChallengeResponse } from '../../Models/models';

interface TeamChallengeProps {
  gameSessionId?: string;
  teamId?: string;
  challengeId?: string; // Add the challengeId prop
  teamCaptainId?: string;
}

const TeamChallenge: React.FC<TeamChallengeProps> = ({ gameSessionId, teamId, challengeId, teamCaptainId }) => {
  const defaultLocation = { type: 'Point', coordinates: [15.567535, 35.5656356] }; // Default location
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null);

  const handleGetNewChallenge = async () => {
    try {
      const location = defaultLocation; // Use default location for now
      if (gameSessionId && teamId) {
        const gameSession = await takeNewChallenge(gameSessionId, teamId, location);
        const mapId = gameSession.team1?.activeChallengeId!.split('-')[0];
        setChallenge(await getChallenge(mapId!, gameSession.team1?.activeChallengeId!));
      }
      console.log('New challenge requested successfully');
    } catch (error) {
      console.error('Failed to request new challenge:', error);
    }
  };

  const handleGetNewChallengeAsCaptain = async () => {
    try {
      const location = defaultLocation; // Use default location for now
      if (gameSessionId && teamId && teamCaptainId) {
        const gameSession = await takeNewChallengeAsCaptain(gameSessionId, teamId, teamCaptainId, location);
        const mapId = gameSession.team1?.activeChallengeId!.split('-')[0];
        setChallenge(await getChallenge(mapId!, gameSession.team1?.activeChallengeId!));
      }
      console.log('New challenge requested successfully');
    } catch (error) {
      console.error('Failed to request new challenge:', error);
    }
  };

  const handleChallengeOutcome = async () => {
    try {
      if (gameSessionId && teamId && teamCaptainId && challengeId) {
        const gameSession = await reportChallengeAsCaptain(gameSessionId, teamId, teamCaptainId, challengeId, true);
        console.log("game session below updated");
        console.log(gameSession);
      }
      // call endpoint
      // update team information such as points, team can travel and in case locked end time needs a change
      // event listener should update game with interesting update
    } catch (error) {
        
    }
  }

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        if (challengeId) {
          console.log('Fetching challenge details for challenge ID:', challengeId); // Log trigger
          const challengeDetails: ChallengeResponse = await getChallenge(challengeId.split('-')[0], challengeId);
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
      <button onClick={handleGetNewChallengeAsCaptain}>Get New Challenge with forced captainId</button>
      <button onClick={handleChallengeOutcome}> Report challenge results as forced captain</button>
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
