package moae.dev.Sockets;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import moae.dev.Game.Game;
import moae.dev.Utils.AnnouncementMessage;
import moae.dev.Utils.StateMessage;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

public class AnnouncementSocketConnectionHandler extends SocketConnectionHandler {
  private static AnnouncementSocketConnectionHandler instance;

  public AnnouncementSocketConnectionHandler(Game game) {
    super(game);
    instance = this;
  }

  @Override
  public void handleMessage(
      @NonNull WebSocketSession session, @NonNull WebSocketMessage<?> message) {}

  public static void broadcast(AnnouncementMessage message) {
    ObjectMapper mapper = new ObjectMapper();
    String json;

    try {
      json = mapper.writeValueAsString(message);
    } catch (Exception e) {
      return;
    }

    if (instance != null) {
      synchronized (instance.webSocketSessions) {
        for (WebSocketSession session : instance.webSocketSessions) {
          try {
            if (session.isOpen()) {
              session.sendMessage(new TextMessage(json));
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
