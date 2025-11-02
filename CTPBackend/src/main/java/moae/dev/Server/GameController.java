package moae.dev.Server;

import moae.dev.Game.Game;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/game")
public class GameController {
  private final AppConfig config;
  private final Game game = new Game();

  public GameController(AppConfig config) {
    this.config = config;

    this.config.getTeams().stream()
        .limit(config.getGame().getMaxTeams())
        .forEach(t -> this.game.registerTeam(t.getName(), t.getColor()));
  }

  @GetMapping("/")
  public Map<String, String> health() {
    return Map.of("message", "success");
  }

  @GetMapping("/status")
  public Map<String, Object> status() {
    return game.status();
  }


}
