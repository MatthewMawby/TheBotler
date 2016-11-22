var login = require("facebook-chat-api")
var board = ['- - -','- - -','- - -']
var moveCount = 0;
var prev_player = null;

//Logs in and receives commands
function main(){
    login({email:"facebookbutlerbot@gmail.com", password: "butlerbot"}, function callback (err, api){
        if(err) return console.error(err);

        //begin listening for messages
        api.listen(function callback(err, message){
            if (typeof message != undefined){
                if (typeof message.body != undefined){
                    var args = message.body.split(' ');
                    switch (args[0].toLowerCase()){
                        //lists all botler commands & usage
                        case ".help":
                            var send = "```\n'.help' : prints this menu\n\n";
                            send+="-----------------------\n";
                            send+= "'.about' : An introduction to the bot\n\n";
                            send+="-----------------------\n";
                            send+="'.google' : Googles whatever you type following the command\n\n";
                            send+="-----------------------\n";
                            send+="'.tictac' : Allows you to play tictactoe\n\n";
                            send+="  '.tictac -print'\n displays the current state of the board\n\n";
                            send+="  '.tictac -play X/O Xpos Ypos'\n plays the chosen letter at the given coordinate\n\n";
                            send+="  ',tictac -clear'\n resets the board\n\n";
                            send+="-----------------------\n";
                            send+="'.random min max' : Chooses a random number in the given range\n\n";
                            send+="-----------------------\n";
                            send+="'.choose opt1 opt2 ... optn' : randomly chooses an option from the provided arguments";
                            api.sendMessage(send, message.threadID);
                            break;

                        //introduction to the botler
                        case ".about":
                            api.sendMessage("Hello, I am a bot. Type '.help' for a listing of commands.", message.threadID);
                            break;

                        //constructs a let me google that for you link and sends it
                        case ".google":
                            var url = "https://lmgtfy.com/?q=";
                            if (args.length>1){
                                url+=args[1];
                            }
                            for (var g = 2; g < args.length; g++){
                                url = url+"+"+args[g];
                            }
                            api.sendMessage(url, message.threadID);
                            break;

                        //allows users to play tictactoe
                        case ".tictac":
                            tictac(args, api, message.threadID, message.senderID);
                            break;

                        //generates a random number within a certain range
                        case ".random":
                            if (args.length < 3) api.sendMessage("USAGE: '.random min max'", message.threadID);
                            else if (!Number.isInteger(parseInt(args[1])) || !Number.isInteger(parseInt(args[2]))) api.sendMessage("min and max must be integers", message.threadID);
                            else api.sendMessage(randInt(parseInt(args[1]), parseInt(args[2])).toString(), message.threadID);
                            break;

                        //chooses a random value from a range of values given by users
                        case ".choose":
                            if (args.length == 1) api.sendMessage("You didn't give me anything to choose from!", message.threadID);
                            var choice = randInt(1, args.length)
                            api.sendMessage(args[choice], message.threadID);
                            break;
                    }
                }
            }
        });
    });
}

//chooses a random integer between min and max (inclusive)
function randInt(min, max){
    return Math.floor(Math.random() * (max-min+1))+min;
}

//parses the flags and other arguments of the .tictac command
function tictac(cmd, api, thread, sender){

    //if the -print flag is given, print the board
    if (cmd[1] == "-print"){
        printboard(api, thread);
    }

    //if the -play flag is given, check for valid args and make the move
    else if (cmd[1] == "-play"){
        if (cmd[2] == "O" || cmd[2] == "X"){
            if ((cmd[3] > -1 && cmd[3] < 3) && (cmd[4] > -1 && cmd[4] < 3)){
                addLetter(cmd[2], cmd[3], cmd[4], api, thread, sender);
            }
            else{
                api.sendMessage("```\nPlease specify a location thats on the board...", thread);
            }
        }
        else{
            api.sendMessage("```\nThe only valid letters are 'O' and 'X'", thread);
        }
    }

    //clears the board
    else if (cmd[1] == "-clear"){
        clear(api, thread);
    }
}

//a function to print the tictactoe board
function printboard(api, thread){
    var send = "``` \n";
    for (var c = 0; c < board.length; c++){
        send+=board[c];
        if (c==2) continue;
        send+="\n";
    }
    send+=" ```";
    api.sendMessage(send, thread);
}

//adds a letter to the board at the given position if it is a valid placement
function addLetter(letter, xPos, yPos, api, thread, sender){
    var row = board[2-yPos].split(" ");
    if (row[xPos] == "-") row[xPos] = letter;
    else{
        api.sendMessage("```\nThere is already a letter at that position!", thread);
        return;
    }
    if (sender == prev_player)
    {
        api.sendMessage("```\nYou can't play twice in a row, wait for someone else to play.", thread);
        return;
    }
    var new_row = row.join(" ");
    board[2-yPos] = new_row;
    moveCount++;
    prev_player = sender;

    //print the board after making the move
    printboard(api, thread);

    //check for a winner after each move
    var checkwin = checkSolution(api, thread);
    if (checkwin) clear(api, thread);
}

//resets the board to its original state
function clear(api, thread){
    for (var i=0; i<3; i++){
        board[i] = "- - -";
    }
    moveCount = 0;
    api.sendMessage("```\n Board Cleared!", thread);
}

//checks to see if a player has won the game of tictactoe
function checkSolution(api, thread){

    //copies the board into a 2d array instead of an array of strings
    var solBoard = new Array(3);
    for (var i = 0; i < 3; i++){
        var tmp = board[i].split(" ");
        solBoard[i] = tmp;
    }

    //check rows & columns
    for (var x = 0; x < solBoard.length; x++){
        //check columns
        if ((solBoard[0][x] == solBoard[1][x]) && (solBoard[0][x] == solBoard[2][x]) && solBoard[0][x] != "-"){
            var send = "```\nPlayer with character " + solBoard[0][x] + " wins!";
            api.sendMessage(send, thread);
            return true;
        }

        //check rows
        else if ((solBoard[x][0] == solBoard[x][1]) && (solBoard[x][0] == solBoard[x][2]) && solBoard[x][0] != "-"){
            var send = "```\nPlayer with character " + solBoard[x][0] + " wins!";
            api.sendMessage(send, thread);
            return true;
        }
    }

    //check diagonals
    if ((solBoard[0][0] == solBoard[1][1]) && (solBoard[0][0] == solBoard[2][2]) && (solBoard[1][1]!="-")){
        var send = "```\nPlayer with character " + solBoard[0][0] + " wins!";
        api.sendMessage(send, thread);
        return true;
    }
    else if ((solBoard[0][2] == solBoard[1][1]) && (solBoard[0][2] == solBoard[2][0]) && (solBoard[1][1]!="-")){
        var send = "```\nPlayer with character " + solBoard[0][2] + " wins!";
        api.sendMessage(send, thread);
        return true;
    }

    //check for cats game
    if (moveCount == 9){
        api.sendMessage("```\nCats game!", thread);
        clear(api, thread);
    }

    //no winner yet
    return false;
}

main();
