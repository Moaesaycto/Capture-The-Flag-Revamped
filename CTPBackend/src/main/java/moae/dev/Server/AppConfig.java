package moae.dev.Server;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

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

      public int getMaxPlayersPerTeam() {
          return maxPlayersPerTeam;
      }

      public void setMaxPlayersPerTeam(int maxPlayersPerTeam) {
          this.maxPlayersPerTeam = maxPlayersPerTeam;
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
}
