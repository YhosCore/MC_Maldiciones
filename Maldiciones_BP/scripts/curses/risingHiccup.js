import { randomFloat, randomInt } from "../utils/random.js";

export const risingHiccupCurse = {
  id: "hipo_ascendente",
  silent: true,

  createState() {
    return {
      nextJump: randomInt(3, 8),
      silent: true
    };
  },

  tick(player, state) {
    state.nextJump -= 1;

    if (state.nextJump <= 0) {
      teleportPlayerUp(player);
      playHiccupSound(player);
      state.nextJump = randomInt(2, 7);
    }
  }
};

const HICCUP_SOUND_ID = "mal.hiccup";
const HICCUP_SOUND_OPTIONS = {
  volume: 0.75,
  pitch: 1.0
};

function teleportPlayerUp(player) {
  const height = randomInt(1, 3);
  const backwardDistance = randomFloat(0.4, 1);
  const viewDirection = player.getViewDirection();
  const horizontalLength = Math.max(Math.hypot(viewDirection.x, viewDirection.z), 0.001);
  const backward = {
    x: -viewDirection.x / horizontalLength,
    z: -viewDirection.z / horizontalLength
  };

  player.teleport(
    {
      x: player.location.x + backward.x * backwardDistance,
      y: player.location.y + height,
      z: player.location.z + backward.z * backwardDistance
    },
    {
      dimension: player.dimension,
      rotation: player.getRotation()
    }
  );
}

function playHiccupSound(player) {
  try {
    player.dimension.playSound(HICCUP_SOUND_ID, player.location, HICCUP_SOUND_OPTIONS);
  } catch {
    // If the custom sound is not loaded, the hiccup effect still runs.
  }
}
