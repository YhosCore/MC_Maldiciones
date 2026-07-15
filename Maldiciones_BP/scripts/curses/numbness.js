import { addEffect } from "../utils/effects.js";
import { TICKS_PER_SECOND } from "../utils/constants.js";
import { tell } from "../utils/messages.js";

const NUMBNESS_SECONDS = 30;
const WALKING_PAIN_SECONDS = 15;

export const numbnessCurse = {
  id: "entumecimiento_afk",

  createState() {
    return {
      numbRemaining: NUMBNESS_SECONDS,
      painRemaining: WALKING_PAIN_SECONDS,
      lastPainLocation: undefined,
      slownessCleared: false
    };
  },

  onStart(player, state) {
    state.lastPainLocation = copyLocation(player.location);
    tell(player, "Entumecimiento Maldito duerme tus piernas.");
  },

  tick(player, state) {
    if (state.numbRemaining > 0) {
      addEffect(player, "slowness", TICKS_PER_SECOND * 2, 3);
      state.numbRemaining -= 1;
      return false;
    }

    if (!state.slownessCleared) {
      state.slownessCleared = true;
      removeEffect(player, "slowness");
    }

    if (state.painRemaining <= 0) {
      return true;
    }

    const location = copyLocation(player.location);
    if (hasMovedFrom(state.lastPainLocation, location)) {
      damagePlayerWhenWalking(player);
    }

    state.lastPainLocation = location;
    state.painRemaining -= 1;
    return false;
  },

  onExpire(player) {
    removeEffect(player, "slowness");
    tell(player, "Tus piernas vuelven a responder.");
  },

  onClear(player) {
    removeEffect(player, "slowness");
  }
};

function damagePlayerWhenWalking(player) {
  try {
    player.applyDamage(1);
  } catch {
    player.runCommandAsync("damage @s 1 magic").catch(() => {});
  }
}

function removeEffect(player, effectId) {
  try {
    player.removeEffect(effectId);
  } catch {
    player.runCommandAsync(`effect @s ${effectId} 0 0 true`).catch(() => {});
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
