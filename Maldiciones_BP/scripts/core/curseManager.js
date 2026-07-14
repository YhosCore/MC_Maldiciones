import { curseDefinitions } from "../curses/index.js";
import { clearNegativeEffects } from "../utils/effects.js";
import { tell } from "../utils/messages.js";

const activeCurses = new Map();

export function activateCurse(player, curseId) {
  const definition = curseDefinitions.get(curseId);
  if (!definition) {
    return;
  }

  const state = {
    id: curseId,
    ...definition.createState()
  };

  getActiveCurses(player).set(curseId, state);
  definition.onStart?.(player, state);
}

export function tickPlayerCurses(player) {
  const states = activeCurses.get(player.id);
  if (!states) {
    return;
  }

  for (const [curseId, state] of states) {
    if (tickCurse(player, state)) {
      states.delete(curseId);
    }
  }

  if (states.size === 0) {
    activeCurses.delete(player.id);
  }
}

export function clearCurses(player) {
  const states = activeCurses.get(player.id);
  if (!states || states.size === 0) {
    tell(player, "La Limpia Huevo no encuentra ninguna maldicion activa.");
    return;
  }

  states.clear();
  activeCurses.delete(player.id);
  clearNegativeEffects(player);
  tell(player, "La Limpia Huevo rompe las maldiciones activas.");
}

function tickCurse(player, state) {
  state.remaining -= 1;

  if (state.remaining <= 0) {
    if (!state.silent) {
      tell(player, "La maldicion se ha disipado.");
    }
    return true;
  }

  curseDefinitions.get(state.id)?.tick(player, state);
  return false;
}

function getActiveCurses(player) {
  let states = activeCurses.get(player.id);
  if (!states) {
    states = new Map();
    activeCurses.set(player.id, states);
  }

  return states;
}
