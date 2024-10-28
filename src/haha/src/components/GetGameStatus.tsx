import React, { useState } from 'react';
import { getGameStatus } from '../services/GameService';
import { GameSessionResponse } from '../Models/models';

const GetGameStatus: React.FC = () => {
  const [newGameSessionId, setNewGameSessionId] = useState<string>('');
  const [gameSession, setGameSession] = useState<GameSessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetGameStatus = async () => {
    try {
      const gameSession: GameSessionResponse = await getGameStatus(newGameSessionId);
      console.log('Getting game status for session:', gameSession);
      setGameSession(gameSession); // Update state with the fetched game session
    } catch (error: any) {
      setError(error.message);
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
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {gameSession && (
        <div>
          <h4>Game Details</h4>
          <p>ID: {gameSession.id}</p>
          <p>Map ID: {gameSession.mapId}</p>
          <p>Game Length: {gameSession.gameLength}</p>
          <p>Game Status: {gameSession.sessionStatus.toString()}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default GetGameStatus;
