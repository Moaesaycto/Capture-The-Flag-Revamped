# Using Configuration Files with Spring Boot

Set up a standard YAML file, such as this one:

```yml
game:
  maxPlayers: -1
  minPlayers: 2
  minPlayersPerTeam: 1
  maxTeams: 2
teams:
  - name: Yellow
    color: "#e1ff00"
  - name: Orange
    color: "#ff8300"
  - name: Pink
    color: "#ff00ee"
```

Save this file as `config.yml` in `resources` (or whatever you want to clal it). Inside your `application.yml` file, make sure to tell it about your new file by appending this:

```yml
# ... Normal stuff
spring:
  config:
    import: classpath:config.yml
```

Then, set up an option that directly works with these values. 

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties
public class AppConfig {
  private GameConfig game;
  private List<TeamConfig> teams;

  // Getters and setters for these fields

  public static class GameConfig {
    private int minPlayers;
    private int maxPlayers;
    // Keep going...

    public int getMinPlayers() { return minPlayers; }
    public void setMinPlayers(int minPlayers) { this.minPlayers = minPlayers; }
    // Add the rest of the getters and setters
  }

  public static class TeamConfig {
    private String name;
    // Keep going...

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    // Add the rest of the getters and setters
  }
}
```

Spring Boot will automatically set up the appropriately based on the structure. So like:

```plaintext
game.maxPlayers = -1
game.minPlayers = 2
game.minPlayersPerTeam = 1
game.maxTeams = 2
teams[0].name = Yellow
teams[0].color = #e1ff00
teams[1].name = Orange
teams[1].color = #ff8300
teams[2].name = Pink
teams[2].color = #ff00ee
```

Then, using it is as simple as importing the actual class and using it:

```java
@SpringBootApplication
@RestController
public class Controller {
  private final AppConfig config;

  public Controller(AppConfig config) {
    this.config = config;
  }
}
```

Then you should be able to handle the configurations as objects accessible from any part of the application.