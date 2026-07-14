export const TICKS_PER_SECOND = 20;

export const CURSE_IDS = {
  SLIPPERY_HANDS: "manos_resbaladizas",
  RISING_HICCUP: "hipo_ascendente",
  SHADOWED_WAKEFULNESS: "desvelo_sombrio",
  WARDEN_NIGHTMARE: "pesadilla_del_warden"
};

export const SCROLL_TO_CURSE = {
  "mal:pergamino_vertigo_errante": CURSE_IDS.SLIPPERY_HANDS,
  "mal:pergamino_hipo_ascendente": CURSE_IDS.RISING_HICCUP,
  "mal:pergamino_desvelo_sombrio": CURSE_IDS.SHADOWED_WAKEFULNESS
};

export const CLEANSING_ITEMS = new Set(["mal:limpia"]);
