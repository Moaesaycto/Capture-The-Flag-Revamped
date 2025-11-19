package moae.dev.Requests;

import jakarta.validation.constraints.NotNull;

public class AnnouncementRequest {
  @NotNull(message = "A valid type is required")
  private String type;

  private String message;

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
