# anvl-forge-sdk

TypeScript SDK for [ANVL Forge](https://anvl.site/forge) — quest templates, craft recipes, rarity system, conversion config, and a typed API client.

Build Discord bots, Telegram bots, dashboards, or custom frontends on top of the ANVL Forge ecosystem.

## Install

```bash
npm install anvl-forge-sdk
```

## Constants & Helpers

```ts
import {
  QUEST_TEMPLATES,      // Daily quest definitions
  CRAFT_RECIPES,        // All craftable items with ingredients + success rates
  BLACKSMITH_VARIANTS,  // Apprentice / Journeyman / Master specs
  CONVERSION_CONFIG,    // Points → $ANVL conversion rate and limits
  RARITY_CONFIG,        // Colors and labels for Common → Legendary
  ptsToAnvl,            // Convert Forge Points to $ANVL amount
  anvlToPts,            // Convert $ANVL to Forge Points
  craftCooldownRemaining, // ms until next craft is ready
  fmtMs,                // "14m 32s" human-readable cooldown
  qualifiedVariant,     // Best Blacksmith tier for a given $ANVL balance
  effectiveSuccessRate, // Recipe success % with Blacksmith tier bonus applied
} from "anvl-forge-sdk";

// Check which Blacksmith a user qualifies for
const variant = qualifiedVariant(125_000); // 125K $ANVL
console.log(variant?.name); // "Journeyman Blacksmith"

// Calculate points from $ANVL
console.log(anvlToPts(50));   // 50000
console.log(ptsToAnvl(75000)); // 75
```

## API Client

```ts
import { getForgeLeaderboard, getForgeMe, getForgeQuests } from "anvl-forge-sdk";

const opts = { baseUrl: "https://anvl.site" };

// Public leaderboard (no auth needed)
const { leaderboard } = await getForgeLeaderboard(opts);
leaderboard.forEach((e, i) => console.log(`#${i+1} ${e.wallet.slice(0,8)}… — ${e.points} pts`));

// Authenticated endpoints — pass session cookie for server-side usage
const authOpts = { baseUrl: "https://anvl.site", sessionCookie: "your_session_value" };
const { user }    = await getForgeMe(authOpts);
const { quests }  = await getForgeQuests(authOpts);
const { recipes } = await getCraftingRecipes(authOpts);
```

## Craft Recipes

```ts
import { CRAFT_RECIPES, recipesByRarity } from "anvl-forge-sdk";

// All recipes sorted common → legendary
recipesByRarity().forEach(r => {
  console.log(`[${r.rarity.toUpperCase()}] ${r.name} — ${r.successRate}% base success`);
  r.ingredients.forEach(i => console.log(`  · ${i.qtyRequired}x ${i.itemName}`));
});
```

## Conversion

```ts
import { CONVERSION_CONFIG, ptsToAnvl, snapPts } from "anvl-forge-sdk";

// 1000 pts = 1 $ANVL
console.log(CONVERSION_CONFIG.ratePerAnvl);   // 1000
console.log(ptsToAnvl(75_000));               // 75
console.log(snapPts(76_500));                 // 76000 (snapped to nearest 1000)
```

## License

MIT — [github.com/anvlproject](https://github.com/anvlproject)
