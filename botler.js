var login = require("facebook-chat-api")

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
        else
        {
            api.sendMessage(message.body, message.threadID);
        }
    });
});
