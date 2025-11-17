package moae.dev.Server;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import moae.dev.Game.Game;

import java.util.UUID;

@Aspect
@Component
public class PlayerAuthAspect {

  @Before("@annotation(RequirePlayerAuth) && args(jwt,..)")
  public void checkAuth(Jwt jwt, Game game) {
    UUID id = UUID.fromString(jwt.getSubject());
    if (!game.isAuth(id)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player not found");
    }
  }
}
