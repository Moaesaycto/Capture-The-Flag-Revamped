package moae.dev.Sockets;

import moae.dev.Game.Game;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.lang.NonNull;

import java.io.IOException;

public class StateSocketConnectionHandler extends SocketConnectionHandler {
  private static StateSocketConnectionHandler instance;

  public StateSocketConnectionHandler(Game game) {
    super(game);
    instance = this;
  }

  @Override
  public void handleMessage(
      @NonNull WebSocketSession session, @NonNull WebSocketMessage<?> message) {
    // Do nothing
  }

  public static void broadcast(String message) {
    if (instance != null) {
      synchronized (instance.webSocketSessions) {
        for (WebSocketSession session : instance.webSocketSessions) {
          try {
            if (session.isOpen()) {
              session.sendMessage(new TextMessage(message));
            }
          } catch (IOException e) {
            instance.logger.error(
                "Error sending broadcast message to session {}", session.getId(), e);
          }
        }
      }
    }
  }
}
