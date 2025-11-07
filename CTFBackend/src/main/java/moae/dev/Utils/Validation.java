package moae.dev.Utils;

import moae.dev.Game.Game;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Component
public class Validation {
  private final Game game;

  public Validation(Game game) {
    this.game = game;
  }

  public UUID ValidateUUID(String id, String type) {
    UUID uuid;
    try {
      uuid = UUID.fromString(id);
    } catch (Exception e) {
      return null;
    }

    switch (type) {
      case "team":
        if (game.getTeam(uuid) == null) {
          return null;
        }
        break;
      case "player":
        if (game.getPlayer(uuid) == null) {
          return null;
        }
        break;
      default:
        break;
    }
    return uuid;
  }

  public static Integer validateOptionalNumber(Integer value, String name) {
    if (value != null && value <= 0 && value != -1) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Invalid " + name + " (" + value + ")");
    }

    return value;
  }

  public static Integer validatePeriodTime(Integer value, String name) {
    if (value != null && value < 0) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Invalid " + name + " time (" + value + ")");
    }

    return value;
  }
}
