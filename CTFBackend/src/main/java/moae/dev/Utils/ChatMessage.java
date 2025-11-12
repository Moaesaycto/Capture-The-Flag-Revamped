package moae.dev.Utils;

import moae.dev.Game.Player;

import java.util.Date;
import java.util.UUID;

public record ChatMessage(String message, Player player, Integer messageId, Date time, UUID team) {}
