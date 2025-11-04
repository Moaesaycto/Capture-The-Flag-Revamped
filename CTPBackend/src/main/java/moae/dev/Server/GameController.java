package moae.dev.Server;

import jakarta.validation.Valid;
import moae.dev.Game.Game;
import moae.dev.Requests.SettingsRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/game")
public class GameController {
  private final Game game;

  public GameController(Game game) {
    this.game = game;
  }

  @GetMapping("/")
  public Map<String, String> health() {
    return Map.of("message", "success");
  }

  @GetMapping("/status")
  public Map<String, Object> status() {
    return game.status();
  }

  @PatchMapping("/settings")
  public Map<String, Object> editSettings(@Valid @RequestBody SettingsRequest settings) {
    this.game.merge(settings);
    return Map.of("message", "success");
  }
}
