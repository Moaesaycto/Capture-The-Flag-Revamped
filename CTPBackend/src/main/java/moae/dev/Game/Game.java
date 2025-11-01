package moae.dev.Game;

import java.util.*;

public class Game {
  private static List<Team> teams;
  private static List<Player> players;

  public Game() {
    teams = new ArrayList<Team>();
    players = new ArrayList<Player>();
  }

    public static Player getPlayer(UUID id) {
        return players.stream().filter(p -> p.getID().equals(id)).findFirst().orElse(null);
    }

    public List<Player> getPlayers() {
    return players;
  }

  public static boolean addPlayer(String name, UUID team) {
    if (players.stream().anyMatch(p -> p.getName().equals(name))) {
      return false;
    }

    return players.add(new Player(name, team));
  }

  public static boolean removePlayer(UUID id) {
    return players.removeIf(p -> id.equals(p.getID()));
  }

  public Map<String, Object> status() {
    List<Map<String, String>> playerList = new ArrayList<>();
    List<Map<String, String>> teamList = new ArrayList<>();

    players.forEach(
        p ->
            playerList.add(
                Map.of(
                    "name", p.getName(),
                    "id", p.getID().toString(),
                    "team", p.getTeam().toString())));

    teams.forEach(
        t ->
            teamList.add(
                Map.of(
                    "name", t.getName(),
                    "color", t.getColor(),
                    "id", t.getID().toString())));

    return Map.of("players", playerList, "teams", teamList);
  }

  public static Team getTeam(UUID id) {
    return teams.stream().filter(t -> t.getID().equals(id)).findFirst().orElse(null);
  }

  public boolean registerTeam(String name, String color) {
    if (teams.stream().anyMatch(t -> t.getName().equals(name))) {
      return false;
    }

    return teams.add(new Team(name, color));
  }
}
