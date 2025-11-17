package moae.dev.Server;

import jakarta.validation.Valid;
import moae.dev.Game.Game;
import moae.dev.Requests.MessageRequest;
import moae.dev.Requests.ResetRequest;
import moae.dev.Requests.SettingsRequest;
import moae.dev.Utils.MessagePage;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

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

  @RequirePlayerAuth
  @PatchMapping("/settings")
  public Map<String, Object> editSettings(@Valid @RequestBody SettingsRequest settings) {
    this.game.merge(settings);
    return Map.of("message", "success");
  }

  @PostMapping("/message/global")
  public Map<String, Integer> messageGlobal(
      @RequestBody MessageRequest req, @AuthenticationPrincipal Jwt jwt) {
    Integer msgId = game.sendMessage(UUID.fromString(jwt.getSubject()), req.getContent());
    return Map.of("id", msgId);
  }

  @GetMapping("/message/global")
  public Map<String, Object> getMessages(
      @RequestParam(name = "start", defaultValue = "0") Integer start,
      @RequestParam(name = "count", defaultValue = "10") Integer count,
      @AuthenticationPrincipal Jwt jwt) {

    MessagePage page = game.getMessages(start, count);

    return Map.of(
        "messages", page.messages(),
        "end", page.end());
  }

  @RequirePlayerAuth
  @PostMapping("/control/start")
  public Map<String, Object> startGame(@AuthenticationPrincipal Jwt jwt) {
    game.start();
    return Map.of("message", "success");
  }

  @RequirePlayerAuth
  @PostMapping("/control/pause")
  public Map<String, Object> pauseGame(@AuthenticationPrincipal Jwt jwt) {
    game.pause();
    return Map.of("message", "success");
  }

  @RequirePlayerAuth
  @PostMapping("/control/resume")
  public Map<String, Object> resumeGame(@AuthenticationPrincipal Jwt jwt) {
    game.resume();
    return Map.of("message", "success");
  }

  @RequirePlayerAuth
  @PostMapping("/control/skip")
  public Map<String, Object> skipGame(@AuthenticationPrincipal Jwt jwt) {
    game.skip();
    return Map.of("message", "success");
  }

  @RequirePlayerAuth
  @PostMapping("/control/rewind")
  public Map<String, Object> rewindGame(@AuthenticationPrincipal Jwt jwt) {
    game.rewind();
    return Map.of("message", "success");
  }

  @RequirePlayerAuth
  @PostMapping("/control/end")
  public Map<String, Object> endGame(@AuthenticationPrincipal Jwt jwt) {
    game.end();
    return Map.of("message", "success");
  }

  @RequirePlayerAuth
  @PostMapping("/control/reset")
  public Map<String, Object> resetGame(
      @RequestBody ResetRequest req, @AuthenticationPrincipal Jwt jwt) {
    game.reset(req.isHard());
    return Map.of("message", "success");
  }
}
