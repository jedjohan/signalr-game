import { TeamResponse } from '../Models/models';

const BASE_URL = 'https://localhost:8080/teams/';
const temporaryDeviceId = 'dacoolheaderdeviceid';

// Fetch teams and return as Team[]
export const fetchTeams = async (): Promise<TeamResponse[]> => {
  const response = await fetch(`${BASE_URL}`);
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }

  // Parse the JSON response and ensure it returns an array of Team objects
  const teams: TeamResponse[] = await response.json();

  // Return either the list of teams or an empty array
  return teams || [];
};

export const createTeam = async (name: string, description: string): Promise<void> => {
  const teamData = {
    name,
    description,
  };

  console.log('team name:', name); // Log the response
  console.log('json:', JSON.stringify(teamData)); // Log the response

  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'device-id': temporaryDeviceId
    },
    body: JSON.stringify(teamData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};