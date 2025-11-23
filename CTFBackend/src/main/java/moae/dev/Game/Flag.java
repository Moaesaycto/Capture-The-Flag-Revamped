package moae.dev.Game;

import java.util.Map;
import java.util.UUID;
import java.util.Vector;

public class Flag {
  private final Vector<Number> location;
  private final UUID id = UUID.randomUUID();

  public Flag(Integer x, Integer y) {
    location = new Vector<>();
    location.add(x);
    location.add(y);
  }

  public UUID getId() {
    return id;
  }

  public Vector<Number> getLocation() {
    return location;
  }

  public Map<String, Object> toMap() {
    return Map.of(
        "x", this.location.getFirst(),
        "y", this.location.getLast());
  }
}
