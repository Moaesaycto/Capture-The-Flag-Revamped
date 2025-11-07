package moae.dev.Server;

import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class ConditionalBearerTokenResolver implements BearerTokenResolver {
  private final DefaultBearerTokenResolver delegate = new DefaultBearerTokenResolver();
  private final String[] publicPaths;

  public ConditionalBearerTokenResolver(AppSecurityProperties props) {
    this.publicPaths = props.getPublicPaths().toArray(new String[0]);
  }

  @Override
  public String resolve(HttpServletRequest request) {
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
      return null;
    }

    String servletPath = request.getServletPath();
    for (String p : publicPaths) {
      if (servletPath.equals(p) || servletPath.startsWith(p)) {
        return null;
      }
    }

    return delegate.resolve(request);
  }
}
