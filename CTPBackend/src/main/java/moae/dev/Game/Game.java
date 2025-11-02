package moae.dev.Game;

import java.util.*;

public class Game {
  private static List<Team> teams;
  private static List<Player> players;
  private static State state;

  public static enum State {
    WAITING_TO_START("ready"),
    GRACE_PERIOD("grace"),
    SCOUT_PERIOD("scout"),
    FFA_PERIOD("ffa"),
    ENDED("ended"),
    PAUSED("paused"),
    LOADING("loading");

    private final String readableName;

    State(String readableName) {
      this.readableName = readableName;
    }

    @Override
    public String toString() {
      return readableName;
    }
  }

  public Game() {
    teams = new ArrayList<Team>();
    players = new ArrayList<Player>();
    state = State.WAITING_TO_START;
  }

  // ----- Game -----
  public static void setState(State state) {
    Game.state = state;
  }

  public static State getState() {
    return Game.state;
  }

  public Map<String, Object> status() {
    List<Map<String, String>> playerList = new ArrayList<>();
    List<Map<String, String>> teamList = new ArrayList<>();
    Map<String, String> game = Map.of("state", state.toString());

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

    return Map.of("players", playerList, "teams", teamList, "game", game);
  }

  public void reset() {
    players.clear();
    teams.clear();
    setState(State.WAITING_TO_START);
  }

  // ----- Players -----
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

  // ----- Teams -----
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
