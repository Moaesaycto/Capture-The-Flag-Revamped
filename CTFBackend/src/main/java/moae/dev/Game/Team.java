package moae.dev.Game;

import moae.dev.Sockets.SocketConnectionHandler;
import moae.dev.Utils.ChatMessage;
import moae.dev.Utils.MessagePage;
import moae.dev.Utils.MessageUtils;

import java.util.*;

public class Team {
  private final UUID id;
  private final String name;
  private final String color;
  private Flag flag;
  private final List<ChatMessage> messages;
  private SocketConnectionHandler webSocketHandler;

  public Team(String name, String color) {

    this.id = UUID.randomUUID();
    this.name = name;
    this.color = color;
    this.flag = null;
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

  public Map<String, Object> toMap(boolean revealed) {

    Map<String, Object> result = new HashMap<>();
    result.put("id", this.id);
    result.put("name", this.name);
    result.put("color", this.color);

    if (flag == null || !revealed) {
      result.put("flag", null);
      result.put("registered", flag != null);
    } else {
      result.put("flag", flag.toMap());
      result.put("registered", flag != null);
    }
    return result;
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

  public MessagePage getMessages(Integer start, Integer count) {
    return MessageUtils.getMessages(start, count, messages);
  }

  public void reset() {
    messages.clear();
    flag = null;
  }

  public void registerFlag(int x, int y) {
    this.flag = new Flag(x, y);
  }

  public boolean isRegistered() {
    return flag != null;
  }
}
