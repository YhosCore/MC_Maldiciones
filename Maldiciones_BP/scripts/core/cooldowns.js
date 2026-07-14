import { system } from "@minecraft/server";

const useCooldowns = new Map();

export function isOnCooldown(player, typeId) {
  const key = `${player.id}:${typeId}`;
  const now = system.currentTick;
  const previous = useCooldowns.get(key) ?? -100;

  if (now - previous < 10) {
    return true;
  }

  useCooldowns.set(key, now);
  return false;
}
