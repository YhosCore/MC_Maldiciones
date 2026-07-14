import { activateCurse, clearCurses } from "../core/curseManager.js";
import { isOnCooldown } from "../core/cooldowns.js";
import { CLEANSING_ITEMS, SCROLL_TO_CURSE } from "../utils/constants.js";
import { consumeHeldItem } from "../utils/inventory.js";

export function handleItemUse(event) {
  const player = event.source;
  const item = event.itemStack;

  if (!player || player.typeId !== "minecraft:player" || !item) {
    return;
  }

  if (CLEANSING_ITEMS.has(item.typeId)) {
    if (!isOnCooldown(player, item.typeId)) {
      consumeHeldItem(player, item.typeId);
      clearCurses(player);
    }
    return;
  }

  const curseId = SCROLL_TO_CURSE[item.typeId];
  if (!curseId || isOnCooldown(player, item.typeId)) {
    return;
  }

  consumeHeldItem(player, item.typeId);
  activateCurse(player, curseId);
}
