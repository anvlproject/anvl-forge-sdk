// anvl-forge-sdk — types.ts
export type AnvlTier   = "free" | "smith" | "legend";
export type Rarity     = "common" | "uncommon" | "rare" | "legendary";
export type Category   = "forge" | "drop";
export type QuestType  = "strikes" | "pts_earned";

export interface QuestTemplate {
  id:         string;
  label:      string;
  desc:       string;
  type:       QuestType;
  target:     number;
  reward_pts: number;
  reward_xp:  number;
  icon:       string;
}

export interface QuestProgress extends QuestTemplate {
  progress: number;
  claimed:  boolean;
  pct:      number; // 0–100
}

export interface RecipeIngredient {
  itemName:    string;
  qtyRequired: number;
}

export interface CraftRecipe {
  id:          string;
  name:        string;
  category:    Category;
  rarity:      Rarity;
  successRate: number;
  ingredients: RecipeIngredient[];
}

export interface BlacksmithVariant {
  tier:            "apprentice" | "journeyman" | "master";
  name:            string;
  requiredAnvl:    number;
  craftPoints:     number;
  craftCooldownMs: number;
  tierBonus:       number; // % success rate bonus
}

export interface ConversionConfig {
  ratePerAnvl:   number;    // points per 1 $ANVL
  minPts:        number;
  maxPts:        number;
  cooldownHours: number;
  tokenDecimals: number;
}

export interface RarityConfig {
  label:  string;
  color:  string;
  bg:     string;
  shadow: string;
  order:  number;
}
