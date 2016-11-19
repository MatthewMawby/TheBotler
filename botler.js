var login = require("facebook-chat-api")
var board = ['- - -','- - -','- - -']

function main(){
    login({email:"facebookbutlerbot@gmail.com", password: "butlerbot"}, function callback (err, api){
        if(err) return console.error(err);

        api.listen(function callback(err, message){
            var args = message.body.split(' ');
            switch (args[0].toLowerCase()){
                case ".about":
                    api.sendMessage("Hello, I am a bot.", message.threadID);
                    break;

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

                case ".tictac":
                    tictac(args, api, message.threadID);
                    break;

                case ".random":
                    if (args.length < 3) api.sendMessage("USAGE: '.random min max'", message.threadID);
                    else if (!Number.isInteger(parseInt(args[1])) || !Number.isInteger(parseInt(args[2]))) api.sendMessage("min and max must be integers", message.threadID);
                    api.sendMessage(randInt(parseInt(args[1]), parseInt(args[2])).toString(), message.threadID);
                    break;

                case ".choose":
                    if (args.length == 1) api.sendMessage("You didn't give me anything to choose from!", message.threadID);
                    var choice = randInt(1, args.length)
                    api.sendMessage(args[choice], message.threadID);
                    break;
            }
        });
    });
}

function randInt(min, max){
    return Math.floor(Math.random() * (max-min+1))+min;
}

function tictac(cmd, api, thread){
    if (cmd[1] == "-print")
    {
        printboard(api, thread);
    }
    else if (cmd[1] == "-play")
    {
        if (cmd[2] == "O" || cmd[2] == "X")
        {
            if ((cmd[3] > -1 && cmd[3] < 3) && (cmd[4] > -1 && cmd[4] < 3))
            {
                addLetter(cmd[2], cmd[3], cmd[4], api, thread);
            }
            else
            {
                api.sendMessage("```\nPlease specify a location thats on the board...", thread);
            }
        }
        else
        {
            api.sendMessage("```\nThe only valid letters are 'O' and 'X'", thread);
        }

    }

    else if (cmd[1] == "-clear")
    {
        clear(api, thread);
    }
}

function printboard(api, thread){
    var send = "``` \n";
    for (var c = 0; c < board.length; c++)
    {
        send+=board[c];
        if (c==2) continue;
        send+="\n";
    }
    send+=" ```";
    api.sendMessage(send, thread);
}

function addLetter(letter, xPos, yPos, api, thread)
{
    var row = board[2-yPos].split(" ");
    row[xPos] = letter;
    var new_row = row.join(" ");
    board[2-yPos] = new_row;
    printboard(api, thread);
    var checkwin = checkSolution(api, thread);
    if (checkwin)
    {
        clear(api, thread);
    }
}

function clear(api, thread)
{
    for (var i=0; i<3; i++)
    {
        board[i] = "- - -";
    }
    api.sendMessage("```\n Board Cleared! \n```", thread);
}

function checkSolution(api, thread)
{
    var solBoard = new Array(3);
    for (var i = 0; i < 3; i++)
    {
        var tmp = board[i].split(" ");
        solBoard[i] = tmp;
    }

    //check rows & columns
    for (var x = 0; x < solBoard.length; x++)
    {
        //check columns
        if ((solBoard[0][x] == solBoard[1][x]) && (solBoard[0][x] == solBoard[2][x]) && solBoard[0][x] != "-")
        {
            var send = "```\nPlayer with character " + solBoard[0][x] + " wins!\n```";
            api.sendMessage(send, thread);
            return true;
        }

        //check rows
        else if ((solBoard[x][0] == solBoard[x][1]) && (solBoard[x][0] == solBoard[x][2]) && solBoard[x][0] != "-")
        {
            var send = "```\nPlayer with character " + solBoard[x][0] + " wins!\n```";
            api.sendMessage(send, thread);
            return true;
        }
    }

    //check diagonals
    if ((solBoard[0][0] == solBoard[1][1]) && (solBoard[0][0] == solBoard[2][2]) && (solBoard[1][1]!="-"))
    {
        var send = "```\nPlayer with character " + solBoard[0][0] + " wins!\n```";
        api.sendMessage(send, thread);
        return true;
    }
    else if ((solBoard[0][2] == solBoard[1][1]) && (solBoard[0][2] == solBoard[2][0]) && (solBoard[1][1]!="-"))
    {
        var send = "```\nPlayer with character " + solBoard[0][2] + " wins!\n```";
        api.sendMessage(send, thread);
        return true;
    }
    return false;
}

main();
