package moae.dev.Sockets;

import moae.dev.Game.Game;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
  private final Game game;
  private final JwtDecoder jwtDecoder;

  public WebSocketConfig(Game game, JwtDecoder jwtDecoder) {
    this.game = game;
    this.jwtDecoder = jwtDecoder;
  }

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry webSocketHandlerRegistry) {
    webSocketHandlerRegistry
        .addHandler(new StateSocketConnectionHandler(game), "/state")
        .setAllowedOrigins("*");

    webSocketHandlerRegistry
        .addHandler(new SocketConnectionHandler(game), "/global-socket")
        .addInterceptors(new JwtHandshakeInterceptor(jwtDecoder, null, game))
        .setAllowedOrigins("*");

    game.getTeams()
        .forEach(
            t -> {
              webSocketHandlerRegistry
                  .addHandler(
                      new SocketConnectionHandler(game), "/team-socket/" + t.getID().toString())
                  .addInterceptors(new JwtHandshakeInterceptor(jwtDecoder, t.getID(), game))
                  .setAllowedOrigins("*");
            });
  }
}
