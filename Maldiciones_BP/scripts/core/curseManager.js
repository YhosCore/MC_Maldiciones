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
    curseDefinitions.get(curseId)?.tick(player, state);
  }
}

export function clearCurses(player) {
  const states = activeCurses.get(player.id);
  if (!states || states.size === 0) {
    tell(player, "La Limpia no encuentra ninguna maldicion activa.");
    return;
  }

  states.clear();
  activeCurses.delete(player.id);
  clearNegativeEffects(player);
  tell(player, "La Limpia rompe las maldiciones activas.");
}

function getActiveCurses(player) {
  let states = activeCurses.get(player.id);
  if (!states) {
    states = new Map();
    activeCurses.set(player.id, states);
  }

  return states;
}
