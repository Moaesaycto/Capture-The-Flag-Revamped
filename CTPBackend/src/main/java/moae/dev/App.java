package moae.dev;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@SpringBootApplication
@RestController
public class App {
  @GetMapping("/")
  public Map<String, String> health() {
    return Map.of("message", "success");
  }

  @GetMapping("/status")
  public Map<String, Object> status() {
      return Map.of("Players", "test");
  }

  public static void main(String[] args) {
    SpringApplication.run(App.class, args);
  }
}
