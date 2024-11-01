import React, { useEffect, useState } from 'react';
import { getGameStatus } from '../../services/GameService';
import { TeamResponse, GameSessionResponse } from '../../Models/models';

interface TeamStatusProps {
  gameSessionId?: string;
  teamId?: string;
  setChallengeId: React.Dispatch<React.SetStateAction<string | undefined>>; // Add this prop
}

const TeamStatus: React.FC<TeamStatusProps> = ({ gameSessionId, teamId, setChallengeId }) => {
  const [teamResponse, setTeamResponse] = useState<TeamResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamStatus = async () => {
      try {
        if (!gameSessionId || !teamId) return;
        const gameStatus: GameSessionResponse = await getGameStatus(gameSessionId);
        const team = gameStatus.team1?.id === teamId ? gameStatus.team1 : gameStatus.team2;
        setTeamResponse(team || null);
        if (team?.activeChallengeId) {
          setChallengeId(team.activeChallengeId); // Set the challenge ID
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchTeamStatus();
  }, [gameSessionId, teamId, setChallengeId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!teamResponse) {
    return <p>Loading team status...</p>;
  }

  return (
    <div>
      <h2>Team Status</h2>
      <p>Game Session ID: {gameSessionId}</p>
      <p>Team ID: {teamId}</p>
      <p>Team Name: {teamResponse.teamName}</p>
      <p>Team Score: {teamResponse.teamScore}</p>
      <p>Team Captain Selected: {teamResponse.captainSelected ? 'Yes' : 'No'}</p>
      <p>Team Captain ID: {teamResponse.captainId}</p>
      <p>Team Location: {teamResponse.location ? `(${teamResponse.location.coordinates[0]}, ${teamResponse.location.coordinates[1]})` : 'N/A'}</p>
      <p>Team Is Ready To Start: {teamResponse.teamIsReadyToStart ? 'Yes' : 'No'}</p>
      <p>Wants To Pause: {teamResponse.wantsToPause ? 'Yes' : 'No'}</p>
      <p>Pause Length: {teamResponse.pauseLength} minutes</p>
      <p>Completed Challenges: {teamResponse.completedChallenges?.join(', ') || 'None'}</p>
      <p>Team Color: {teamResponse.teamColor}</p>
      <p>Points: {teamResponse.points}</p>
      <p>Active Participants: {teamResponse.activeParticipants}</p>
      <p>Team Can Travel: {teamResponse.teamCanTravel ? 'Yes' : 'No'}</p>
      <p>Active Challenge ID: {teamResponse.activeChallengeId}</p>
      <p>Team Budget: {teamResponse.teamBudget}</p>
    </div>
  );
}

export default TeamStatus;
