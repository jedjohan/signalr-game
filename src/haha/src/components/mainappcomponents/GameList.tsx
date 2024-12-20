import React, { useState, useEffect } from 'react';
import { fetchGames } from '../../services/GameService';
import { GameSessionResponse } from '../../Models/models';

interface GameListProps {
  refresh: boolean;
  onGameSelected: (game: GameSessionResponse) => void;
}

const copyToClipboard = (gameSessionId?: string, event?: React.MouseEvent) => {
  if (event) {
    event.stopPropagation(); // Prevent event propagation
  }
  if (gameSessionId) {
    navigator.clipboard.writeText(gameSessionId)
      .then(() => {
        console.log(`Copied Game Session ID: ${gameSessionId}`);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  }
};

function GameList({ refresh, onGameSelected }: GameListProps) {
  const [games, setGames] = useState<GameSessionResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getGames = async () => {
      try {
        const gameList = await fetchGames();
        setGames(gameList);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getGames();
  }, [refresh]);

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Games List</h2>
      {games.length === 0 ? (
        <p>No games available</p>
      ) : (
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <ul>
            {games.map((gameSession) => (
              <li key={gameSession.id} onClick={() => onGameSelected(gameSession)}>
                <br />
                <em>Game session Id:</em> {gameSession.id ?? 'N/A'}
                <br />
                <em>Map: </em> {gameSession.mapId ?? 'N/A'}
                <br />
                <button onClick={(event) => copyToClipboard(gameSession.id, event)}>Copy Game Session ID</button>
                <br />
                {gameSession.team1 && (
                  <div>
                    <strong>Team 1:</strong> {gameSession.team1.id}
                  </div>
                )}
                {gameSession.team2 && (
                  <div>
                    <strong>Team 2:</strong> {gameSession.team2.id}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GameList;
