package moae.dev.Server;

import moae.dev.Game.Game;
import moae.dev.Game.Team;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

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

  @PostMapping("/join")
  public Map<String, Object> playerJoin(@RequestBody Map<String, String> body) {
    UUID teamId;
    try {
      teamId = UUID.fromString(body.get("team"));
    } catch (IllegalArgumentException e) {
      // return 422 Unprocessable Entity
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Not a valid team UUID");
    }

    Team team = this.game.getTeam(teamId);
    if (team == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found");
    }

    boolean joined = this.game.addPlayer(body.get("name"), team.getID());
    if (!joined) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Player already exists in this team");
    }

    return Map.of("message", "success");
  }
}
