package moae.dev.Requests;

import jakarta.validation.constraints.NotBlank;

public class MessageRequest {
  @NotBlank(message = "message content is required")
  private String content;

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }
}
