package moae.dev.Requests;

public class SettingsRequest {
  private Integer maxPlayers;
  private Integer minPlayers;
  private Integer minPlayersPerTeam;
  private Integer maxPlayersPerTeam;
  private Integer graceTime;
  private Integer scoutTime;
  private Integer ffaTime;

  public Integer getMaxPlayers() {
    return maxPlayers;
  }

  public void setMaxPlayers(Integer maxPlayers) {
    this.maxPlayers = maxPlayers;
  }

  public Integer getMinPlayers() {
    return minPlayers;
  }

  public void setMinPlayers(Integer minPlayers) {
    this.minPlayers = minPlayers;
  }

  public Integer getMinPlayersPerTeam() {
    return minPlayersPerTeam;
  }

  public void setMinPlayersPerTeam(Integer minPlayersPerTeam) {
    this.minPlayersPerTeam = minPlayersPerTeam;
  }

  public Integer getMaxPlayersPerTeam() {
    return maxPlayersPerTeam;
  }

  public void setMaxPlayersPerTeam(Integer maxPlayersPerTeam) {
    this.maxPlayersPerTeam = maxPlayersPerTeam;
  }

  public Integer getGraceTime() {
    return graceTime;
  }

  public void setGraceTime(Integer graceTime) {
    this.graceTime = graceTime;
  }

  public Integer getScoutTime() {
    return scoutTime;
  }

  public void setScoutTime(Integer scoutTime) {
    this.scoutTime = scoutTime;
  }

  public Integer getFfaTime() {
    return ffaTime;
  }

  public void setFfaTime(Integer ffaTime) {
    this.ffaTime = ffaTime;
  }
}
