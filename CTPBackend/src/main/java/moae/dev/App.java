package moae.dev;

import jakarta.validation.Valid;
import moae.dev.Game.Game;
import moae.dev.Game.Team;
import moae.dev.Requests.JoinRequest;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@SpringBootApplication
@RestController
public class App {
  private final Game game = new Game();

  @GetMapping("/")
  public Map<String, String> health() {
    return Map.of("message", "success");
  }

  @GetMapping("/status")
  public Map<String, Object> status() {
    return game.status();
  }

  @PostMapping("/player/join")
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

  public static void main(String[] args) {
    SpringApplication.run(App.class, args);
  }
}
