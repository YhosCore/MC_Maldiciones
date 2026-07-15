import { activateCurse, getCurseState } from "../core/curseManager.js";
import { CURSE_IDS } from "../utils/constants.js";
import { isNightInOverworld, isPlayerInWater, isPlayerSleeping } from "../utils/worldChecks.js";

const PLAY_TIME_CURSE_SECONDS = 30 * 60;
const SWIM_CURSE_SECONDS = 60;
const AWAKE_NIGHT_CURSE_SECONDS = 8 * 60;
const AFK_CURSE_SECONDS = 90;

const playerProgress = new Map();

export function tickAutomaticTriggers(player) {
  const progress = getProgress(player);

  progress.playSeconds += 1;
  if (progress.playSeconds >= PLAY_TIME_CURSE_SECONDS) {
    progress.playSeconds = 0;
    activateCurse(player, CURSE_IDS.SLIPPERY_HANDS);
  }

  if (isPlayerInWater(player)) {
    progress.swimSeconds += 1;
  } else {
    progress.swimSeconds = 0;
    progress.swimTriggered = false;
  }

  if (progress.swimSeconds >= SWIM_CURSE_SECONDS && !progress.swimTriggered) {
    progress.swimTriggered = true;
    activateCurse(player, CURSE_IDS.RISING_HICCUP);
  }

  if (isNightInOverworld(player)) {
    progress.awakeNightSeconds += 1;
  } else {
    progress.awakeNightSeconds = 0;
    progress.nightTriggered = false;
  }

  if (progress.awakeNightSeconds >= AWAKE_NIGHT_CURSE_SECONDS && !progress.nightTriggered) {
    progress.nightTriggered = true;
    activateCurse(player, CURSE_IDS.SHADOWED_WAKEFULNESS);
  }

  tickAfkTrigger(player, progress);
}

function getProgress(player) {
  let progress = playerProgress.get(player.id);
  if (!progress) {
    progress = {
      playSeconds: 0,
      swimSeconds: 0,
      swimTriggered: false,
      awakeNightSeconds: 0,
      nightTriggered: false,
      afkSeconds: 0,
      afkTriggered: false,
      lastAfkLocation: undefined
    };
    playerProgress.set(player.id, progress);
  }

  return progress;
}

function tickAfkTrigger(player, progress) {
  const location = copyLocation(player.location);
  if (!progress.lastAfkLocation) {
    progress.lastAfkLocation = location;
    return;
  }

  const hasMoved = hasMovedFrom(progress.lastAfkLocation, location);
  progress.lastAfkLocation = location;

  if (hasMoved || isPlayerSleeping(player)) {
    progress.afkSeconds = 0;
    progress.afkTriggered = false;
    return;
  }

  if (progress.afkTriggered || getCurseState(player, CURSE_IDS.NUMBNESS)) {
    return;
  }

  progress.afkSeconds += 1;
  if (progress.afkSeconds >= AFK_CURSE_SECONDS) {
    progress.afkSeconds = 0;
    progress.afkTriggered = true;
    activateCurse(player, CURSE_IDS.NUMBNESS);
  }
}

function copyLocation(location) {
  return { x: location.x, y: location.y, z: location.z };
}

function hasMovedFrom(previous, current) {
  const xDifference = current.x - previous.x;
  const zDifference = current.z - previous.z;
  return xDifference * xDifference + zDifference * zDifference > 0.0025;
}
