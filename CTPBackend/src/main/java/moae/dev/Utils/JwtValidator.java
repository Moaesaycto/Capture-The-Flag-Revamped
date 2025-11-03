package moae.dev.Utils;

import moae.dev.Game.Game;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public class JwtValidator implements OAuth2TokenValidator<Jwt> {

  @Override
  public OAuth2TokenValidatorResult validate(Jwt token) {
    UUID playerId = UUID.fromString(token.getSubject());
    if (!Game.isValidPlayer(playerId)) {
      OAuth2Error error = new OAuth2Error("invalid_token", "Missing role claim", null);
      return OAuth2TokenValidatorResult.failure(error);
    }
    return OAuth2TokenValidatorResult.success();
  }
}
