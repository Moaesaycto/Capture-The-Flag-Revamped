package moae.dev.Requests;

import jakarta.validation.constraints.NotNull;

public class LeaveRequest {
  @NotNull(message = "a valid UUID is required")
  private String id;

  private boolean forced = false;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public boolean isForced() {
    return forced;
  }

  public void setForced(boolean forced) {
    this.forced = forced;
  }
}
