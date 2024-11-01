import React, { useState } from 'react';
import { getGameStatus } from '../../services/GameService';
import { GameSessionResponse } from '../../Models/models';

interface GetGameStatusProps {
  onGameStatusReceived: (game: GameSessionResponse) => void;
}

const GetGameStatus: React.FC<GetGameStatusProps> = ({ onGameStatusReceived }) => {
  const [newGameSessionId, setNewGameSessionId] = useState<string>('');

  const handleGetGameStatus = async () => {
    try {
      const gameSession = await getGameStatus(newGameSessionId);
      onGameStatusReceived(gameSession);
    } catch (error) {
      console.error('Error fetching game status:', error);
    }
  };

  return (
    <div>
      <h3>Get Game Status</h3>
      <input
        type="text"
        placeholder="Your Game Session ID"
        value={newGameSessionId}
        onChange={(e) => setNewGameSessionId(e.target.value)}
      />
      <button onClick={handleGetGameStatus}>Get Game Status</button>
    </div>
  );
};

export default GetGameStatus;
