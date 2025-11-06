# Setting up CORS in Spring Boot

You can do this by setting up a CORS configuration:


```java
package moae.dev.Server;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

  private final AppSecurityProperties securityProperties;

  public CorsConfig(AppSecurityProperties securityProperties) {
    this.securityProperties = securityProperties;
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
        .addMapping("/**")
        .allowedOrigins(securityProperties.getFrontend())
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true); // Needed for cookies
  }
}
```

You can also reference it when setting up the main REST controller:

```java
@SpringBootApplication
@RestController
@CrossOrigin(origins = "${app.security.frontend}", allowCredentials = "true")
public class App {
  public static void main(String[] args) {
    SpringApplication.run(App.class, args);
  }
}
```