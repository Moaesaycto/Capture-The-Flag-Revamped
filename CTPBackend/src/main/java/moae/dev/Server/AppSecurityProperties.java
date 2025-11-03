package moae.dev.Server;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "app.security")
public class AppSecurityProperties {
  private List<String> publicPaths;
  private String authPw;

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
    System.out.println(password + " != " + authPw);
    return authPw != null && authPw.equals(password);
  }
}
