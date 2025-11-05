package moae.dev.Sockets;

import com.fasterxml.jackson.databind.ObjectMapper;
import moae.dev.Game.Game;
import moae.dev.Game.Player;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class TeamSocketConnectionHandler extends TextWebSocketHandler {
  public final List<WebSocketSession> webSocketSessions =
      Collections.synchronizedList(new ArrayList<>());
  private final Logger logger = LoggerFactory.getLogger(TeamSocketConnectionHandler.class);
  private final Game game;

  public TeamSocketConnectionHandler(Game game) {
    this.game = game;
  }

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

  public record ChatMessage(String playerName, String content) {}

  @Override
  public void handleMessage(@NonNull WebSocketSession session, @NonNull WebSocketMessage<?> message)
      throws Exception {

    Jwt jwt = (Jwt) session.getAttributes().get("jwt");
    Player player = game.getPlayer(UUID.fromString(jwt.getSubject()));

    ChatMessage chatMessage = new ChatMessage(player.getName(), message.getPayload().toString());

    ObjectMapper mapper = new ObjectMapper();
    String jsonMessage = mapper.writeValueAsString(chatMessage);

    for (WebSocketSession webSocketSession : webSocketSessions) {
      if (session == webSocketSession) continue;
      if (webSocketSession.isOpen()) {
        webSocketSession.sendMessage(new TextMessage(jsonMessage));
      }
    }

    if (session.isOpen()) {
      session.sendMessage(new TextMessage(jsonMessage));
    }
  }
}
