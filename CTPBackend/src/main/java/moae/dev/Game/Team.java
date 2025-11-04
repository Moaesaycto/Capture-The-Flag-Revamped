package moae.dev.Game;

import java.util.Map;
import java.util.UUID;

public class Team {
  private final UUID id;
  private final String name;
  private final String color;
  private final Flag flag;

  public Team(String name, String color) {
    this.id = UUID.randomUUID();
    this.name = name;
    this.color = color;
    this.flag = new Flag();
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
}
