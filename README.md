# Gamepad-Button-Sequence-Counter

## Functionality
Application that tracks a sequence of inputs from a game controller. This uses the Gamepad API to detect controller connections and button inputs. 

Currently, the counter functionality counts every time Button[3] then Button[0] ("Square" and "X" buttons on a PlayStation controller, respectively) are pressed. It tracks whether the count has reached a target number (hardcoded to 54), then notifies the user with a sound effect once that target number is reached. As the count gets closer to the target number, the border color gradually changes from yellow to green as it reaches the target number. Once it's past the target, the border color stays red until it is reset.

There is also a stopwatch that can be controlled by onscreen buttons or by controller input. The timer can be started, stopped, and reset. Resetting the timer sets the time back to 00:00:00, stores the previous time in memory, and displays them on the screen. The list can also be cleared.

The app is completely controllable by the connected gamepad (gamepad index currently hardcoded for testing).  



## Controls:
|Playstation |Gamepad API Button Index  |Functionality  |
|:---:|:---:|---|
| Square | Button[3] | Enables wait state for incrementing count  |
| X | Button[0] | Increments count, disables wait state  |
| L1 | Button[4] | Resets count to zero  |
| L2 |  | Starts and resets stopwatch |
| R2 |  | Clears list of times (permanently)  |
