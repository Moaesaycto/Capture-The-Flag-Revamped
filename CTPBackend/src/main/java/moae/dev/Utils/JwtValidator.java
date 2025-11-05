package moae.dev.Utils;

import moae.dev.Game.Game;
import moae.dev.Game.Player;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class JwtValidator implements OAuth2TokenValidator<Jwt> {
  private final Game game;

  public JwtValidator(Game game) {
    this.game = game;
  }

  @Override
  public OAuth2TokenValidatorResult validate(Jwt token) {
    UUID playerId = UUID.fromString(token.getSubject());
    if (!game.isValidPlayer(playerId)) {
      OAuth2Error error = new OAuth2Error("invalid_token", "Missing role claim", null);
      return OAuth2TokenValidatorResult.failure(error);
    }

    Player player = game.getPlayer(playerId);
    return OAuth2TokenValidatorResult.success();
  }
}
