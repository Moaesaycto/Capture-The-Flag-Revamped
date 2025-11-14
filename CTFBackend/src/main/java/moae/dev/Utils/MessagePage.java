package moae.dev.Utils;

import java.util.List;

public record MessagePage(List<ChatMessage> messages, boolean end) {}