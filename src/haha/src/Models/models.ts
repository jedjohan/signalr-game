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
  connectionIds?: string[];
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

type SessionStatus = 'None' | 'CaptainsSelected' | 'NotStarted' | 'Started' | 'Paused' | 'Finished';

const sessionStatusMapping: { [key: number]: SessionStatus } = {
  0: 'None',
  1: 'CaptainsSelected',
  2: 'NotStarted',
  3: 'Started',
  4: 'Paused',
  5: 'Finished'
};

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
  sessionStatus: number; // Change this to a number
  startingAreaId?: string;
}

export {
  type TeamResponse,
  type GameSessionResponse,
  type TravelruleResponse,
  type AreaInSession,
  type GeoPoint,
  type SessionStatus,
  sessionStatusMapping
};
