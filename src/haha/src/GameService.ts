import { Game } from './Models/models';

const BASE_URL = 'https://localhost:8080/games';

export const fetchGames = async (): Promise<Game[]> => {
  const response = await fetch(`${BASE_URL}`);
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }

  const games: Game[] = await response.json();

  return games || [];
};

export const createGame = async (name: string, description: string, teamId: string): Promise<void> => {
  const gameData = {
    name,
    description,
    teamId
  };

  console.log('game created, name:', name); // Log the response
  console.log('json:', JSON.stringify(gameData)); // Log the response

  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const joinGame = async (gameId: string, teamId: string): Promise<void> => {
  const gameData = {
    gameId,
    teamId,
  };

  console.log('game joined, gameId:', gameId); // Log the response
  console.log('json:', JSON.stringify(gameData)); // Log the response

  const response = await fetch(`${BASE_URL}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const deleteTeam = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete team with ID: ${id}, status: ${response.status}`);
  }

  console.log(`Team with ID: ${id} was successfully deleted.`);
};
