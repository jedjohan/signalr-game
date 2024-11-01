import { getHeaders } from './DeviceId';

const BASE_URL = 'https://localhost:8080/teams';

export const fetchTeams = async (): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }

  const teams: any[] = await response.json();
  return teams || [];
};

export const joinTeam = async (teamId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/join/${teamId}`, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const leaveTeam = async (teamId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/leave/${teamId}`, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const createTeam = async (teamName: string): Promise<void> => {
  const teamData = {
    name: teamName
  };

  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(teamData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};