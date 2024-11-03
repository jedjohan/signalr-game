import { GameSessionResponse, ChallengeResponse } from '../Models/models';
import { getHeaders } from './DeviceId';

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
  
  
  export const takeNewChallengeAsCaptain = async (gameSessionId: string, teamId: string, captainId: string, location: { type: string, coordinates: number[] }): Promise<GameSessionResponse> => {
    const challengeData = {
      location
    };
  
    console.log('Requesting new challenge with location:', JSON.stringify(challengeData)); // Log the data
  
    const response = await fetch(`https://localhost:8080/${gameSessionId}/teams/${teamId}/newchallenge`, {
      method: 'POST',
      headers: new Headers({
        'device-id': captainId,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(challengeData),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const gameSession: GameSessionResponse = await response.json();
    return gameSession;
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

  export const reportChallengeAsCaptain = async (gameSessionId: string, teamId: string, captainId: string, challengeId: string, succeeded: boolean): Promise<GameSessionResponse> => {
    const challengeData = {
      challengeId,
      succeeded
    };
  
    console.log('Requesting new challenge with location:', JSON.stringify(challengeData)); // Log the data
  
    const response = await fetch(`https://localhost:8080/${gameSessionId}/teams/${teamId}/reportchallenge`, {
      method: 'POST',
      headers: new Headers({
        'device-id': captainId,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(challengeData),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const gameSession: GameSessionResponse = await response.json();
    return gameSession;
  };