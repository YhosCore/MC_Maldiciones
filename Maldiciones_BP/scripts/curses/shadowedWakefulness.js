import { TICKS_PER_SECOND } from "../utils/constants.js";
import { addEffect } from "../utils/effects.js";
import { tell } from "../utils/messages.js";
import { randomInt } from "../utils/random.js";

export const shadowedWakefulnessCurse = {
  id: "desvelo_sombrio",

  createState() {
    return {
      remaining: 4 * 60,
      nextVisionPulse: 1,
      pulseIndex: 0
    };
  },

  onStart(player) {
    tell(player, "La Maldicion de Desvelo Sombrio nubla tu mirada.");
  },

  tick(player, state) {
    state.nextVisionPulse -= 1;

    if (state.nextVisionPulse <= 0) {
      visionPulse(player, state);
      state.nextVisionPulse = randomInt(7, 18);
    }
  }
};

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
