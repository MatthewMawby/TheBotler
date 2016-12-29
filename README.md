# TheBotler
A facebook chat bot to serve as your butler

Usage:
```
git clone https://github.com/MatthewMawby/TheBotler.git
cd TheBotler
npm start
```

The Botler utilizes the [node facebook chat api](https://www.npmjs.com/package/facebook-chat-api) 
to recieve and send messages. Change the login credentials at the top of botler.js to whichever
facebook account you want the botler to send messages from. Once the bot is running add it to a
group chat or direct message it to use any of it's commands.

Commands:

```
!help : Displays a help menu

!about : links to this repository

!google QUERY : constructs a 'let me google that for you' link with the given query

!random i j : chooses a random number between i and j (inclusive)

!choose arg0 ... argn : chooses a random argument

!tictac FLAG
        -print : prints the tic tac toe board
        -play LETTER XPOS YPOS : plays an X or O at the given x and y coordinate
              X/O    0-2  0-2
        -clear : clears all letters from the board
```
