package moae.dev.Server;

import jakarta.validation.Valid;
import moae.dev.Game.Game;
import moae.dev.Requests.DeclareVictoryRequest;
import moae.dev.Utils.Validation;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@Configuration
@RequestMapping("/team")
public class TeamController {
  private final Game game;
  private final Validation validator;

  public TeamController(Game game, Validation validation) {
    this.game = game;
    this.validator = validation;
  }

  @PostMapping("/declare")
  public Map<String, String> declareVictory(@Valid @RequestBody DeclareVictoryRequest req) {
    UUID team = validator.ValidateUUID(req.getTeam(), "team");

    try {
      game.declareVictory(team);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
    }

    return Map.of("message", "success");
  }
}
