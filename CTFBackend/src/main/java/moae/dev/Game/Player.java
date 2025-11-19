package moae.dev.Game;

import moae.dev.Utils.NotificationSettings;

import java.util.Map;
import java.util.UUID;

public class Player {
  private final UUID id;
  private final String name;
  private final UUID team;
  private final boolean auth;

  // Subscription settings
  private boolean pushStatus;
  private boolean pushGlobalMessages;
  private boolean pushTeamMessages;
  private boolean pushAnnouncements; // Will always be set to true when logged in

  public Player(String name, UUID team, boolean auth) {
    this.id = UUID.randomUUID();
    this.name = name;
    this.team = team;
    this.auth = auth;

    pushStatus = true;
    pushGlobalMessages = true;
    pushTeamMessages = true;
    pushAnnouncements = true;
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

  public boolean isAuth() {
    return this.auth;
  }

  public Map<String, Object> toMap() {
    return Map.of(
        "id", id,
        "name", name,
        "team", team,
        "auth", auth);
  }

  public boolean isOnTeam(UUID cTeam) {
    return cTeam.equals(this.team);
  }

  public void mergeNotificationSettings(NotificationSettings settings) {
      pushStatus = settings.status();
      pushGlobalMessages = settings.global();
      pushTeamMessages = settings.team();
      pushAnnouncements = settings.announcements();
  }
}
