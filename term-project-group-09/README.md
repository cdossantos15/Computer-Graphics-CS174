# ROSHAMBO
## Group 9 Term Project - Fall 2018
Jamie Atlas<br />
Cecilia Dos Santos<br />
Elton Ong<br />
Sinan Cem Cetin<br />
Brendan Tanaka<br />
<br />
Dive into the ultimate battle of rock, paper, scissors in the first-person maze game: ROSHAMBO.<br />

The object of this game is to defeat the fearsome Hydra King.<br />

The player must travel around the map to each of the themed rooms, defeating enemies guarding three keys. The rock key is guarded by a golem, the paper key by a crane, and the scissors key by a knight. Once all three keys are collected, the Hydra King's lair will open. Like the enemies before him, the player must fight the Hydra King in a game of rock, paper scissors to win. <br />

The game is ready to begin when you see the blinking "Press 0 to start" message (the game can take a while to load once opening the browser, so please wait for it to start blinking consistently before you press 0). Use the the "WASD" keys to move the player. Approach an enemy to battle, and use the "123" keys to choose your weapon. Approach a key to pick it up. Once you have collected the keys at the end of the three passageways branching off from the starting rainbow room, a fourth door will open. At the end of this secret hallway is the final boss. <br />

If you win a battle, your opponent is destroyed in an incredible display of light! (This is the magical power of Roshambo.) If you lose, you are sent back to the rainbow room. If you and your enemy choose the same weapon, you must battle again right away. <br />

Rock enemies always play rock. Paper enemies cycle between the three options. Scissor enemies use what would have beaten your last move. The Hydra King attacks randomly. <br />

(Of course, rock beats scissors, scissors beats paper, and paper beats rock.) <br />

The advanced topics implemented in this project:<br />
- **Collision Detection** is used predominantly for the walls so that the player is bound within the rooms. It is also used for detecting nearby enemies and keys.<br />
- **Bump Mapping** has been implemented to enhance graphics in certain textures, such as the Rock walls.<br />
- **Physics and Particle Animations** have been implemented as special effects for the fire torches, flying paper, and rocks.<br />
- **Reflections** have also been created to enhance the graphics in the final victory room.<br />
- **Text** the opening and closing text crawls were created with the use of texturing and an image of the ASCII character set.<br/>
- **High Level Narrative Building** it isn't graphics but our game has a cohesive story behind it and we're proud of that.
- **Team Collaboration** also not graphics but our team had 5 people, and even though it was challenging we managed to combine all our code together, in addition to becoming friends. We discussed Sonic the Hedgehog as a group, and Elton bought everyone coffee one time. 

The distribution of the work was as follows:
- Jamie Atlas focused on the Rock, Paper, Scissors battle interface including the enemy AI, and made the intro/outtro text crawls.
- Cecilia Dos Santos focused on the scissor enemies, textures, the particles/physics as seen in the different rooms.
- Elton Ong focused on creating the rock and paper enemy, and reflections.
- Brendan Tanaka focused on implementing bump mapping and tile system for the maze. Implemented the sound for the game.
- Sinan Cetin focused on the map organization/creation, collision detection, and making sure that all our individual work fit well into the code.<br />

The music heard in this game was made by Brendan and Sinan.
