package moae.dev.Requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AuthJoinRequest {
  @NotBlank(message = "name is required")
  private String name;

  @NotNull(message = "team is required")
  private String team;

  @NotNull(message = "password is required")
  private String password;

  public AuthJoinRequest() {}

  public AuthJoinRequest(String name, String team, String password) {
    this.name = name;
    this.team = team;
    this.password = password;
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

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
