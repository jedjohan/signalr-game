import React, { useState, useEffect } from 'react';
import { fetchTeams } from '../services/TeamService';
import { TeamResponse } from '../Models/models';

interface TeamListProps {
  refresh: boolean;
}

function TeamList ({ refresh }: TeamListProps) {
  const [teams, setTeams] = useState<TeamResponse[]>([]); // State expects an array of Team objects
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const teamList = await fetchTeams();
        setTeams(teamList);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getTeams();
  }, [refresh]); // Refetch games when `refresh` prop changes

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Teams List</h2>
      {teams.length === 0 ? (
        <p>No teams available</p> // Handle empty array
      ) : (
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <ul>
            {teams.map((team) => (
              <li key={team.teamId}>
                <strong>{team.teamName}</strong>
                <br />
                <em>TeamId:</em> {team.teamId} {/* Render the team ID */}
                <br />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TeamList;
