import { system } from "@minecraft/server";
import { getInventory } from "../utils/inventory.js";
import { randomInt } from "../utils/random.js";

const BROKEN_OBJECT_CHANCE_DENOMINATOR = 5;
const BROKEN_OBJECT_MARKER = "Maldicion: Objeto Roto";
const BROKEN_OBJECT_NOTE = "Se desgasta al doble de velocidad.";
const BROKEN_OBJECT_PROPERTY = "mal:objeto_roto";
const CRAFTING_SESSION_TICKS = 20 * 15;

const craftingSessions = new Map();
const craftingSnapshots = new Map();
const durabilitySnapshots = new Map();

export function markCraftingSession(event) {
  if (event.block?.typeId !== "minecraft:crafting_table" || !event.player) {
    return;
  }

  craftingSessions.set(event.player.id, system.currentTick + CRAFTING_SESSION_TICKS);
}

export function tickCraftedItems(player) {
  const inventory = getInventory(player);
  if (!inventory) {
    return;
  }

  const snapshots = getInventorySnapshots(craftingSnapshots, player);
  const isCrafting = (craftingSessions.get(player.id) ?? 0) >= system.currentTick;

  for (let slot = 0; slot < inventory.size; slot += 1) {
    const item = inventory.getItem(slot);
    const previous = snapshots.get(slot);

    if (item && isCrafting && isDurableGear(item) && isNewItemInSlot(item, previous) && !isBrokenObject(item)) {
      if (randomInt(1, BROKEN_OBJECT_CHANCE_DENOMINATOR) === 1) {
        applyBrokenObject(inventory, slot, item);
      }
    }

    snapshots.set(slot, createItemSnapshot(item));
  }
}

export function tickBrokenObjectDurability(player) {
  const inventory = getInventory(player);
  if (!inventory) {
    return;
  }

  const snapshots = getInventorySnapshots(durabilitySnapshots, player);

  for (let slot = 0; slot < inventory.size; slot += 1) {
    const item = inventory.getItem(slot);
    if (!item || !isBrokenObject(item)) {
      continue;
    }

    const durability = getDurability(item);
    if (!durability) {
      continue;
    }

    const previous = snapshots.get(slot);
    const currentDamage = durability.damage;
    if (previous?.typeId === item.typeId && currentDamage > previous.damage) {
      const extraDamage = currentDamage - previous.damage;
      durability.damage = Math.min(durability.maxDurability, currentDamage + extraDamage);
      inventory.setItem(slot, item);
    }

    snapshots.set(slot, createItemSnapshot(item));
  }
}

export function clearBrokenObjects(player) {
  const inventory = getInventory(player);
  if (!inventory) {
    return 0;
  }

  let cleared = 0;
  for (let slot = 0; slot < inventory.size; slot += 1) {
    const item = inventory.getItem(slot);
    if (!item || !isBrokenObject(item)) {
      continue;
    }

    removeBrokenObjectMark(item);
    inventory.setItem(slot, item);
    cleared += 1;
  }

  return cleared;
}

function applyBrokenObject(inventory, slot, item) {
  try {
    item.setDynamicProperty(BROKEN_OBJECT_PROPERTY, true);
  } catch {
    // Lore keeps compatibility when dynamic properties are unavailable.
  }

  const lore = getSafeLore(item);
  if (!lore.includes(BROKEN_OBJECT_MARKER)) {
    lore.push(BROKEN_OBJECT_MARKER);
    lore.push(BROKEN_OBJECT_NOTE);
    item.setLore(lore);
  }

  const durability = getDurability(item);
  if (durability) {
    durability.damage = Math.max(durability.damage, Math.ceil(durability.maxDurability / 5));
  }

  inventory.setItem(slot, item);
}

function removeBrokenObjectMark(item) {
  try {
    item.setDynamicProperty(BROKEN_OBJECT_PROPERTY, false);
  } catch {
    // Lore removal is enough for older runtimes.
  }

  const lore = getSafeLore(item).filter((line) => line !== BROKEN_OBJECT_MARKER && line !== BROKEN_OBJECT_NOTE);
  item.setLore(lore);
}

function getInventorySnapshots(snapshotStore, player) {
  let snapshots = snapshotStore.get(player.id);
  if (!snapshots) {
    snapshots = new Map();
    snapshotStore.set(player.id, snapshots);
  }

  return snapshots;
}

function createItemSnapshot(item) {
  if (!item) {
    return undefined;
  }

  return {
    typeId: item.typeId,
    amount: item.amount,
    damage: getDurability(item)?.damage ?? 0
  };
}

function isNewItemInSlot(item, previous) {
  return !previous || previous.typeId !== item.typeId || previous.amount < item.amount;
}

function isDurableGear(item) {
  const typeId = item.typeId;
  return /_(sword|spear|pickaxe|axe|shovel|hoe)$/.test(typeId)
    || /_(helmet|chestplate|leggings|boots)$/.test(typeId)
    || [
      "minecraft:shears",
      "minecraft:fishing_rod",
      "minecraft:flint_and_steel",
      "minecraft:brush",
      "minecraft:mace",
      "minecraft:bow",
      "minecraft:crossbow",
      "minecraft:trident",
      "minecraft:turtle_helmet",
      "minecraft:elytra",
      "minecraft:shield",
      "minecraft:wolf_armor",
      "minecraft:leather_horse_armor"
    ].includes(typeId);
}

function isBrokenObject(item) {
  try {
    if (item.getDynamicProperty(BROKEN_OBJECT_PROPERTY) === true) {
      return true;
    }
  } catch {
    // Lore is the fallback marker.
  }

  return getSafeLore(item).includes(BROKEN_OBJECT_MARKER);
}

function getSafeLore(item) {
  try {
    return item.getLore();
  } catch {
    return [];
  }
}

function getDurability(item) {
  try {
    return item.getComponent("minecraft:durability");
  } catch {
    return undefined;
  }
}
