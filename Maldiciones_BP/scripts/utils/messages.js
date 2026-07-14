export function tell(player, message) {
  try {
    player.onScreenDisplay.setActionBar(message);
  } catch {
    player.sendMessage(message);
  }
}
