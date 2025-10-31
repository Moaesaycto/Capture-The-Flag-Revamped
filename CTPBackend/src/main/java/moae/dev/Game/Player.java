package moae.dev.Game;

import java.util.UUID;

public class Player {
  private final UUID id;
  private final String name;
  private final UUID team;

  public Player(String name, UUID team) {
    this.id = UUID.randomUUID();
    this.name = name;
    this.team = team;
  }

  public String getName() {
    return this.name;
  }

  public UUID getID() {
    return this.id;
  }

  public UUID getTeam() {
    return this.team;
  }
}
