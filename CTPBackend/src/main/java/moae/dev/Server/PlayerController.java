package moae.dev.Server;

import jakarta.validation.Valid;
import moae.dev.Game.Game;
import moae.dev.Requests.JoinRequest;
import moae.dev.Requests.RemoveRequest;
import moae.dev.Utils.Validation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
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
  private final Game game;
  private final Validation validator;

  public PlayerController(
      JwtEncoder enc,
      PasswordEncoder pe,
      AppSecurityProperties secProps,
      Game game,
      Validation validation,
      @Value("${app.jwt.expiry-minutes}") long exp) {
    this.encoder = enc;
    this.pe = pe;
    this.expiryMinutes = exp;
    this.secProps = secProps;
    this.game = game;
    this.validator = validation;
  }

  @PostMapping("/join")
  public Map<String, Object> playerJoin(@Valid @RequestBody JoinRequest body) {
    if (body.isAuth()) {
      if (!secProps.passCheck(body.getPassword())) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect auth password");
      }
    }

    UUID joined = game.addPlayer(body.getName(), UUID.fromString(body.getTeam()), body.isAuth());
    if (joined == null) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Player already exists in this team");
    }

    String jti = UUID.randomUUID().toString();

    var now = Instant.now();
    var claims =
        JwtClaimsSet.builder()
            .issuer("CTF-Backend")
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiryMinutes * 60))
            .id(jti)
            .subject(joined.toString())
            .claim("scope", "api.read api.write")
            .build();

    var header = JwsHeader.with(MacAlgorithm.HS256).build();
    String token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    return Map.of("message", "success", "access_token", token, "token_type", "Bearer");
  }

  @GetMapping("/me")
  public Map<String, Object> playerInfo(@AuthenticationPrincipal Jwt jwt) {
    UUID playerId = UUID.fromString(jwt.getSubject());
    return game.getPlayer(playerId).toMap();
  }

  @DeleteMapping("/leave")
  public Map<String, Object> playerLeave(@AuthenticationPrincipal Jwt jwt) {
    UUID playerId = validator.ValidateUUID(jwt.getSubject(), "player");
    boolean removed = game.removePlayer(playerId);
    if (!removed) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Player not found");
    }

    return Map.of("message", "success");
  }

  @DeleteMapping("/remove")
  public Map<String, Object> playerRemove(
      @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody RemoveRequest body) {

    if (!game.getPlayer(UUID.fromString(jwt.getSubject())).isAuth()) {
      throw new ResponseStatusException(
          HttpStatus.UNAUTHORIZED, "You are not authorized to do this");
    }

    game.removePlayer(validator.ValidateUUID(body.getId(), "player"));
    return Map.of("message", "success");
  }
}
