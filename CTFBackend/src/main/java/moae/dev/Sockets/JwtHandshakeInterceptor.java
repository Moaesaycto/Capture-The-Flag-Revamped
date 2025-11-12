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

import java.util.List;
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
    if ("OPTIONS".equalsIgnoreCase(request.getMethod().name())) {
      return true;
    }

    String token = getToken(request);
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

  private static String getToken(ServerHttpRequest request) {
    List<String> authHeaders = request.getHeaders().get("Authorization");
    if (authHeaders != null) {
      for (String h : authHeaders) {
        if (h.startsWith("Bearer ")) return h.substring(7);
      }
    }

    String query = request.getURI().getQuery();
    if (query != null) {
      for (String param : query.split("&")) {
        String[] pair = param.split("=", 2);
        if (pair.length == 2 && "token".equals(pair[0])) {
          return java.net.URLDecoder.decode(pair[1], java.nio.charset.StandardCharsets.UTF_8);
        }
      }
    }

    return null;
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
