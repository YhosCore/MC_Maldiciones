import { randomInt } from "../utils/random.js";

export const risingHiccupCurse = {
  id: "hipo_ascendente",
  silent: true,

  createState() {
    return {
      remaining: 60,
      nextJump: randomInt(3, 8),
      silent: true
    };
  },

  tick(player, state) {
    state.nextJump -= 1;

    if (state.nextJump <= 0) {
      teleportPlayerUp(player);
      state.nextJump = randomInt(2, 7);
    }
  }
};

function teleportPlayerUp(player) {
  const height = randomInt(2, 6);
  const backwardDistance = randomInt(1, 2);
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
