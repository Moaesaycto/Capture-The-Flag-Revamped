package moae.dev.Requests;

import jakarta.validation.constraints.NotBlank;

public class DeclareVictoryRequest {
  @NotBlank(message = "team is required")
  private String team;

  public DeclareVictoryRequest(String team) {
    this.team = team;
  }

  public String getTeam() {
    return team;
  }

  public void setTeam(String team) {
    this.team = team;
  }
}
