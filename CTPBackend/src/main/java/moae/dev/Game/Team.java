package moae.dev.Game;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Team {
  private final UUID id;
  private final String name;
  private final String color;
  private final List<Player> players;

  public Team(String name, String color) {
    this.id = UUID.randomUUID();
    this.name = name;
    this.color = color;
    this.players = new ArrayList<Player>();
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

  public boolean join(Player p) {
    if (players.contains(p)
        || players.stream().anyMatch(player -> p.getName().equals(player.getName()))) {
      return false;
    }

    players.add(p);
    return true;
  }

  public boolean leave(Player p) {
    return players.remove(p);
  }
}
