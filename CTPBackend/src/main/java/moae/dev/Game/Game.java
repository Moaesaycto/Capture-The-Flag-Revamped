package moae.dev.Game;

import java.util.*;

public class Game {
  private List<Team> teams;
  private List<Player> players;

  public Game() {
    this.teams = new ArrayList<Team>();
    this.players = new ArrayList<Player>();
  }

  public List<Player> getPlayers() {
    return this.players;
  }

  public boolean addPlayer(String name, UUID team) {
    return teams.stream()
        .filter(t -> t.getID().equals(team))
        .findFirst()
        .map(t -> players.add(new Player(name, team)))
        .orElse(false);
  }

  public boolean removePlayer(UUID id) {
    return players.removeIf(p -> id.equals(p.getID()));
  }

  public Map<String, Object> status() {
    List<Map<String, String>> playerList = new ArrayList<>();

    this.players.forEach(
        p -> playerList.add(Map.of("name", p.getName(), "id", p.getID().toString())));
    return Map.of("players", playerList);
  }

  public Team getTeam(UUID id) {
    return teams.stream().filter(t -> t.getID().equals(id)).findFirst().orElse(null);
  }
}
