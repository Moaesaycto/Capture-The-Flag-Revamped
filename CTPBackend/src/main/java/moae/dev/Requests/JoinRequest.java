package moae.dev.Requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class JoinRequest {
  @NotBlank(message = "name is required")
  private String name;

  @NotNull(message = "team is required")
  private UUID team;

  public JoinRequest() {}

  public JoinRequest(String name, UUID team) {
    this.name = name;
    this.team = team;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public UUID getTeam() {
    return team;
  }

  public void setTeam(UUID team) {
    this.team = team;
  }
}
