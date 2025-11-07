package moae.dev.Game;

import java.util.Map;
import java.util.UUID;
import java.util.Vector;

public class Flag {
  private final Vector<Number> location;
  private final UUID id = UUID.randomUUID();

  public Flag() {
    location = new Vector<>();
    location.add(-1);
    location.add(-1);
  }

  public UUID getId() {
    return id;
  }

  public void setLocation(Number x, Number y) {
    location.clear();
    location.add(x);
    location.add(y);
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
