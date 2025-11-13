package moae.dev.Server;

import jakarta.validation.Valid;
import moae.dev.Game.Game;
import moae.dev.Requests.MessageRequest;
import moae.dev.Requests.SettingsRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/game")
public class GameController {
  private final Game game;

  public GameController(Game game) {
    this.game = game;
  }

  @GetMapping("/health")
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

  @PostMapping("/message/global")
  public Map<String, Integer> messageGlobal(
      @RequestBody MessageRequest req, @AuthenticationPrincipal Jwt jwt) {
    UUID playerId = UUID.fromString(jwt.getSubject());

    if (!game.isValidPlayer(playerId)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player not found");
    }

    Integer msgId;
    try {
      msgId = game.sendMessage(playerId, req.getContent());
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    return Map.of("id", msgId);
  }

  @GetMapping("/message/global")
  public Map<String, Object> getMessages(
      @RequestParam(name = "start", defaultValue = "0") Integer start,
      @RequestParam(name = "count", defaultValue = "10") Integer count,
      @AuthenticationPrincipal Jwt jwt) {

    Game.MessagePage page = game.getMessages(start, count);

    return Map.of(
        "messages", page.messages(),
        "end", page.end());
  }
}
