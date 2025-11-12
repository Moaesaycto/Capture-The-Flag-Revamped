package moae.dev.Server;

import jakarta.validation.Valid;
import moae.dev.Game.Game;
import moae.dev.Game.Team;
import moae.dev.Requests.DeclareVictoryRequest;
import moae.dev.Requests.MessageRequest;
import moae.dev.Requests.TeamGetRequest;
import moae.dev.Utils.Validation;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/team")
public class TeamController {
  private final Game game;
  private final Validation validator;

  public TeamController(Game game, Validation validation) {
    this.game = game;
    this.validator = validation;
  }

  @GetMapping("/info/{teamId}")
  public Map<String, Object> getTeam(@PathVariable("teamId") UUID teamId) {
    Team team = game.getTeam(teamId);

    if (team == null)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid team UUID");

    return team.toMap();
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

  @PostMapping("/message/{teamId}")
  public Map<String, Integer> sendMessage(
      @PathVariable("teamId") UUID teamId,
      @RequestBody MessageRequest req,
      @AuthenticationPrincipal Jwt jwt) {

    UUID playerId = UUID.fromString(jwt.getSubject());

    if (!game.isValidPlayer(playerId)) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player not found");
    }

    if (!game.isPlayerOnTeam(playerId, teamId)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sender is not in this team");
    }

    Integer msgId;
    try {
      msgId = game.sendTeamMessage(teamId, playerId, req.getContent());
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    return Map.of("id", msgId);
  }
}
