import * as sdk from 'matrix-js-sdk';

const HOMESERVER = 'https://matrix.mychat.ph';

let client = null;

export function getClient() { return client; }

export async function login(username, password) {
  const tmpClient = sdk.createClient({ baseUrl: HOMESERVER });
  const res = await tmpClient.loginWithPassword(username, password);
  client = sdk.createClient({
    baseUrl: HOMESERVER,
    accessToken: res.access_token,
    userId: res.user_id,
    deviceId: res.device_id,
  });
  localStorage.setItem('mc_token', res.access_token);
  localStorage.setItem('mc_uid', res.user_id);
  localStorage.setItem('mc_device', res.device_id);
  return client;
}

export async function restoreSession() {
  const token = localStorage.getItem('mc_token');
  const userId = localStorage.getItem('mc_uid');
  const deviceId = localStorage.getItem('mc_device');
  if (!token || !userId) return null;
  client = sdk.createClient({
    baseUrl: HOMESERVER,
    accessToken: token,
    userId,
    deviceId,
  });
  return client;
}

export function logout() {
  if (client) client.logout().catch(() => {});
  client = null;
  localStorage.removeItem('mc_token');
  localStorage.removeItem('mc_uid');
  localStorage.removeItem('mc_device');
}

export async function startSync(onEvent) {
  if (!client) return;
  client.on('Room.timeline', (event, room) => {
    if (onEvent) onEvent(event, room);
  });
  await client.startClient({ initialSyncLimit: 20 });
}

export function getRooms() {
  if (!client) return [];
  return client.getRooms();
}

export async function sendMessage(roomId, text) {
  if (!client) throw new Error('Not connected');
  return client.sendMessage(roomId, { msgtype: 'm.text', body: text });
}

export async function sendActionCard(roomId, action) {
  if (!client) throw new Error('Not connected');
  return client.sendEvent(roomId, 'xyz.mychat.action', {
    action_type: action.type,
    title: action.title,
    amount: action.amount ?? null,
    currency: action.currency ?? 'PHP',
    note: action.note ?? '',
    fields: action.fields ?? [],
    status: 'pending',
    created_at: Date.now(),
  });
}

export async function updateActionStatus(roomId, eventId, status) {
  if (!client) throw new Error('Not connected');
  return client.sendEvent(roomId, 'xyz.mychat.action.update', {
    relates_to: { rel_type: 'm.reference', event_id: eventId },
    status,
    updated_at: Date.now(),
  });
}

export function myUserId() {
  return client?.getUserId() ?? localStorage.getItem('mc_uid') ?? '';
}

export function displayName(userId) {
  if (!client) return userId;
  const user = client.getUser(userId);
  return user?.displayName || userId.split(':')[0].replace('@', '');
}

export function roomDisplayName(room) {
  return room.name || room.roomId;
}

export function isCirclePlus(room) {
  const type = room.getType?.();
  return type === 'ph.mychat.circle.plus';
}

export function getTimeline(room) {
  return room.getLiveTimeline().getEvents();
}
