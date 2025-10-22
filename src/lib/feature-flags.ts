// Server-side feature flags (NOT exposed to client)
type FeatureFlags = {
  vendorApplicationV2: boolean;
  liveStreaming: boolean;
  advancedSearch: boolean;
  reviewModeration: boolean;
};

// Read from server environment variables (no NEXT_PUBLIC prefix)
const serverFeatures: FeatureFlags = {
  vendorApplicationV2: process.env.FEATURE_VENDOR_APP_V2 === 'true',
  liveStreaming: process.env.FEATURE_LIVE_STREAMING === 'true',
  advancedSearch: process.env.FEATURE_ADVANCED_SEARCH === 'true',
  reviewModeration: process.env.FEATURE_REVIEW_MODERATION === 'true',
};

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  // Server-side only!
  if (typeof window !== 'undefined') {
    throw new Error('Feature flags must only be checked server-side');
  }
  return serverFeatures[flag] ?? false;
}

// For client components, pass the boolean as a prop from a server component
export function getFeatureFlags(): FeatureFlags {
  if (typeof window !== 'undefined') {
    throw new Error('getFeatureFlags must only be called server-side');
  }
  return serverFeatures;
}
