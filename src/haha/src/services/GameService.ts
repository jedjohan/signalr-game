import { GameSessionResponse, ChallengeResponse } from '../Models/models';
import { getHeaders, getPlayerName } from './DeviceId';

const BASE_URL = 'https://localhost:8080/games';

export const fetchGames = async (): Promise<GameSessionResponse[]> => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }

  const games: GameSessionResponse[] = await response.json();
  return games || [];
};

export const getChallenge = async (mapId: string, challengeId: string): Promise<ChallengeResponse> => {
  const response = await fetch(`https://localhost:8080/maps/${mapId}/challenge/${challengeId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch challenge');
  }

  const challenge: ChallengeResponse = await response.json();
  return challenge || {};
};

export const createGame = async (mapId: string, gameLength: number, playerName: string): Promise<void> => {
  const gameData = {
    mapId,
    gameLength,
    playerName,
  };

  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(gameData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const joinTeamWithId = async (gameSessionId: string, teamId: string): Promise<void> => {
  const gameData = {
    gameSessionId,
    teamId,
    playerName: getPlayerName()
  };

  const response = await fetch(`https://localhost:8080/games/${gameSessionId}/${teamId}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(gameData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const takeNewChallenge = async (gameSessionId: string, teamId: string, location: { type: string, coordinates: number[] }): Promise<GameSessionResponse> => {
  const challengeData = {
    location
  };

  console.log('Requesting new challenge with location:', JSON.stringify(challengeData)); // Log the data

  const response = await fetch(`https://localhost:8080/${gameSessionId}/teams/${teamId}/newchallenge`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(challengeData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const gameSession: GameSessionResponse = await response.json();
  return gameSession;
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