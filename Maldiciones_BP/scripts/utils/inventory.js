export function getInventory(player) {
  return player.getComponent("minecraft:inventory")?.container;
}

export function consumeHeldItem(player, typeId) {
  const inventory = getInventory(player);
  const selectedSlot = player.selectedSlotIndex ?? 0;

  if (!inventory || selectedSlot < 0) {
    return;
  }

  const held = inventory.getItem(selectedSlot);
  if (!held || held.typeId !== typeId) {
    return;
  }

  if (held.amount > 1) {
    held.amount -= 1;
    inventory.setItem(selectedSlot, held);
  } else {
    inventory.setItem(selectedSlot, undefined);
  }
}
