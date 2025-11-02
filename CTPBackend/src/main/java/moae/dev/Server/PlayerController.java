package moae.dev.Server;

import jakarta.validation.Valid;
import moae.dev.Game.Game;
import moae.dev.Requests.JoinRequest;
import moae.dev.Requests.LeaveRequest;
import moae.dev.Utils.Validation;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/player")
public class PlayerController {
  // TODO: Add JWT creation
  @PostMapping("/join")
  public static Map<String, Object> playerJoin(@Valid @RequestBody JoinRequest body) {
    UUID teamId = Validation.ValidateUUID(body.getTeam(), "team");

    boolean joined = Game.addPlayer(body.getName(), teamId);
    if (!joined) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Player already exists in this team");
    }

    return Map.of("message", "success");
  }

  // TODO: Add JWT verification, overriden by forced
  @PostMapping("/leave")
  public static Map<String, Object> playerLeave(@Valid @RequestBody LeaveRequest body) {
    UUID playerId = Validation.ValidateUUID(body.getId(), "player");

    boolean joined = Game.removePlayer(playerId);
    if (!joined) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Player already exists in this team");
    }

    return Map.of("message", "success");
  }
}
