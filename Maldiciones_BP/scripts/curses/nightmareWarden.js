import { system } from "@minecraft/server";
import { TICKS_PER_SECOND } from "../utils/constants.js";
import { tell } from "../utils/messages.js";
import { randomFloat } from "../utils/random.js";

const NIGHTMARE_SECONDS = 60;

export const nightmareWardenCurse = {
  id: "pesadilla_del_warden",

  createState() {
    return {
      remaining: NIGHTMARE_SECONDS,
      warden: undefined,
      cleared: false
    };
  },

  onStart(player, state) {
    wakePlayerFromNightmare(player);
    showNightmareWarning(player);

    system.runTimeout(() => {
      if (state.cleared || !isPlayerUsable(player)) {
        return;
      }

      state.warden = spawnNightmareWarden(player);
    }, 2);
  },

  tick(player, state) {
    state.remaining -= 1;

    if (state.remaining <= 5 && state.remaining > 0) {
      showNightmareCountdown(player, state.remaining);
    }

    return state.remaining <= 0;
  },

  onExpire(player, state) {
    removeNightmareWarden(state);
    player.sendMessage("Sobreviviste a la pesadilla. Ya puedes volver a dormir.");
  },

  onClear(_player, state) {
    state.cleared = true;
    removeNightmareWarden(state);
  }
};

function wakePlayerFromNightmare(player) {
  try {
    player.teleport(player.location);
  } catch {
    player.runCommandAsync("damage @s 1 magic").catch(() => {});
  }
}

function showNightmareWarning(player) {
  try {
    player.onScreenDisplay.setTitle("ESCONDETE DE EL", {
      fadeInDuration: 0,
      stayDuration: 60,
      fadeOutDuration: 20
    });
  } catch {
    tell(player, "ESCONDETE DE EL");
  }
}

function showNightmareCountdown(player, seconds) {
  try {
    player.onScreenDisplay.setTitle(`${seconds}`, {
      fadeInDuration: 0,
      stayDuration: TICKS_PER_SECOND,
      fadeOutDuration: 0
    });
  } catch {
    tell(player, `Pesadilla: ${seconds}`);
  }
}

function spawnNightmareWarden(player) {
  const angle = Math.random() * Math.PI * 2;
  const distance = randomFloat(9, 11);
  const location = {
    x: player.location.x + Math.cos(angle) * distance,
    y: player.location.y,
    z: player.location.z + Math.sin(angle) * distance
  };

  try {
    return player.dimension.spawnEntity("minecraft:warden", location);
  } catch {
    player.sendMessage("La pesadilla no encontro espacio para invocar al Warden.");
    return undefined;
  }
}

function removeNightmareWarden(state) {
  const warden = state.warden;
  if (!warden) {
    return;
  }

  try {
    const isValid = typeof warden.isValid === "function" ? warden.isValid() : warden.isValid;
    if (isValid) {
      warden.remove();
    }
  } catch {
    // The Warden may already be dead or unloaded.
  }
}

function isPlayerUsable(player) {
  try {
    return typeof player.isValid === "function" ? player.isValid() : player.isValid;
  } catch {
    return false;
  }
}
