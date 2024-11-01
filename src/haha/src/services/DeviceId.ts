// DeviceId.ts
let deviceId: string | null = null;

export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getDeviceId = (): string => {
  if (!deviceId) {
    deviceId = generateRandomString(10);
  }
  return deviceId;
};

export const getHeaders = (): Headers => {
  const deviceId = getDeviceId();
  const updatedHeaders = new Headers({
    'device-id': deviceId,
    'Content-Type': 'application/json'
  });

  return updatedHeaders;
};