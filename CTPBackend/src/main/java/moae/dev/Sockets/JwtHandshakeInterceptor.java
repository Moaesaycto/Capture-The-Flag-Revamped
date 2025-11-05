package moae.dev.Sockets;

import moae.dev.Game.Player;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import moae.dev.Game.Game;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.UUID;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {
  private final UUID team;
  private final Game game;
  private final JwtDecoder jwtDecoder;
  private final JwtAuthenticationConverter jwtAuthenticationConverter =
      new JwtAuthenticationConverter();

  public JwtHandshakeInterceptor(JwtDecoder jwtDecoder, UUID team, Game game) {
    this.jwtDecoder = jwtDecoder;
    this.team = team;
    this.game = game;
  }

  @Override
  public boolean beforeHandshake(
      @NonNull ServerHttpRequest request,
      @NonNull ServerHttpResponse response,
      @NonNull WebSocketHandler wsHandler,
      @NonNull Map<String, Object> attributes)
      throws Exception {

    String token = null;
    if (request instanceof ServletServerHttpRequest servletReq) {
      HttpServletRequest httpReq = servletReq.getServletRequest();
      String auth = httpReq.getHeader("Authorization");
      if (auth != null && auth.startsWith("Bearer ")) {
        token = auth.substring(7);
      }
    }

    if (token == null || token.isBlank()) return false;

    Jwt jwt;
    try {
      jwt = jwtDecoder.decode(token);
      Authentication auth = jwtAuthenticationConverter.convert(jwt);
      attributes.put("jwt", jwt);
      attributes.put("auth", auth);
      attributes.put("raw_token", token);
    } catch (JwtException ex) {
      return false;
    }

    Player player = game.getPlayer(UUID.fromString(jwt.getSubject()));
    return player.isAuth() || (team == null || player.isOnTeam(team));
  }

  @Override
  public void afterHandshake(
      @NonNull ServerHttpRequest request,
      @NonNull ServerHttpResponse response,
      @NonNull WebSocketHandler wsHandler,
      Exception exception) {
    // no-op
  }
}
