import { curseDefinitions } from "../curses/index.js";
import { clearNegativeEffects } from "../utils/effects.js";

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
    const definition = curseDefinitions.get(curseId);
    if (definition?.tick(player, state)) {
      definition.onExpire?.(player, state);
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
    return false;
  }

  for (const [curseId, state] of states) {
    curseDefinitions.get(curseId)?.onClear?.(player, state);
  }

  states.clear();
  activeCurses.delete(player.id);
  clearNegativeEffects(player);
  return true;
}

export function getCurseState(player, curseId) {
  return activeCurses.get(player.id)?.get(curseId);
}

export function removeCurse(player, curseId) {
  const states = activeCurses.get(player.id);
  const state = states?.get(curseId);
  if (!states || !state) {
    return;
  }

  curseDefinitions.get(curseId)?.onClear?.(player, state);
  states.delete(curseId);

  if (states.size === 0) {
    activeCurses.delete(player.id);
  }
}

function getActiveCurses(player) {
  let states = activeCurses.get(player.id);
  if (!states) {
    states = new Map();
    activeCurses.set(player.id, states);
  }

  return states;
}
