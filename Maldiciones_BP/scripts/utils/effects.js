import { TICKS_PER_SECOND } from "./constants.js";

export function addEffect(player, effectId, duration, amplifier) {
  try {
    player.addEffect(effectId, duration, {
      amplifier,
      showParticles: false
    });
  } catch {
    player.runCommandAsync(`effect @s ${effectId} ${Math.ceil(duration / TICKS_PER_SECOND)} ${amplifier} true`).catch(() => {});
  }
}

export function clearNegativeEffects(player) {
  for (const effectId of ["nausea", "blindness", "darkness", "jump_boost", "slowness"]) {
    try {
      player.removeEffect(effectId);
    } catch {
      player.runCommandAsync(`effect @s ${effectId} 0 0 true`).catch(() => {});
    }
  }
}
