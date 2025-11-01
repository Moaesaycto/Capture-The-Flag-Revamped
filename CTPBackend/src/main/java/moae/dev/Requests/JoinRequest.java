package moae.dev.Requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class JoinRequest {
  @NotBlank(message = "name is required")
  private String name;

  @NotNull(message = "team is required")
  private String team;

  public JoinRequest() {}

  public JoinRequest(String name, String team) {
    this.name = name;
    this.team = team;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getTeam() {
    return team;
  }

  public void setTeam(String team) {
    this.team = team;
  }
}
