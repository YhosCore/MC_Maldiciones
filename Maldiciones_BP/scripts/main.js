import { world, system } from "@minecraft/server";
import { tickPlayerCurses } from "./core/curseManager.js";
import { handleItemUse } from "./items/itemUseHandler.js";
import { tickAutomaticTriggers } from "./triggers/automaticTriggers.js";
import { TICKS_PER_SECOND } from "./utils/constants.js";

world.afterEvents.itemUse.subscribe(handleItemUse);

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    tickAutomaticTriggers(player);
    tickPlayerCurses(player);
  }
}, TICKS_PER_SECOND);
