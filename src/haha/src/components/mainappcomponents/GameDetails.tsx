import React from 'react';
import { GameSessionResponse, sessionStatusMapping } from '../../Models/models';
import { joinTeamWithId } from '../../services/GameService';
import { useNavigate } from 'react-router-dom';

interface GameDetailsProps {
  selectedGame: GameSessionResponse;
  handleJoinTeam: (teamId: string) => void;
}

const GameDetails: React.FC<GameDetailsProps> = ({ selectedGame, handleJoinTeam }) => {
  const navigate = useNavigate();

  const handleJoinTeamClick = async (teamId: string | undefined, teamName?: string) => {
    if (!teamId || !teamName || !selectedGame.id) return;
    await joinTeamWithId(selectedGame.id, teamId);
    handleJoinTeam(teamId);
    navigate(`/games/${selectedGame.id}/team/${teamId}`);
  };

  return (
    <div>
      <h4>Game Details</h4>
      <p>ID: {selectedGame.id}</p>
      <p>Game status: {sessionStatusMapping[selectedGame.sessionStatus]}</p>
      <p>Map ID: {selectedGame.mapId}</p>
      <p>Game Length: {selectedGame.gameLength}</p>
      <p>Game score: {selectedGame.team1?.teamScore} - {selectedGame.team2?.teamScore}</p>
      {selectedGame.team1 && selectedGame.team1.id && selectedGame.team1.teamName && (
        <button onClick={() => handleJoinTeamClick(selectedGame.team1!.id, selectedGame.team1!.teamName)}>
          Join {selectedGame.team1.teamName}
        </button>
      )}
      {selectedGame.team2 && selectedGame.team2.id && selectedGame.team2.teamName && (
        <button onClick={() => handleJoinTeamClick(selectedGame.team2!.id, selectedGame.team2!.teamName)}>
          Join {selectedGame.team2.teamName}
        </button>
      )}
    </div>
  );
}

export default GameDetails;
