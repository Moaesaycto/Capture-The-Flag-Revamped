package moae.dev.Utils;

public class PushSubscription {
  public String endpoint;
  public Keys keys;

  public static class Keys {
    public String p256dh;
    public String auth;
  }
}
