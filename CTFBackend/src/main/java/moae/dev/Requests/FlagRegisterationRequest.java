package moae.dev.Requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FlagRegisterationRequest {
  @NotNull(message = "x position is required")
  private Integer x;

  @NotNull(message = "y position is required")
  private Integer y;

  @NotBlank(message = "team is required")
  private String team;

  FlagRegisterationRequest(Integer x, Integer y, String team) {
    this.x = x;
    this.y = y;
    this.team = team;
  }

  public Integer getY() {
    return y;
  }

  public void setY(Integer y) {
    this.y = y;
  }

  public Integer getX() {
    return x;
  }

  public void setX(Integer x) {
    this.x = x;
  }

  public String getTeam() {
    return team;
  }

  public void setTeam(String team) {
    this.team = team;
  }
}
