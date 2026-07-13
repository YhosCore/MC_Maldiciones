import { activateCurse } from "../core/curseManager.js";
import { CURSE_IDS } from "../utils/constants.js";
import { isNightInOverworld, isPlayerInWater } from "../utils/worldChecks.js";

const PLAY_TIME_CURSE_SECONDS = 30 * 60;
const SWIM_CURSE_SECONDS = 60;
const AWAKE_NIGHT_CURSE_SECONDS = 8 * 60;

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
}

function getProgress(player) {
  let progress = playerProgress.get(player.id);
  if (!progress) {
    progress = {
      playSeconds: 0,
      swimSeconds: 0,
      swimTriggered: false,
      awakeNightSeconds: 0,
      nightTriggered: false
    };
    playerProgress.set(player.id, progress);
  }

  return progress;
}
