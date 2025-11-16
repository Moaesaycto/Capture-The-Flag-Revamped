package moae.dev.Requests;

import jakarta.validation.constraints.NotBlank;
import moae.dev.Game.Game;

public class StateRequest {
  @NotBlank(message = "state is required")
  private Game.State state;

  public Game.State getState() {
    return state;
  }

  public void setState(Game.State state) {
    this.state = state;
  }
}
