package moae.dev.Server;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ResponseStatusException.class)
  public Map<String, Object> handleResponseStatusException(
      ResponseStatusException ex, HttpServletResponse response) {
    response.setStatus(ex.getStatusCode().value());
    assert ex.getReason() != null;
    return Map.of("message", ex.getReason());
  }
}
