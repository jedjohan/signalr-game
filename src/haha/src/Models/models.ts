
interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  }
  
  interface Team {
    id: string;
    name: string;
    description: string;
    location: GeoJSONPoint;
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