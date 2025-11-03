package moae.dev.Requests;

import jakarta.validation.constraints.NotNull;

public class RemoveRequest {
  @NotNull(message = "A valid UUID is required")
  private String id;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }
}
