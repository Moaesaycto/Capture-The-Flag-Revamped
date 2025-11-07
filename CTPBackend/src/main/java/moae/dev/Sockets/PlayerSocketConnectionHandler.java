package moae.dev.Sockets;

import java.io.IOException;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import moae.dev.Game.Game;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

public class PlayerSocketConnectionHandler extends SocketConnectionHandler {
  private static PlayerSocketConnectionHandler instance;

  public PlayerSocketConnectionHandler(Game game) {
    super(game);
    instance = this;
  }

    @Override
    public void handleMessage(@NonNull WebSocketSession session, @NonNull WebSocketMessage<?> message)
            throws Exception {
      // Do nothing
    }

  private record ChatMessage(String name, String team, boolean auth) {}

  public static void broadcast(String name, String team, boolean auth, String type) {
    if (instance != null) {
      synchronized (instance.webSocketSessions) {
        for (WebSocketSession session : instance.webSocketSessions) {
          try {
            if (session.isOpen()) {
              ChatMessage chatMessage = new ChatMessage(name, team, auth);
              ObjectMapper mapper = new ObjectMapper();
              String jsonMessage = mapper.writeValueAsString(chatMessage);

              session.sendMessage(new TextMessage(type + jsonMessage));
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
