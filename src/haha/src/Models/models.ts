
interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  }
  
  interface GeoLocation {
    latitude: number;
    longitude: number;
}

interface Team {
    teamId?: string;
    teamScore: number;
    captainSelected: boolean;
    captainId?: string;
    teamName?: string;
    location: GeoLocation;
    teamIsReadyToStart: boolean;
    teamCanTravel: boolean;
    lockedEndTime: Date;
    wantsToPause: boolean;
    completedChallenges?: string[];
    teamColor: string;
    numberOfCoins: number;
}

  
  interface Game {
    id: string;
    name: string;
    description: string;
    running: boolean;
    team1: Team | null;
    team2: Team | null;
  }

  export { type Team, type Game, type GeoJSONPoint };