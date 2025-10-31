package moae.dev.Server;

import jakarta.validation.Valid;
import moae.dev.Game.Game;
import moae.dev.Game.Team;
import moae.dev.Requests.JoinRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
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

  @PostMapping("/join")
  public Map<String, Object> playerJoin(@Valid @RequestBody JoinRequest req) {
    Team team = this.game.getTeam(req.getTeam());

    if (team == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found");
    }

    boolean joined = this.game.addPlayer(req.getName(), team.getID());

    if (joined) {
      return Map.of("message", "success");
    }

    throw new ResponseStatusException(
        HttpStatus.NOT_FOUND, "Player with that name already exists in team " + team.getName());
  }
}
