import React, { useState, useEffect } from 'react';
import { fetchGames } from './GameService';
import { Game } from './Models/models';

interface GameListProps {
  refresh: boolean; // Accept refresh prop to trigger re-fetch
}

function GameList({ refresh }: GameListProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

// Function to copy team ID to clipboard
const copyToClipboard = (gameId: string) => {
  navigator.clipboard.writeText(gameId)
    .then(() => {
      console.log(`Copied Game ID: ${gameId}`);
    })
    .catch((err) => {
      console.error('Failed to copy: ', err);
    });
};


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
  }, [refresh]); // Refetch games when `refresh` prop changes

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Games List</h2>
      {games.length === 0 ? (
        <p>No games available</p>
      ) : (
<div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <h2>Games List</h2>
      {games.length === 0 ? (
        <p>No games available</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <strong>{game.name}</strong> - {game.description}
              <br />
              <em>GameId:</em> {game.id} {/* Render the game ID */}
              <br />
              <button onClick={() => copyToClipboard(game.id)}>Copy Game ID</button>
              <br />
              {game.team1 && (
                <div>
                  <strong>Team 1:</strong> {game.team1.name}
                </div>
              )}
              {game.team2 && (
                <div>
                  <strong>Team 2:</strong> {game.team2.name}
                </div>
              )}
              {/* Additional teams can be added here if applicable */}
            </li>
          ))}
        </ul>
      )}
    </div>
      )}
    </div>
  );
}

export default GameList;