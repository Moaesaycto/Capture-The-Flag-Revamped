package moae.dev.Server;

import jakarta.validation.Valid;
import moae.dev.App;
import moae.dev.Game.Game;
import moae.dev.Requests.AuthJoinRequest;
import moae.dev.Requests.JoinRequest;
import moae.dev.Requests.LeaveRequest;
import moae.dev.Requests.RemoveRequest;
import moae.dev.Utils.Validation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/player")
public class PlayerController {
  private final JwtEncoder encoder;
  private final PasswordEncoder pe;
  private final long expiryMinutes;
  private final AppSecurityProperties secProps;

  public PlayerController(
      JwtEncoder enc,
      PasswordEncoder pe,
      AppSecurityProperties secProps,
      @Value("${app.jwt.expiry-minutes}") long exp) {
    this.encoder = enc;
    this.pe = pe;
    this.expiryMinutes = exp;
    this.secProps = secProps;
  }

  @PostMapping("/join")
  public Map<String, Object> playerJoin(@Valid @RequestBody JoinRequest body) {
    if (body.isAuth()) {
      if (!secProps.passCheck(body.getPassword())) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect auth password");
      }
    }

    UUID joined = Game.addPlayer(body.getName(), UUID.fromString(body.getTeam()), body.isAuth());
    if (joined == null) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Player already exists in this team");
    }

    var now = Instant.now();
    var claims =
        JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiryMinutes * 60))
            .subject(joined.toString())
            .claim("scope", "api.read api.write")
            .build();

    String token = encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    return Map.of("message", "success", "access_token", token, "token_type", "Bearer");
  }

  // TODO: Add JWT verification, overriden by forced
  @PostMapping("/leave")
  public Map<String, Object> playerLeave(@Valid @RequestBody LeaveRequest body) {
    UUID playerId = Validation.ValidateUUID(body.getId(), "player");

    boolean joined = Game.removePlayer(playerId);
    if (!joined) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Player already exists in this team");
    }

    return Map.of("message", "success");
  }

  @PostMapping("/remove")
  public Map<String, Object> playerRemove(@Valid @RequestBody RemoveRequest body) {
    Game.removePlayer(Validation.ValidateUUID(body.getId(), "player"));
    return Map.of("message", "success");
  }
}
