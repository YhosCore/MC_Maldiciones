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
  player.runCommandAsync(`tp @s ~ ~${height} ~`).catch(() => {});
}
