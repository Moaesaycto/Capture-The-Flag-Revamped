# Schema Testing for Requests in Spring Boot

Starting by importing the required dependency:

```gradle
dependencies {
    // Normal stuff ...
    implementation 'org.springframework.boot:spring-boot-starter-validation'
}
```

Now, you set up a DTO (data transfer object).

```java
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class JoinRequest {
  @NotBlank(message = "name is required")
  private String name;

  @NotNull(message = "team is required")
  private UUID team;

  public JoinRequest() {}

  public JoinRequest(String name, UUID team) {
    this.name = name;
    this.team = team;
  }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public UUID getTeam() { return team; }
  public void setTeam(UUID team) { this.team = team; }
}
```

Alternatively, you can use Java records:

```java
public record JoinRequest(
  @NotBlank(message = "name is required") String name,
  @NotNull(message = "team is required") UUID team
) {}
```

Then, inside your controller, you need to add a `@Validated` wrapper to your `@RestController` class, and pass the schema class down:

```java
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;

@RestController
@Validated
public class Controller {

  @PostMapping("/")
  public Map<String, Object> Example(@Valid @RequestBody JoinRequest req) {
    console.log(req.getName(), team.getID());
    // Or whatever you need
  }
}
```
