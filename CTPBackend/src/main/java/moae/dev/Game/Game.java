package moae.dev.Game;

import jakarta.validation.Valid;
import moae.dev.Requests.SettingsRequest;
import moae.dev.Server.AppConfig;
import moae.dev.Sockets.StateSocketConnectionHandler;
import moae.dev.Utils.Locked;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

public class Game {
  private final AppConfig config;

  private final List<Team> teams;
  private final List<Player> players;

  private static State state;

  public enum State {
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

  // ----- Gameplay -----
  @Locked(
      allowed = {State.WAITING_TO_START},
      error = "Cannot start in this current state")
  public void start() {
    checkLock();
    // TODO: Fix me
  }

  @Locked(
      allowed = {State.GRACE_PERIOD, State.SCOUT_PERIOD, State.FFA_PERIOD},
      error = "You can only skip a period during the game")
  public void skip() {
    checkLock();
    // TODO: Fix me
  }

  @Locked(
      allowed = {State.SCOUT_PERIOD, State.FFA_PERIOD, State.ENDED},
      error = "You can only rewind to another point during the game")
  public void rewind() {
    checkLock();
    // TODO: Fix me
  }

  @Locked(
      allowed = {State.GRACE_PERIOD, State.SCOUT_PERIOD, State.FFA_PERIOD},
      error = "You can only pause during the game")
  public void pause() {
    checkLock();
    // TODO: Fix me
  }

  @Locked(
      allowed = {State.GRACE_PERIOD, State.SCOUT_PERIOD, State.FFA_PERIOD},
      error = "You can only end the game during it")
  public void end() {
    checkLock();
    // TODO: Fix
  }

  // ----- Utilities -----
  public void setState(State state) {
    if (Game.state == state) return;
    Game.state = state;
    StateSocketConnectionHandler.broadcast("state:" + state.toString());
  }

  public State getState() {
    return Game.state;
  }

  public Map<String, Object> status() {
    List<Map<String, Object>> playerList = new ArrayList<>();
    List<Map<String, Object>> teamList = new ArrayList<>();
    Map<String, String> currState = Map.of("state", state.toString());

    players.forEach(p -> playerList.add(p.toMap()));
    teams.forEach(t -> teamList.add(t.toMap()));

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

    config.merge(settings);
  }

  private void checkLock() {
    try {
      StackTraceElement[] stack = Thread.currentThread().getStackTrace();
      String methodName = stack[2].getMethodName();
      var method = this.getClass().getMethod(methodName);

      if (method.isAnnotationPresent(Locked.class)) {
        Locked locked = method.getAnnotation(Locked.class);
        boolean allowed = Arrays.stream(locked.allowed()).anyMatch(s -> s == state);

        if (!allowed) {
          throw new IllegalStateException(locked.error() + " (current: " + state + ")");
        }
      }
    } catch (NoSuchMethodException ignored) {
    }
  }

  // ----- Players -----
  public Player getPlayer(UUID id) {
    Player player = players.stream().filter(p -> p.getID().equals(id)).findFirst().orElse(null);
    if (player == null) throw new NoSuchElementException("Cannot find player");

    return player;
  }

  public List<Player> getPlayers() {
    return players;
  }

  public UUID addPlayer(String name, UUID team, boolean auth) {
    if (state != State.WAITING_TO_START)
      throw new IllegalStateException("Cannot join game at this time");

    if (players.stream().anyMatch(p -> p.getName().equals(name)))
      throw new IllegalArgumentException(
          "A player with the name " + name + "already exists in the game");

    Player newPlayer = new Player(name, team, auth);
    players.add(newPlayer);
    return newPlayer.getID();
  }

  public boolean removePlayer(UUID id) {
    if (!isValidPlayer(id)) throw new NoSuchElementException("Player not found");

    return players.removeIf(p -> id.equals(p.getID()));
  }

  public boolean isValidPlayer(UUID player) {
    return players.stream().anyMatch(p -> p.getID().equals(player));
  }

  // ----- Teams -----
  public List<Team> getTeams() {
    return teams;
  }

  public Team getTeam(UUID id) {
    return teams.stream().filter(t -> t.getID().equals(id)).findFirst().orElse(null);
  }

  @Locked(
      allowed = {State.WAITING_TO_START},
      error = "You can only join before the game")
  private boolean registerNTeams(int n, List<AppConfig.TeamConfig> allTeams) {
    checkLock();

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

  @Locked(
      allowed = {State.GRACE_PERIOD, State.SCOUT_PERIOD, State.FFA_PERIOD},
      error = "Cannot declare victory at this time")
  public boolean declareVictory(UUID team) {
    return true;
  }
}
