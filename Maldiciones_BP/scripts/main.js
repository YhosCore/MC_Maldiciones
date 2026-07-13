import { ItemStack, world, system } from "@minecraft/server";

const TICKS_PER_SECOND = 20;
const PLAY_TIME_CURSE_SECONDS = 30 * 60;
const SWIM_CURSE_SECONDS = 60;
const AWAKE_NIGHT_CURSE_SECONDS = 8 * 60;

const activeCurses = new Map();
const useCooldowns = new Map();
const playerProgress = new Map();

const SCROLLS = {
  "mal:pergamino_vertigo_errante": "manos_resbaladizas",
  "mal:pergamino_hipo_ascendente": "hipo_ascendente",
  "mal:pergamino_desvelo_sombrio": "desvelo_sombrio"
};

const CLEANSING_ITEMS = new Set(["mal:rosario"]);

world.afterEvents.itemUse.subscribe((event) => {
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

  const curseId = SCROLLS[item.typeId];
  if (!curseId || isOnCooldown(player, item.typeId)) {
    return;
  }

  consumeHeldItem(player, item.typeId);
  activateCurse(player, curseId);
});

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    tickAutomaticTriggers(player);

    const states = activeCurses.get(player.id);
    if (!states) {
      continue;
    }

    for (const [curseId, state] of states) {
      if (tickCurse(player, state)) {
        states.delete(curseId);
      }
    }

    if (states.size === 0) {
      activeCurses.delete(player.id);
    }
  }
}, TICKS_PER_SECOND);

function activateCurse(player, curseId) {
  const states = getActiveCurses(player);

  if (curseId === "manos_resbaladizas") {
    states.set(curseId, {
      id: curseId,
      remaining: 10 * 60,
      nextDrop: randomInt(12, 35)
    });
    tell(player, "La Maldicion de Manos Resbaladizas se aferra a ti por 10 minutos.");
    return;
  }

  if (curseId === "hipo_ascendente") {
    states.set(curseId, {
      id: curseId,
      remaining: 60,
      nextJump: randomInt(3, 8),
      silent: true
    });
    return;
  }

  if (curseId === "desvelo_sombrio") {
    states.set(curseId, {
      id: curseId,
      remaining: 4 * 60,
      nextVisionPulse: 1,
      pulseIndex: 0
    });
    tell(player, "La Maldicion de Desvelo Sombrio nubla tu mirada.");
  }
}

function tickCurse(player, state) {
  state.remaining -= 1;

  if (state.remaining <= 0) {
    if (!state.silent) {
      tell(player, "La maldicion se ha disipado.");
    }
    return true;
  }

  if (state.id === "manos_resbaladizas") {
    state.nextDrop -= 1;

    if (state.nextDrop <= 0) {
      dropRandomInventoryItems(player);
      state.nextDrop = randomInt(18, 55);
    }
    return false;
  }

  if (state.id === "hipo_ascendente") {
    state.nextJump -= 1;

    if (state.nextJump <= 0) {
      hiccupJump(player);
      state.nextJump = randomInt(2, 7);
    }
    return false;
  }

  if (state.id === "desvelo_sombrio") {
    state.nextVisionPulse -= 1;

    if (state.nextVisionPulse <= 0) {
      visionPulse(player, state);
      state.nextVisionPulse = randomInt(7, 18);
    }
  }

  return false;
}

function tickAutomaticTriggers(player) {
  const progress = getProgress(player);

  progress.playSeconds += 1;
  if (progress.playSeconds >= PLAY_TIME_CURSE_SECONDS) {
    progress.playSeconds = 0;
    activateCurse(player, "manos_resbaladizas");
  }

  if (isPlayerInWater(player)) {
    progress.swimSeconds += 1;
  } else {
    progress.swimSeconds = 0;
    progress.swimTriggered = false;
  }

  if (progress.swimSeconds >= SWIM_CURSE_SECONDS && !progress.swimTriggered) {
    progress.swimTriggered = true;
    activateCurse(player, "hipo_ascendente");
  }

  if (isNightInOverworld(player)) {
    progress.awakeNightSeconds += 1;
  } else {
    progress.awakeNightSeconds = 0;
    progress.nightTriggered = false;
  }

  if (progress.awakeNightSeconds >= AWAKE_NIGHT_CURSE_SECONDS && !progress.nightTriggered) {
    progress.nightTriggered = true;
    activateCurse(player, "desvelo_sombrio");
  }
}

function getProgress(player) {
  let progress = playerProgress.get(player.id);
  if (!progress) {
    progress = {
      playSeconds: 0,
      playTriggered: false,
      swimSeconds: 0,
      swimTriggered: false,
      awakeNightSeconds: 0,
      nightTriggered: false
    };
    playerProgress.set(player.id, progress);
  }

  return progress;
}

function getActiveCurses(player) {
  let states = activeCurses.get(player.id);
  if (!states) {
    states = new Map();
    activeCurses.set(player.id, states);
  }

  return states;
}

function clearCurses(player) {
  const states = activeCurses.get(player.id);
  if (!states || states.size === 0) {
    tell(player, "El Rosario no encuentra ninguna maldicion activa.");
    return;
  }

  states.clear();
  activeCurses.delete(player.id);
  clearNegativeEffects(player);
  tell(player, "El Rosario rompe las maldiciones activas.");
}

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
    launchDroppedItem(player, itemEntity, dropTarget.direction);
  }

  tell(player, "Manos Resbaladizas lanzo objetos fuera de tu inventario.");
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

function launchDroppedItem(player, itemEntity, direction) {
  try {
    itemEntity.applyImpulse({
      x: direction.x * randomFloat(0.18, 0.35),
      y: randomFloat(0.15, 0.3),
      z: direction.z * randomFloat(0.18, 0.35)
    });
  } catch {
    // If this runtime cannot impulse item entities, spawning still drops it.
  }
}

function hiccupJump(player) {
  const height = randomInt(2, 6);

  player.runCommandAsync(`tp @s ~ ~${height} ~`).catch(() => {});
}

function visionPulse(player, state) {
  state.pulseIndex += 1;

  if (state.pulseIndex % 3 === 0) {
    addEffect(player, "blindness", randomInt(3, 6) * TICKS_PER_SECOND, 0);
    tell(player, "Desvelo Sombrio cierra tus ojos por un instante.");
    return;
  }

  addEffect(player, "darkness", randomInt(5, 9) * TICKS_PER_SECOND, 0);
  tell(player, "Desvelo Sombrio oscurece los bordes de tu vision.");
}

function consumeHeldItem(player, typeId) {
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

function getInventory(player) {
  return player.getComponent("minecraft:inventory")?.container;
}

function isPlayerInWater(player) {
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

function isNightInOverworld(player) {
  if (player.dimension.id !== "minecraft:overworld" || typeof world.getTimeOfDay !== "function") {
    return false;
  }

  const timeOfDay = world.getTimeOfDay();
  return timeOfDay >= 13000 && timeOfDay <= 23000;
}

function addEffect(player, effectId, duration, amplifier) {
  try {
    player.addEffect(effectId, duration, {
      amplifier,
      showParticles: false
    });
  } catch {
    player.runCommandAsync(`effect @s ${effectId} ${Math.ceil(duration / TICKS_PER_SECOND)} ${amplifier} true`).catch(() => {});
  }
}

function clearNegativeEffects(player) {
  for (const effectId of ["nausea", "blindness", "darkness", "jump_boost"]) {
    try {
      player.removeEffect(effectId);
    } catch {
      player.runCommandAsync(`effect @s ${effectId} 0 0 true`).catch(() => {});
    }
  }
}

function isOnCooldown(player, typeId) {
  const key = `${player.id}:${typeId}`;
  const now = system.currentTick;
  const previous = useCooldowns.get(key) ?? -100;

  if (now - previous < 10) {
    return true;
  }

  useCooldowns.set(key, now);
  return false;
}

function tell(player, message) {
  try {
    player.onScreenDisplay.setActionBar(message);
  } catch {
    player.sendMessage(message);
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffle(values) {
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
}
