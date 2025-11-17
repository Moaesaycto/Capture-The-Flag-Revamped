package moae.dev.Utils;

import moae.dev.Game.Game;

public record StateMessage(Game.State state, long duration) {}
