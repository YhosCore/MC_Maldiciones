import { world, system } from "@minecraft/server";
import { markCraftingSession, tickBrokenObjectDurability, tickCraftedItems } from "./behaviors/defectiveMaterial.js";
import { tickPlayerCurses } from "./core/curseManager.js";
import { handleItemUse } from "./items/itemUseHandler.js";
import { tickAutomaticTriggers } from "./triggers/automaticTriggers.js";
import { handleNightmareDeath, tickNightmareTrigger } from "./triggers/nightmareTrigger.js";
import { TICKS_PER_SECOND } from "./utils/constants.js";

world.afterEvents.itemUse.subscribe(handleItemUse);
world.afterEvents.playerInteractWithBlock.subscribe(markCraftingSession);
world.afterEvents.entityDie.subscribe(handleNightmareDeath);

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    tickAutomaticTriggers(player);
    tickPlayerCurses(player);
  }
}, TICKS_PER_SECOND);

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    tickNightmareTrigger(player);
    tickCraftedItems(player);
    tickBrokenObjectDurability(player);
  }
}, 1);
