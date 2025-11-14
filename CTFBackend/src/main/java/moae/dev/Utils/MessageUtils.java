package moae.dev.Utils;

import java.util.ArrayList;
import java.util.List;

public class MessageUtils {
  public static MessagePage getMessages(Integer start, Integer count, List<ChatMessage> messages) {
    List<ChatMessage> result = new ArrayList<>();
    if (messages.isEmpty() || count <= 0) return new MessagePage(result, true);

    int startIdx = -1;
    for (int i = messages.size() - 1; i >= 0; i--) {
      if (messages.get(i).messageId() <= start) {
        startIdx = i;
        break;
      }
    }

    if (startIdx == -1) return new MessagePage(result, true);

    for (int i = startIdx; i >= 0 && result.size() < count; i--) {
      result.addFirst(messages.get(i));
    }

    boolean atEnd = (startIdx - count + 1 <= 0);
    return new MessagePage(result, atEnd);
  }
}
