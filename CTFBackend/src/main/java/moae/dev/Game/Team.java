package moae.dev.Game;

import moae.dev.Sockets.SocketConnectionHandler;
import moae.dev.Utils.ChatMessage;

import java.util.*;

public class Team {
  private final UUID id;
  private final String name;
  private final String color;
  private final Flag flag;
  private final List<ChatMessage> messages;
  private SocketConnectionHandler webSocketHandler;

  public Team(String name, String color) {

    this.id = UUID.randomUUID();
    this.name = name;
    this.color = color;
    this.flag = new Flag();
    this.messages = new ArrayList<ChatMessage>();
  }

  public UUID getID() {
    return id;
  }

  public String getName() {
    return this.name;
  }

  public String getColor() {
    return this.color;
  }

  public Map<String, Object> toMap() {
    return Map.of(
        "id", this.id,
        "name", this.name,
        "color", this.color,
        "flag", this.flag.toMap());
  }

  public void setWebSocketHandler(SocketConnectionHandler handler) {
    this.webSocketHandler = handler;
  }

  public SocketConnectionHandler getWebSocketHandler() {
    return this.webSocketHandler;
  }

  public void sendMessage(Player sender, String content, Integer id) {
    ChatMessage msg = new ChatMessage(content, sender, id, new Date(), this.getID());
    messages.add(msg);

    if (webSocketHandler != null) {
      webSocketHandler.broadcastMessage(msg);
    }
  }

  public Map<Map<String, Object>, List<ChatMessage>> getMessages() {
    Map<Map<String, Object>, List<ChatMessage>> map = new HashMap<>();
    messages.forEach(m -> map.computeIfAbsent(m.player().toMap(), k -> new ArrayList<>()).add(m));
    return map;
  }
}
