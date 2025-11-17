package moae.dev.Utils;

import moae.dev.Game.Game;

public class StateMessage {
  private final Game.State state;
  private final long duration;
  private final boolean paused;

  public StateMessage(Game.State state, long duration, boolean paused) {
    this.state = state;
    this.duration = duration;
    this.paused = paused;
  }

  public Game.State getState() {
    return state;
  }

  public long getDuration() {
    return duration;
  }

  public boolean isPaused() {
    return paused;
  }
}
