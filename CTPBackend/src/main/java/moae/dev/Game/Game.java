package moae.dev.Game;

import jakarta.validation.Valid;
import moae.dev.Requests.SettingsRequest;
import moae.dev.Server.AppConfig;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

public class Game {
  private static List<Team> teams;
  private static List<Player> players;
  private static State state;
  private static AppConfig config;

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

  public Game(AppConfig initConfig) {
    teams = new ArrayList<Team>();
    players = new ArrayList<Player>();
    state = State.WAITING_TO_START;
    config = initConfig;

    registerNTeams(initConfig.getGame().getMaxTeams(), initConfig.getTeams());
  }

  // ----- Game -----
  public static void setState(State state) {
    Game.state = state;
  }

  public static State getState() {
    return Game.state;
  }

  public Map<String, Object> status() {
    List<Map<String, Object>> playerList = new ArrayList<>();
    List<Map<String, String>> teamList = new ArrayList<>();
    Map<String, String> currState = Map.of("state", state.toString());

    players.forEach(
        p ->
            playerList.add(
                Map.of(
                    "name",
                    p.getName(),
                    "id",
                    p.getID().toString(),
                    "team",
                    p.getTeam().toString(),
                    "auth",
                    p.isAuth())));

    teams.forEach(
        t ->
            teamList.add(
                Map.of(
                    "name", t.getName(),
                    "color", t.getColor(),
                    "id", t.getID().toString())));

    return Map.of(
        "players", playerList,
        "teams", teamList,
        "state", currState,
        "game", config.getMap());
  }

  public void reset() {
    players.clear();
    teams.clear();
    setState(State.WAITING_TO_START);
  }

  public void merge(@Valid SettingsRequest settings) {
    if (state != State.WAITING_TO_START)
      throw new ResponseStatusException(
          HttpStatus.LOCKED, "Settings can only be changed before the game.");

    Integer newMax = settings.getMaxTeams();

    int trueMax = config.getTeams().size();
    if (newMax != null && newMax != teams.size()) {
      if (newMax <= config.getTeams().size())
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Invalid maxTeams (" + newMax + "). Must be less than or equal to " + trueMax);
      reset(); // Hard reset when teams are changed. TODO: Account for this with JWTs
      if (!registerNTeams(newMax, config.getTeams())) {
        reset();
        throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong registering the teams.");
      }
    }

    config.merge(settings);
  }

  // ----- Players -----
  public static Player getPlayer(UUID id) {
    return players.stream().filter(p -> p.getID().equals(id)).findFirst().orElse(null);
  }

  public List<Player> getPlayers() {
    return players;
  }

  public static UUID addPlayer(String name, UUID team, boolean auth) {
    if (players.stream().anyMatch(p -> p.getName().equals(name))) {
      return null;
    }

    Player newPlayer = new Player(name, team, auth);
    players.add(newPlayer);

    return newPlayer.getID();
  }

  public static boolean removePlayer(UUID id) {
    return players.removeIf(p -> id.equals(p.getID()));
  }

  public static boolean isValidPlayer(UUID player) {
    return players.stream().anyMatch(p -> p.getID().equals(player));
  }

  // ----- Teams -----
  public static Team getTeam(UUID id) {
    return teams.stream().filter(t -> t.getID().equals(id)).findFirst().orElse(null);
  }

  private boolean registerNTeams(int n, List<AppConfig.TeamConfig> allTeams) {
    final boolean[] success = {true};
    allTeams.stream()
        .limit(n)
        .forEach(
            t -> {
              success[0] = success[0] && registerTeam(t.getName(), t.getColor());
            });

    return success[0];
  }

  public boolean registerTeam(String name, String color) {
    if (teams.stream().anyMatch(t -> t.getName().equals(name))) {
      return false;
    }

    return teams.add(new Team(name, color));
  }
}
