package moae.dev.Services;

import moae.dev.Utils.PushSubscription;

import nl.martijndwars.webpush.*;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Security;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PushNotificationService {

  private final Map<String, Subscription> subscriptions = new ConcurrentHashMap<>();

  @Value("${vapid.publicKey}")
  private String publicKey;

  @Value("${vapid.privateKey}")
  private String privateKey;

  @Value("${vapid.subject}")
  private String subject;

  public PushNotificationService() {
    if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
      Security.addProvider(new BouncyCastleProvider());
    }
  }

  public void addSubscription(String endpoint, PushSubscription sub) {
    Subscription subscription =
        new Subscription(sub.endpoint, new Subscription.Keys(sub.keys.p256dh, sub.keys.auth));
    subscriptions.put(endpoint, subscription);
  }

  public void removeSubscription(String endpoint) {
    subscriptions.remove(endpoint);
  }

  public void notifyAll(String title, String body) {
    try {
      PushService pushService =
          new PushService().setPublicKey(publicKey).setPrivateKey(privateKey).setSubject(subject);

      String payload = String.format("{\"title\":\"%s\",\"body\":\"%s\"}", title, body);

      Iterator<Map.Entry<String, Subscription>> iterator = subscriptions.entrySet().iterator();
      while (iterator.hasNext()) {
        Map.Entry<String, Subscription> entry = iterator.next();
        try {
          pushService.send(new Notification(entry.getValue(), payload));
        } catch (Exception e) {
          System.err.println("Failed to send to " + entry.getKey() + ": " + e.getMessage());
          iterator.remove();
        }
      }
    } catch (Exception e) {
      System.err.println("Push service error: " + e.getMessage());
      e.printStackTrace();
    }
  }
}
