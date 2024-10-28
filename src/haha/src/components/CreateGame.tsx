import React, { useState } from 'react';
import { createGame } from '../services/GameService';

interface CreateGameProps {
  setRefreshGames: (value: boolean) => void;
}

const CreateGame: React.FC<CreateGameProps> = ({ setRefreshGames }) => {
  const [newGameLength, setNewGameLength] = useState<number>(0);
  const [newMapId, setNewMapId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateGame = async () => {
    setError(null);
    try {
      await createGame(newMapId, newGameLength);
      setRefreshGames(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h3>Create Game</h3>
      <input
        type="text"
        placeholder="Your Map ID"
        value={newMapId}
        onChange={(e) => setNewMapId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Game Length"
        value={newGameLength}
        onChange={(e) => setNewGameLength(Number(e.target.value))}
        style={{ color: newGameLength ? 'black' : 'gray' }}
      />
      <button onClick={handleCreateGame}>Create Game</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default CreateGame;
