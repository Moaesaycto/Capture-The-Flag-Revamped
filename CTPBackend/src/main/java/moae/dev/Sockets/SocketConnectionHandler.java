package moae.dev.Sockets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.lang.NonNull;

public class SocketConnectionHandler extends TextWebSocketHandler {
  public static final List<WebSocketSession> webSocketSessions =
      Collections.synchronizedList(new ArrayList<>());
  private static final Logger logger = LoggerFactory.getLogger(SocketConnectionHandler.class);

  @Override
  public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
    super.afterConnectionEstablished(session);
    System.out.println(session.getId() + " Connected");
    webSocketSessions.add(session);
  }

  @Override
  public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status)
      throws Exception {
    super.afterConnectionClosed(session, status);
    System.out.println(session.getId() + " Disconnected");
    webSocketSessions.remove(session);
  }

  public static void broadcast(String message) {
    synchronized (webSocketSessions) {
      for (WebSocketSession session : webSocketSessions) {
        try {
          if (session.isOpen()) {
            session.sendMessage(new TextMessage(message));
          }
        } catch (IOException e) {
          logger.error("Error sending broadcast message to session {}", session.getId(), e);
        }
      }
    }
  }

  @PreDestroy
  public void cleanup() {
    // No cleanup needed just yet
  }
}
