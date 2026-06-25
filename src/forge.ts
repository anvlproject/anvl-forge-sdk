// anvl-forge-sdk — forge.ts
import { QuestTemplate, CraftRecipe, BlacksmithVariant, ConversionConfig, RarityConfig, Rarity, QuestProgress } from "./types";

// ── Daily Quest Templates ─────────────────────────────────────────────────────
export const QUEST_TEMPLATES: QuestTemplate[] = [
  { id: "q1", label: "Smith's Warmup",      desc: "Strike the anvil 5 times today",     type: "strikes",   target: 5,   reward_pts: 50,  reward_xp: 25,  icon: "🔨" },
  { id: "q2", label: "Productive Day",       desc: "Earn 150 pts from forging today",    type: "pts_earned",target: 150, reward_pts: 100, reward_xp: 50,  icon: "⚡" },
  { id: "q3", label: "Master of the Forge",  desc: "Strike the anvil 15 times today",    type: "strikes",   target: 15,  reward_pts: 200, reward_xp: 100, icon: "👑" },
];

// ── Craft Recipes ─────────────────────────────────────────────────────────────
export const CRAFT_RECIPES: CraftRecipe[] = [
  { id: "steel-sword",    name: "Steel Sword",    category: "forge", rarity: "common",    successRate: 90, ingredients: [{ itemName: "Iron Ingot",   qtyRequired: 2 }, { itemName: "Steel Alloy",    qtyRequired: 1 }] },
  { id: "iron-shield",    name: "Iron Shield",    category: "forge", rarity: "common",    successRate: 90, ingredients: [{ itemName: "Iron Ingot",   qtyRequired: 3 }, { itemName: "Bone Talisman", qtyRequired: 1 }] },
  { id: "mithril-blade",  name: "Mithril Blade",  category: "forge", rarity: "uncommon",  successRate: 75, ingredients: [{ itemName: "Mithril Shard",qtyRequired: 2 }, { itemName: "Steel Alloy",    qtyRequired: 1 }] },
  { id: "runed-armor",    name: "Runed Armor",    category: "forge", rarity: "uncommon",  successRate: 70, ingredients: [{ itemName: "Mithril Shard",qtyRequired: 1 }, { itemName: "Dragon Scale",   qtyRequired: 1 }, { itemName: "Iron Ingot", qtyRequired: 2 }] },
  { id: "dragon-axe",     name: "Dragon Axe",     category: "forge", rarity: "rare",      successRate: 55, ingredients: [{ itemName: "Dragon Scale", qtyRequired: 2 }, { itemName: "Mithril Shard", qtyRequired: 1 }] },
  { id: "phoenix-staff",  name: "Phoenix Staff",  category: "forge", rarity: "rare",      successRate: 50, ingredients: [{ itemName: "Phoenix Core", qtyRequired: 1 }, { itemName: "Dragon Scale",  qtyRequired: 1 }] },
  { id: "crown-of-legends",name:"Crown of Legends",category:"forge", rarity: "legendary", successRate: 25, ingredients: [{ itemName: "Phoenix Core", qtyRequired: 2 }, { itemName: "Dragon Scale",  qtyRequired: 2 }, { itemName: "Mithril Shard", qtyRequired: 3 }] },
];

// ── Blacksmith Variants ───────────────────────────────────────────────────────
export const BLACKSMITH_VARIANTS: BlacksmithVariant[] = [
  { tier: "apprentice",  name: "Apprentice Blacksmith", requiredAnvl: 10_000,  craftPoints: 10, craftCooldownMs: 3_600_000, tierBonus: 0  },
  { tier: "journeyman",  name: "Journeyman Blacksmith",  requiredAnvl: 50_000,  craftPoints: 25, craftCooldownMs: 1_800_000, tierBonus: 15 },
  { tier: "master",      name: "Master Blacksmith",      requiredAnvl: 200_000, craftPoints: 75, craftCooldownMs:   900_000, tierBonus: 30 },
];

// ── Conversion Config ─────────────────────────────────────────────────────────
export const CONVERSION_CONFIG: ConversionConfig = {
  ratePerAnvl:   1000,
  minPts:        1000,
  maxPts:        100_000,
  cooldownHours: 24,
  tokenDecimals: 6,
};

// ── Rarity Config ─────────────────────────────────────────────────────────────
export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  common:    { label: "COMMON",    color: "#9ca3af", bg: "rgba(156,163,175,0.07)", shadow: "none",                            order: 0 },
  uncommon:  { label: "UNCOMMON",  color: "#2a8c6e", bg: "rgba(42,140,110,0.08)",  shadow: "0 0 8px rgba(42,140,110,0.35)",   order: 1 },
  rare:      { label: "RARE",      color: "#f5a623", bg: "rgba(245,166,35,0.08)",  shadow: "0 0 10px rgba(245,166,35,0.4)",   order: 2 },
  legendary: { label: "LEGENDARY", color: "#e85d04", bg: "rgba(232,93,4,0.1)",     shadow: "0 0 16px rgba(232,93,4,0.55)",    order: 3 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Calculate effective success rate for a recipe + blacksmith tier */
export function effectiveSuccessRate(recipe: CraftRecipe, variant: BlacksmithVariant): number {
  return Math.min(100, recipe.successRate + variant.tierBonus);
}

/** Convert Forge Points → $ANVL amount */
export function ptsToAnvl(pts: number): number {
  return Math.floor(pts / CONVERSION_CONFIG.ratePerAnvl);
}

/** Convert $ANVL → Forge Points */
export function anvlToPts(anvl: number): number {
  return Math.floor(anvl) * CONVERSION_CONFIG.ratePerAnvl;
}

/** Snap pts to a valid multiple within min/max bounds */
export function snapPts(pts: number): number {
  const r = CONVERSION_CONFIG.ratePerAnvl;
  const snapped = Math.floor(pts / r) * r;
  return Math.max(CONVERSION_CONFIG.minPts, Math.min(CONVERSION_CONFIG.maxPts, snapped));
}

/** Get quests with progress overlay */
export function overlayProgress(
  templates: QuestTemplate[],
  progressMap: Record<string, { progress: number; claimed: boolean }>
): QuestProgress[] {
  return templates.map((q) => {
    const p = progressMap[q.id] ?? { progress: 0, claimed: false };
    return { ...q, progress: p.progress, claimed: p.claimed, pct: Math.min(100, Math.round((p.progress / q.target) * 100)) };
  });
}

/** Get cooldown remaining ms from last craft timestamp */
export function craftCooldownRemaining(lastCraftAt: Date | null, variant: BlacksmithVariant): number {
  if (!lastCraftAt) return 0;
  const elapsed = Date.now() - lastCraftAt.getTime();
  return Math.max(0, variant.craftCooldownMs - elapsed);
}

/** Format ms to human-readable string: "14m 32s" */
export function fmtMs(ms: number): string {
  if (ms <= 0) return "Ready";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

/** Get recipes sorted by rarity (common → legendary) */
export function recipesByRarity(): CraftRecipe[] {
  return [...CRAFT_RECIPES].sort((a, b) => RARITY_CONFIG[a.rarity].order - RARITY_CONFIG[b.rarity].order);
}

/** Check if a wallet qualifies for a blacksmith tier */
export function qualifiedVariant(anvlBalance: number): BlacksmithVariant | null {
  return [...BLACKSMITH_VARIANTS]
    .reverse()
    .find((v) => anvlBalance >= v.requiredAnvl) ?? null;
}
