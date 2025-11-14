package moae.dev.Game;

import jakarta.validation.Valid;
import moae.dev.Requests.SettingsRequest;
import moae.dev.Server.AppConfig;
import moae.dev.Sockets.SocketConnectionHandler;
import moae.dev.Sockets.StateSocketConnectionHandler;
import moae.dev.Utils.ChatMessage;
import moae.dev.Utils.MessagePage;
import moae.dev.Utils.MessageUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

public class Game {
  private final AppConfig config;

  private final List<Team> teams;
  private final List<Player> players;

  private final AtomicInteger counter = new AtomicInteger(0);
  private final List<ChatMessage> messages = new ArrayList<>();
  private SocketConnectionHandler webSocketHandler;

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

    if (!registerNTeams(initConfig.getGame().getMaxTeams(), initConfig.getTeams())) {
      throw new RuntimeException("Failed to register teams. Check the configuration and retry");
    }
  }

  public void setWebSocketHandler(SocketConnectionHandler handler) {
    this.webSocketHandler = handler;
  }

  public SocketConnectionHandler getWebSocketHandler() {
    return this.webSocketHandler;
  }

  // ----- Gameplay -----
  public void start() {
    // TODO: Fix me
  }

  public void skip() {
    // TODO: Fix me
  }

  public void rewind() {
    // TODO: Fix me
  }

  public void pause() {
    // TODO: Fix me
  }

  public void end() {
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

  public Integer sendMessage(UUID sender, String content) {
    Player player = getPlayer(sender);
    Integer newId = counter.incrementAndGet();
    ChatMessage msg = new ChatMessage(content, player, newId, new Date(), player.getTeam());
    messages.add(msg);

    if (webSocketHandler != null) {
      webSocketHandler.broadcastMessage(msg);
    }

    return newId;
  }

  public MessagePage getMessages(Integer start, Integer count) {
    return MessageUtils.getMessages(start, count, messages);
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

    if (teams.stream().noneMatch(t -> t.getID().equals(team))) {
      throw new IllegalArgumentException("Invalid team choice");
    }

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

  public boolean isPlayerOnTeam(UUID playerId, UUID teamId) {
    return players.stream()
        .filter(p -> p.getID().equals(playerId))
        .anyMatch(p -> p.getTeam().equals(teamId));
  }

  // ----- Teams -----
  public List<Team> getTeams() {
    return teams;
  }

  public Team getTeam(UUID id) {
    Team team = teams.stream().filter(t -> t.getID().equals(id)).findFirst().orElse(null);
    if (team == null) throw new NoSuchElementException("Cannot find team");

    return team;
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

  public Integer sendTeamMessage(UUID team, UUID sender, String content) {
    Integer newId = counter.incrementAndGet();
    getTeam(team).sendMessage(getPlayer(sender), content, newId);
    return newId;
  }

  public boolean isValidTeam(UUID team) {
      return teams.stream().anyMatch(p -> p.getID().equals(team));
  }

  public boolean declareVictory(UUID team) {
    return true;
  }
}
