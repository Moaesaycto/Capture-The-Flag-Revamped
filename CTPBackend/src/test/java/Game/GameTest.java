package Game;

import moae.dev.Game.Game;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class GameTest {
    private Game game;

    @Test
    void initializeGame() {
        this.game = new Game();

        Map<String, Object> status = game.status();

        // Maybe fix this, idk
    }
}
