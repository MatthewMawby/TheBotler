var login = require("facebook-chat-api")
var board = ['- - -','- - -','- - -']

function main(){
    login({email:"facebookbutlerbot@gmail.com", password: "butlerbot"}, function callback (err, api){
        if(err) return console.error(err);

        api.listen(function callback(err, message){
            var cmd = message.body.split(' ');
            if (cmd[0]==".about")
            {
                api.sendMessage("Hello, I am a bot.", message.threadID);
            }
            else if (cmd[0]==".google")
            {
                var url = "https://lmgtfy.com/?q=";
                if (cmd.length>1){
                    url+=cmd[1];
                }
                for (var g = 2; g < cmd.length; g++)
                {
                    url = url+"+"+cmd[g];
                }
                api.sendMessage(url, message.threadID);
            }
            else if (cmd[0]==".tictac")
            {
                tictac(cmd, api, message.threadID);
            }
            else
            {
                api.sendMessage(message.body, message.threadID);
            }
        });
    });
}

function tictac(cmd, api, thread){
    if (cmd[1] == "-print")
    {
        printboard(api, thread);
    }
    else if (cmd[1] == "-play")
    {
        addLetter(cmd[2], cmd[3], cmd[4], api, thread);
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
}

function clear(api, thread)
{
    for (var i=0; i<3; i++)
    {
        board[i] = "- - -";
    }
    api.sendMessage("```\n Board Cleared! \n```", thread);
}

main();
