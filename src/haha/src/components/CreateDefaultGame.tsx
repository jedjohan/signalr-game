import React, { useState } from 'react';
import { createDefaultGame } from '../services/GameService';

interface CreateDefaultGameProps {
  setRefreshGames: (value: boolean) => void;
}

const CreateDefaultGame: React.FC<CreateDefaultGameProps> = ({ setRefreshGames }) => {
  const [error, setError] = useState<string | null>(null);

  const handleCreateDefaultGame = async () => {
    setError(null);
    try {
      await createDefaultGame();
      setRefreshGames(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <button onClick={handleCreateDefaultGame}>Create Default Game</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default CreateDefaultGame;
