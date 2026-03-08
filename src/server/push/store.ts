import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { PushSubscriptionPayload, isPushSubscriptionPayload } from '@/types/push';

const DATA_DIRECTORY = path.join(process.cwd(), '.data');
const SUBSCRIPTIONS_PATH = path.join(DATA_DIRECTORY, 'push-subscriptions.json');

async function ensureStorageDirectory() {
  await mkdir(DATA_DIRECTORY, { recursive: true });
}

async function writeSubscriptions(subscriptions: PushSubscriptionPayload[]) {
  await ensureStorageDirectory();
  await writeFile(SUBSCRIPTIONS_PATH, JSON.stringify(subscriptions, null, 2), 'utf8');
}

export async function readPushSubscriptions() {
  try {
    const raw = await readFile(SUBSCRIPTIONS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isPushSubscriptionPayload);
  } catch (error) {
    const candidate = error as NodeJS.ErrnoException;

    if (candidate.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

export async function upsertPushSubscription(subscription: PushSubscriptionPayload) {
  const subscriptions = await readPushSubscriptions();
  const nextSubscriptions = [
    subscription,
    ...subscriptions.filter(({ endpoint }) => endpoint !== subscription.endpoint),
  ];

  await writeSubscriptions(nextSubscriptions);
}

export async function removePushSubscription(endpoint: string) {
  const subscriptions = await readPushSubscriptions();
  const nextSubscriptions = subscriptions.filter((subscription) => subscription.endpoint !== endpoint);
  const changed = nextSubscriptions.length !== subscriptions.length;

  if (changed) {
    await writeSubscriptions(nextSubscriptions);
  }

  return changed;
}
