interface GeoPoint {
  type: string;
  coordinates: [number, number];
}

interface TeamResponse {
  teamId?: string;
  teamScore: number;
  captainSelected: boolean;
  captainId?: string;
  teamName?: string;
  location?: GeoPoint;
  teamIsReadyToStart: boolean;
  lockedEndTime: Date;
  wantsToPause: boolean;
  pauseLength: number;
  completedChallenges?: string[];
  teamColor?: string;
  points: number;
  activeParticipants: number;
  teamCanTravel: boolean;
  activeChallengeId?: string;
  teamBudget: number;
}

interface AreaInSession {
  mapId?: string;
  areaId?: string;
  areaName?: string;
  areaCoordinates?: GeoPoint[];
  team1Points: number;
  team2Points: number;
}

interface TravelruleResponse {
  mapId?: string;
  transportName?: string;
  ruleName?: string;
  cost: number;
  unit?: string;
}

interface GameSessionResponse {
  mapId?: string;
  id?: string;
  team1?: TeamResponse;
  team2?: TeamResponse;
  areasInSession?: AreaInSession[];
  travelRules?: TravelruleResponse[];
  captainsSelected: boolean;
  pausedEndTime: Date;
  gameStartTime: Date;
  gameEndTime: Date;
  gameLength: number;
  sessionStatus: SessionStatus;
  startingAreaId?: string;
}

type SessionStatus = 'None' | 'CaptainsSelected' | 'NotStarted' | 'Started' | 'Paused';



  export { type TeamResponse, type GameSessionResponse, type TravelruleResponse, type AreaInSession, type GeoPoint };