package moae.dev.Utils;

import java.lang.annotation.*;
import moae.dev.Game.Game;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Locked {
  Game.State[] allowed();

  String error() default "This method cannot be called in the current state.";
}
