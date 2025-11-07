package moae.dev.Server;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "app.security")
public class AppSecurityProperties {
  private List<String> publicPaths;
  private String authPw;
  private String jwtSecret;
  private Integer expiryMinutes;
  private String frontend;

  public List<String> getPublicPaths() {
    return publicPaths;
  }

  public void setPublicPaths(List<String> publicPaths) {
    this.publicPaths = publicPaths;
  }

  // Not secure, but not really needed
  public String getAuthPw() {
    return authPw;
  }

  public void setAuthPw(String authPw) {
    this.authPw = authPw;
  }

  public boolean passCheck(String password) {
    return authPw != null && authPw.equals(password);
  }

  public String getJwtSecret() {
    return jwtSecret;
  }

  public void setJwtSecret(String jwtSecret) {
    this.jwtSecret = jwtSecret;
  }

  public Integer getExpiryMinutes() {
    return expiryMinutes;
  }

  public void setExpiryMinutes(Integer expiryMinutes) {
    this.expiryMinutes = expiryMinutes;
  }

  public String getFrontend() {
    return frontend;
  }

  public void setFrontend(String frontend) {
    this.frontend = frontend;
  }
}
