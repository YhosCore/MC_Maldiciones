import { ItemStack } from "@minecraft/server";
import { getInventory } from "../utils/inventory.js";
import { tell } from "../utils/messages.js";
import { randomFloat, randomInt, shuffle } from "../utils/random.js";

export const slipperyHandsCurse = {
  id: "manos_resbaladizas",

  createState() {
    return {
      remaining: 10 * 60,
      nextDrop: randomInt(12, 35)
    };
  },

  onStart(player) {
    tell(player, "La Maldicion de Manos Resbaladizas se aferra a ti por 10 minutos.");
  },

  tick(player, state) {
    state.nextDrop -= 1;

    if (state.nextDrop <= 0) {
      dropRandomInventoryItems(player);
      state.nextDrop = randomInt(18, 55);
    }
  }
};

function dropRandomInventoryItems(player) {
  const inventory = getInventory(player);
  if (!inventory) {
    return;
  }

  const eligibleSlots = [];
  for (let slot = 0; slot < inventory.size; slot += 1) {
    const item = inventory.getItem(slot);
    if (item && item.typeId !== "minecraft:air") {
      eligibleSlots.push(slot);
    }
  }

  if (eligibleSlots.length === 0) {
    tell(player, "Manos Resbaladizas no encuentra objetos en tu inventario.");
    return;
  }

  shuffle(eligibleSlots);
  const amountToDrop = Math.min(randomInt(1, 3), eligibleSlots.length);

  for (let i = 0; i < amountToDrop; i += 1) {
    const slot = eligibleSlots[i];
    const item = inventory.getItem(slot);
    if (!item) {
      continue;
    }

    const dropAmount = Math.min(item.amount, randomInt(1, 3));
    const droppedItem = createDroppedStack(item, dropAmount);

    if (item.amount > dropAmount) {
      item.amount -= dropAmount;
      inventory.setItem(slot, item);
    } else {
      inventory.setItem(slot, undefined);
    }

    const dropTarget = getDropTargetInFrontOfPlayer(player);
    const itemEntity = player.dimension.spawnItem(droppedItem, dropTarget.location);
    launchDroppedItem(itemEntity, dropTarget.direction);
  }

  tell(player, "Upps...");
}

function createDroppedStack(item, amount) {
  try {
    const clone = item.clone();
    clone.amount = amount;
    return clone;
  } catch {
    return new ItemStack(item.typeId, amount);
  }
}

function getDropTargetInFrontOfPlayer(player) {
  const viewDirection = player.getViewDirection();
  const horizontalLength = Math.max(Math.hypot(viewDirection.x, viewDirection.z), 0.001);
  const direction = {
    x: viewDirection.x / horizontalLength,
    z: viewDirection.z / horizontalLength
  };
  const distance = randomFloat(2, 3);
  const sideOffset = randomFloat(-0.25, 0.25);

  return {
    location: {
      x: player.location.x + direction.x * distance + direction.z * sideOffset,
      y: player.location.y + 1.1,
      z: player.location.z + direction.z * distance - direction.x * sideOffset
    },
    direction
  };
}

function launchDroppedItem(itemEntity, direction) {
  try {
    itemEntity.applyImpulse({
      x: direction.x * randomFloat(0.04, 0.1),
      y: randomFloat(0.04, 0.12),
      z: direction.z * randomFloat(0.04, 0.1)
    });
  } catch {
    // If this runtime cannot impulse item entities, spawning still drops it.
  }
}
