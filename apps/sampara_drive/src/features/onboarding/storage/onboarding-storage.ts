import { getSecureItem, setSecureItem } from '@/shared/storage/secure-storage';

const ONBOARDING_KEY = 'sampara.drive.onboarding.v1';

export async function readOnboardingCompletion() {
  return (await getSecureItem(ONBOARDING_KEY)) === 'complete';
}

export async function persistOnboardingCompletion() {
  await setSecureItem(ONBOARDING_KEY, 'complete');
}
