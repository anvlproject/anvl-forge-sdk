// anvl-forge-sdk — client.ts
// Typed fetch client for ANVL Forge API endpoints.
// All endpoints require a valid ANVL session cookie.

export interface ForgeUser {
  wallet:    string;
  points:    number;
  tier:      string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  wallet:    string;
  points:    number;
  tier:      string;
  rank:      number;
}

export interface ForgeApiOptions {
  /** Base URL of your ANVL instance */
  baseUrl?: string;
  /** Session cookie value (anvl_session=...) — for server-side usage */
  sessionCookie?: string;
}

async function apiFetch<T>(path: string, opts: ForgeApiOptions, init: RequestInit = {}): Promise<T> {
  const base    = (opts.baseUrl ?? "https://anvl.site").replace(/\/$/, "");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.sessionCookie) headers["Cookie"] = `anvl_session=${opts.sessionCookie}`;

  const res = await fetch(base + path, { ...init, headers: { ...headers, ...((init.headers as Record<string,string>) ?? {}) }, credentials: "include" });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ANVL API ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

/** Get the current user's Forge state (points, tier, active rental) */
export function getForgeMe(opts: ForgeApiOptions): Promise<{ user: ForgeUser; rental: unknown }> {
  return apiFetch("/api/forge/me", opts);
}

/** Get today's quests with progress */
export function getForgeQuests(opts: ForgeApiOptions): Promise<{ quests: unknown[]; date: string }> {
  return apiFetch("/api/forge/quests", opts);
}

/** Get the public Forge leaderboard */
export function getForgeLeaderboard(opts: ForgeApiOptions): Promise<{ leaderboard: LeaderboardEntry[] }> {
  return apiFetch("/api/forge/leaderboard", opts);
}

/** Get available Blacksmith variants */
export function getBlacksmiths(opts: ForgeApiOptions): Promise<{ variants: unknown[] }> {
  return apiFetch("/api/forge/blacksmiths", opts);
}

/** Get conversion config + user's current balance + cooldown */
export function getConversionInfo(opts: ForgeApiOptions): Promise<{ rate: number; minPts: number; maxPts: number; userPts: number; cooldownEndsAt: string | null }> {
  return apiFetch("/api/forge/convert", opts);
}

/** Get crafting inventory */
export function getCraftingInventory(opts: ForgeApiOptions): Promise<{ inventory: unknown[] }> {
  return apiFetch("/api/forge/crafting/inventory", opts);
}

/** Get available craft recipes */
export function getCraftingRecipes(opts: ForgeApiOptions): Promise<{ recipes: unknown[] }> {
  return apiFetch("/api/forge/crafting/recipes", opts);
}

/** Trigger a craft */
export function executeCraft(recipeId: string, opts: ForgeApiOptions): Promise<{ success: boolean; item?: unknown; message?: string }> {
  return apiFetch("/api/forge/crafting/execute", opts, { method: "POST", body: JSON.stringify({ recipeId }) });
}

/** Claim a completed quest */
export function claimQuest(questId: string, opts: ForgeApiOptions): Promise<{ claimed: boolean; reward_pts: number; reward_xp: number }> {
  return apiFetch("/api/forge/quests/claim", opts, { method: "POST", body: JSON.stringify({ questId }) });
}
