import React from 'react';
import { GameSessionResponse } from '../Models/models';
import { joinTeamWithId } from '../services/GameService'; // Import the service method

interface GameDetailsProps {
  selectedGame: GameSessionResponse;
  handleJoinTeam: (teamId: string) => void; // Update to expect a defined string
}

const GameDetails: React.FC<GameDetailsProps> = ({ selectedGame, handleJoinTeam }) => {
  const handleJoinTeamClick = async (teamId: string | undefined, teamName?: string) => {
    if (!teamId || !teamName || !selectedGame.id) return;
    await joinTeamWithId(selectedGame.id, teamId);
    handleJoinTeam(teamId);
  };

  return (
    <div>
      <h4>Game Details</h4>
      <p>ID: {selectedGame.id}</p>
      <p>Map ID: {selectedGame.mapId}</p>
      <p>Game Length: {selectedGame.gameLength}</p>
      <p>Game Status: {selectedGame.sessionStatus}</p>
      <p>Game score: {selectedGame.team1?.teamScore} - {selectedGame.team2?.teamScore}</p>
      {selectedGame.team1 && selectedGame.team1.teamId && selectedGame.team1.teamName && (
        <button onClick={() => handleJoinTeamClick(selectedGame.team1!.teamId, selectedGame.team1!.teamName)}>
          Join {selectedGame.team1.teamName}
        </button>
      )}
      {selectedGame.team2 && selectedGame.team2.teamId && selectedGame.team2.teamName && (
        <button onClick={() => handleJoinTeamClick(selectedGame.team2!.teamId, selectedGame.team2!.teamName)}>
          Join {selectedGame.team2.teamName}
        </button>
      )}
    </div>
  );
}

export default GameDetails;
