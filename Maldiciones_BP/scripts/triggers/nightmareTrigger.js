import { activateCurse, getCurseState, removeCurse } from "../core/curseManager.js";
import { CURSE_IDS } from "../utils/constants.js";
import { randomInt } from "../utils/random.js";
import { isPlayerSleeping } from "../utils/worldChecks.js";

const NIGHTMARE_CHANCE_DENOMINATOR = 20;
const sleepingState = new Map();

export function tickNightmareTrigger(player) {
  const sleeping = isPlayerSleeping(player);
  const wasSleeping = sleepingState.get(player.id) ?? false;

  if (sleeping && !wasSleeping) {
    sleepingState.set(player.id, true);

    if (!getCurseState(player, CURSE_IDS.WARDEN_NIGHTMARE) && randomInt(1, NIGHTMARE_CHANCE_DENOMINATOR) === 1) {
      activateCurse(player, CURSE_IDS.WARDEN_NIGHTMARE);
    }
    return;
  }

  if (!sleeping && wasSleeping) {
    sleepingState.set(player.id, false);
  }
}

export function handleNightmareDeath(event) {
  const deadEntity = event.deadEntity;
  if (!deadEntity || deadEntity.typeId !== "minecraft:player") {
    return;
  }

  removeCurse(deadEntity, CURSE_IDS.WARDEN_NIGHTMARE);
  sleepingState.delete(deadEntity.id);
}
