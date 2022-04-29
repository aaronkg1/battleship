# battleship
battleship app for the Odin Project

Live preview: https://aaronkg1.github.io/battleship/

The project started off with a test driven approach. Using Jest to test each function was returning the correct values as I went along. I created a Ship factory function which contained a "hit" method, and a "isSunk" method. I wrote a Gameboard factory function that contained a board, a function to place ships on board, one to receive an attack and one to determine if all ships on the board had been sunk. I also made a Player factory function and through composition, a Computer factory function that contained some additional methods for the computer AI. Initially I created a method in the Computer contructor that picked a square to attack completely at random.
However, I figured I could make the computer make an intelligent decision on subsequent goes, by attacking adjacent squares to any hits. Once the computer had one or more hits, the function determined if the ship was horizontal or vertical and then moved accordingly.
To do this I made use of if statements for each possible scenario. I'm sure this could be refactored in a much more elagant way but it seemed to work well.

Once I was satisfied all the core modules were working as intended, I set about creating some DOM elements to visualise the game. I wrote a function that appended `<div>`s to a player board and added an identifiying 'player-square' class and assigned a coordinate value to each of these squares. I also did the same for the computer board.

My next challenge was to try and figure out how I could place ships on my board. I liked the idea of being able to hover over squares and see exactly how the ship was going to be placed. After some googling, I figured out I could use the css background position to show a portion of a ship image in each square.
In order to work out the squares that were adjacent to the highlighted one, I wrote a function which took the current target square and based on the current ship length and direction, returned an array of squares to be styled. The function then added a class to the square with ship name-(plus another string, based on the ship's length).
I also created an almost identical function which removed the class from squares. I used this as a callback for a "mouseout" event on the square to give it the hover effect.

I used some warship SVGs I purchased and sized these according to the `<div>`s size and then assigned them as a background to each class with the correct background-position. This approach worked well for placing one ship however, when placing another, it would overwrite the existing ship. 
Adding event listeners to squares with the class "player-square" somewhat fixed this however if placing on a square adjacent to a placed ship, it still modified the existing ship's class. I fixed this with two functions, one which checked if the current square value was a viable position to place the ship based on the ships length and position in relation to the end of the board,
and another which checked whether the next squares were empty. By filtering through all the player-square's and making sure both these fit these criteria, we are left with viable squares. 
I created another function which returned an array of coordinate values which were assigned to the squares originally. This function is used as a callback on click, and provides the coordinates for the placeShip method on the Gameboard.

To avoid using anymore callbacks and eventlisteners, I decided to make my gameSetup function and gameLoop function asynchronous. The gameSetup function relied on waiting for the player to place a ship, and so I wrapped all the event listeners relating to placing a ship in a function called waitForClick. This returned a promise for each viable playing square which resolved upon clicking. I pushed these promises to an array and used Promise.race to reject the other promises upon clicking one. 
At this point, I also added a button for changing the direction of the ship. This button returns a promise which is also added to the array of promises and upon clicking, repeats the waitForClick function. Once the player has placed all their ships, the computer then places theirs and then the gameLoop begins.
The bulk of the gameloop is controlled by a loop that executes while allSinksSunk is false for both gameboards. The loop waits for the function attackComputerSquare to return attack values when clicking on a viable computer-square. This value is passed to the receiveAttack method of the computer gameboard. The function display sunk ships is then executed, which removes the "hidden" class from the corresponding computer squares if the ship has been sunk. The game ends when allShipsSunk is true on either gameboards and the winner is displayed.

If I was to do this project again, I'd implement a better way to reveal sunk computer-ships. The way it is implemented, squares are given a "hidden" class by default and revealed by removing this class. If someone technically-savvy enough were to play it, they could cheat by using the chrome inspector to see which `div`s contained ships (but where's the fun in that?).
I also don't personally find battleships as a game, particularly fun. So I would try and figure out some ways to make the game more varied. Perhaps a wildcard square on each board that if hit, gives the attacking player the chance to reset their board.

Although the original intention for doing this project was to practice using a TDD approach to writing code, the bulk of time spent on the project was on writing functions relating to DOM interaction. Interestingly the TDD at the beginning of the project was the least problematic part of the project.  TDD on the DOM was outside of the scope of this task and maybe this is why the DOM interaction function took up the bulk of time spent on the project. If you've made it this far, thanks for reading and enjoy playing! 
