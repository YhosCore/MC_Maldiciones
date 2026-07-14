import { shadowedWakefulnessCurse } from "./shadowedWakefulness.js";
import { risingHiccupCurse } from "./risingHiccup.js";
import { slipperyHandsCurse } from "./slipperyHands.js";

export const curseDefinitions = new Map([
  [slipperyHandsCurse.id, slipperyHandsCurse],
  [risingHiccupCurse.id, risingHiccupCurse],
  [shadowedWakefulnessCurse.id, shadowedWakefulnessCurse]
]);
