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
    if (this.players.stream().anyMatch(p -> p.getName().equals(name))) {
      return false;
    }

    return this.players.add(new Player(name, team));
  }

  public boolean removePlayer(UUID id) {
    return players.removeIf(p -> id.equals(p.getID()));
  }

  public Map<String, Object> status() {
    List<Map<String, String>> playerList = new ArrayList<>();
    List<Map<String, String>> teamList = new ArrayList<>();

    this.players.forEach(
        p ->
            playerList.add(
                Map.of(
                    "name", p.getName(),
                    "id", p.getID().toString(),
                    "team", p.getTeam().toString())));

    this.teams.forEach(
        t ->
            teamList.add(
                Map.of("name", t.getName(), "color", t.getColor(), "id", t.getID().toString())));

    return Map.of("players", playerList, "teams", teamList);
  }

  public Team getTeam(UUID id) {
    return teams.stream().filter(t -> t.getID().equals(id)).findFirst().orElse(null);
  }

  public boolean registerTeam(String name, String color) {
    if (teams.stream().anyMatch(t -> t.getName().equals(name))) {
      return false;
    }

    return this.teams.add(new Team(name, color));
  }
}
