// DeviceId.ts
let deviceId: string | null = null;
let playerName: string | null = null;

export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const adjectives = ['Blåa', 'Röda', 'Gröna', 'Gula', 'Lila', 'Orangea', 'Svarta', 'Vita', 'Gråa', 'Rosa'];
const nouns = ['Kullen', 'Ormen', 'Tigern', 'Lejonet', 'Örnen', 'Hajen', 'Vargen', 'Björnen', 'Räven', 'Draken', 'Kossan', 'Hunden', 'Katten', 'Fågeln', 'Fisken'];

export const generateRandomPlayerName = (): string => {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
};

export const getDeviceId = (): string => {
  if (!deviceId) {
    deviceId = generateRandomString(10);
  }
  return deviceId;
};

export const getPlayerName = (): string => {
  if (!playerName) {
    playerName = generateRandomPlayerName();
  }
  return playerName;
};

export const getHeaders = (): Headers => {
  const deviceId = getDeviceId();
  const updatedHeaders = new Headers({
    'device-id': deviceId,
    'Content-Type': 'application/json'
  });

  return updatedHeaders;
};