import { world } from "@minecraft/server";

export function isPlayerInWater(player) {
  try {
    if (player.isSwimming || player.isInWater) {
      return true;
    }

    const dimension = player.dimension;
    const feet = dimension.getBlock(player.location);
    const head = dimension.getBlock({
      x: player.location.x,
      y: player.location.y + 1,
      z: player.location.z
    });

    return feet?.typeId === "minecraft:water" || head?.typeId === "minecraft:water";
  } catch {
    return false;
  }
}

export function isNightInOverworld(player) {
  if (player.dimension.id !== "minecraft:overworld" || typeof world.getTimeOfDay !== "function") {
    return false;
  }

  const timeOfDay = world.getTimeOfDay();
  return timeOfDay >= 13000 && timeOfDay <= 23000;
}

export function isPlayerSleeping(player) {
  try {
    return player.isSleeping;
  } catch {
    return false;
  }
}
