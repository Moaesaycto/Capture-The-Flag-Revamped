package moae.dev.Server;

import moae.dev.Requests.SettingsRequest;
import moae.dev.Utils.Validation;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
@ConfigurationProperties
public class AppConfig {
  private GameConfig game;
  private List<TeamConfig> teams;

  public GameConfig getGame() {
    return game;
  }

  public void setGame(GameConfig game) {
    this.game = game;
  }

  public List<TeamConfig> getTeams() {
    return teams;
  }

  public void setTeams(List<TeamConfig> teams) {
    this.teams = teams;
  }

  public static class GameConfig {
    private int maxPlayers;
    private int minPlayers;
    private int minPlayersPerTeam;
    private int maxPlayersPerTeam;
    private int maxTeams;
    private int graceTime;
    private int scoutTime;
    private int ffaTime;

    public int getMinPlayers() {
      return minPlayers;
    }

    public void setMinPlayers(int minPlayers) {
      this.minPlayers = minPlayers;
    }

    public int getMaxPlayers() {
      return maxPlayers;
    }

    public void setMaxPlayers(int maxPlayers) {
      this.maxPlayers = maxPlayers;
    }

    public int getMinPlayersPerTeam() {
      return minPlayersPerTeam;
    }

    public void setMinPlayersPerTeam(int minPlayersPerTeam) {
      this.minPlayersPerTeam = minPlayersPerTeam;
    }

    public int getMaxPlayersPerTeam() {
      return maxPlayersPerTeam;
    }

    public void setMaxPlayersPerTeam(int maxPlayersPerTeam) {
      this.maxPlayersPerTeam = maxPlayersPerTeam;
    }

    public int getMaxTeams() {
      return maxTeams;
    }

    public void setMaxTeams(int maxTeams) {
      this.maxTeams = maxTeams;
    }

    public int getGraceTime() {
      return graceTime;
    }

    public void setGraceTime(int graceTime) {
      this.graceTime = graceTime;
    }

    public int getScoutTime() {
      return scoutTime;
    }

    public void setScoutTime(int scoutTime) {
      this.scoutTime = scoutTime;
    }

    public int getFfaTime() {
      return ffaTime;
    }

    public void setFfaTime(int ffaTime) {
      this.ffaTime = ffaTime;
    }
  }

  public static class TeamConfig {
    private String name;
    private String color;

    public String getColor() {
      return color;
    }

    public void setColor(String color) {
      this.color = color;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }
  }

  public Map<String, Object> getMap() {
    return Map.of(
        "maxPlayers", getGame().getMaxPlayers(),
        "minPlayers", getGame().getMinPlayers(),
        "minPlayersPerTeam", getGame().getMinPlayersPerTeam(),
        "maxPlayersPerTeam", getGame().getMaxPlayersPerTeam(),
        "maxTeams", getGame().getMaxTeams(),
        "graceTime", getGame().getGraceTime(),
        "scoutTime", getGame().getScoutTime(),
        "FFATime", getGame().getFfaTime());
  }

  public void merge(SettingsRequest req) {
    Integer maxPlayers = Validation.validateOptionalNumber(req.getMaxPlayers(), "maxPlayers");
    if (maxPlayers != null) this.getGame().setMaxPlayers(maxPlayers);

    Integer minPlayers = Validation.validateOptionalNumber(req.getMinPlayers(), "minPlayers");
    if (minPlayers != null) this.getGame().setMinPlayers(minPlayers);

    Integer minPlayersPerTeam =
        Validation.validateOptionalNumber(req.getMinPlayersPerTeam(), "minPlayersPerTeam");
    if (minPlayersPerTeam != null) this.getGame().setMinPlayersPerTeam(minPlayersPerTeam);

    Integer maxPlayersPerTeam =
        Validation.validateOptionalNumber(req.getMaxPlayersPerTeam(), "maxPlayersPerTeam");
    if (maxPlayersPerTeam != null) this.getGame().setMaxPlayersPerTeam(maxPlayersPerTeam);

    Integer graceTime = Validation.validatePeriodTime(req.getGraceTime(), "grace");
    if (graceTime != null) this.getGame().setGraceTime(graceTime);

    Integer scoutTime = Validation.validatePeriodTime(req.getScoutTime(), "scout");
    if (scoutTime != null) this.getGame().setScoutTime(scoutTime);

    Integer ffaTime = Validation.validatePeriodTime(req.getFfaTime(), "FFA");
    if (ffaTime != null) this.getGame().setFfaTime(ffaTime);
  }
}
