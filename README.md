# Gamepad-Button-Sequence-Counter

Used for quality of life purposes when farming Rosetta Stones in D-District Prison in Final Fantasy VIII, which requires the player to do a sequence of inputs to efficiently farm the extremely rare item. The procedure involves running from the save point to the NPC as fast as possible. Then, the player will be required to challenge the NPC to a game of Triple Triad and subsequently decline for a total of 54 times.

To make this process less tedious, this script tracks the number of times the NPC has been challenged. The script uses the Gamepad API to track controller inputs, specifically the X, Square, and L1 buttons on a PS4 controller. 

Counter increments after making sure that the user had pressed Square before pressing X. Counter can be reset to 0 by pressing L1.

Background color changes as the counter gets closer to 54, to allow the player to focus on the game screen and let their peripheral vision track what the counter is at. Background starts with white and changes to light blue as the counter hits values divisible by 10. Once it gets to the 50s, the background color gradually changes to green from 51 to 54, then switches to red from 55 onwardsm, signalling the player that they have reached the target number. 
