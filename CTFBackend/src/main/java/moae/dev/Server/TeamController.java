package moae.dev.Server;

import jakarta.validation.Valid;
import moae.dev.Game.Game;
import moae.dev.Game.Player;
import moae.dev.Game.Team;
import moae.dev.Requests.DeclareVictoryRequest;
import moae.dev.Requests.FlagRegisterationRequest;
import moae.dev.Requests.MessageRequest;
import moae.dev.Requests.TeamGetRequest;
import moae.dev.Utils.MessagePage;
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
  public Map<String, Object> getTeam(
      @PathVariable("teamId") UUID teamId, @AuthenticationPrincipal Jwt jwt) {
    Team team = game.getTeam(teamId);

    if (team == null)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid team UUID");

    UUID playerId = validator.ValidateUUID(jwt.getSubject(), "player");
    if (!game.isPlayerOnTeam(playerId, teamId))
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not on this team.");

    return team.toMap(true);
  }

  @PostMapping("/declare/victory")
  public Map<String, String> declareVictory(
      @Valid @RequestBody DeclareVictoryRequest req, @AuthenticationPrincipal Jwt jwt) {
    UUID team = validator.ValidateUUID(req.getTeam(), "team");

    UUID playerId = validator.ValidateUUID(jwt.getSubject(), "player");
    if (!game.isPlayerOnTeam(playerId, team))
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not on this team.");

    game.declareVictory(team);

    return Map.of("message", "success");
  }

  @PostMapping("/flag/location")
  public Map<String, String> registerFlag(
      @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody FlagRegisterationRequest req) {
    UUID team = validator.ValidateUUID(req.getTeam(), "team");
    UUID playerId = validator.ValidateUUID(jwt.getSubject(), "player");

    if (!game.isPlayerOnTeam(playerId, team))
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not on this team.");

    game.registerFlag(team, req.getX(), req.getY());

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

  @GetMapping("/message/{teamId}")
  public Map<String, Object> getMessages(
      @PathVariable("teamId") UUID teamId,
      @RequestParam(name = "start", defaultValue = "0") Integer start,
      @RequestParam(name = "count", defaultValue = "0") Integer count,
      @AuthenticationPrincipal Jwt jwt) {
    UUID playerId = UUID.fromString(jwt.getSubject());

    if (!game.isValidPlayer(playerId)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player not found");
    }

    if (!game.isValidTeam(teamId)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team not found");
    }

    game.isPlayerOnTeam(playerId, teamId);

    Team team = game.getTeam(teamId);
    MessagePage page = team.getMessages(start, count);

    return Map.of(
        "messages", page.messages(),
        "end", page.end());
  }
}
