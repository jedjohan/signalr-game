import { GameSessionResponse } from '../Models/models';

const BASE_URL = 'https://localhost:8080/games';

export const fetchGames = async (): Promise<GameSessionResponse[]> => {
  const response = await fetch(`${BASE_URL}`);
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }

  const games: GameSessionResponse[] = await response.json();

  return games || [];
};

export const createGame = async (mapId: string, gameLength: number): Promise<void> => {
  const gameData = {
    mapId,
    gameLength
  };

  console.log('game created, gameId:', mapId); // Log the response
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

export const joinTeam = async (gameSessionId: string, teamName: string): Promise<void> => {
  const gameData = {
    gameSessionId,
    teamName,
  };

  console.log('game joined, gameId:', gameSessionId); // Log the response
  console.log('json:', JSON.stringify(gameData)); // Log the response

  const response = await fetch(`https://localhost:8080/teams`, {
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

export const getGameStatus = async (gameSessionId: string): Promise<GameSessionResponse> => {
  const response = await fetch(`${BASE_URL}/${gameSessionId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch game status');
  }
  const gameSession: GameSessionResponse = await response.json();
  console.log('Getting game dfdfdfdf for session:', gameSession);

  // Ensure gameLength is parsed correctly as an integer
  gameSession.gameLength = Number(gameSession.gameLength);

  return gameSession;
};

