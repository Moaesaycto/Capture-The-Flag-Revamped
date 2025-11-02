package moae.dev.Utils;

import moae.dev.Game.Game;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

public class Validation {
  public static UUID ValidateUUID(String id, String type) {
    UUID uuid;
    try {
      uuid = UUID.fromString(id);
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Not a valid UUID");
    }

    switch (type) {
      case "team":
        if (Game.getTeam(uuid) == null) {
          throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found");
        }
        break;
      case "player":
        if (Game.getPlayer(uuid) == null) {
          throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found");
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
