//On an error, log to console (see catch at end of file)
try{
// Import the discord.js module
// See https://discord.js.org/#/docs/main/stable/general/welcome
const Discord = require('discord.js');
//Set client to reference Discord.Client() from d iscord.js
const client = new Discord.Client();
//Set config to the config json file (see ./config.json in this folder)
const config = require("./config.json");
//Set ObtUser to the ObtUser file (see ./ObtUser.js in this folder)
const ObtUser = require('./ObtUser.js');
//fs is Node's filestream, used to read and write files
var fs = require('fs');
//users = the users.json file containing saved user data.
const users = JSON.parse(fs.readFileSync("users.json"));

//Prefix for command input
const prefix = "?o"
/**
 * All bot code must follow the ready event
 */
client.on('ready', () => {
  console.log('I am ready!');
  client.user.setActivity(`Testing new features!`);
});

// Create an event listener for messages
//In other words, All the code in this section will be executed once for every message sent in the server
//The code will stop early if it runs into "return" and ignore the rest of the code (for that message)
client.on("message", async message => {
  //Ignore bot input (prevents looping mainly, also deals with other bots)
  if(message.author.bot) return;
  //Ignore messages without the prefix
  if(message.content.indexOf(prefix) !== 0) return;
  //format for input is "command args[1] args[2] args[3]..." with single space as the delimiter
  //This bit is kind of complicated, you can ignore it
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //Debug: Log all commands and args to console for debug purposes
  console.log("Commands: \n " + JSON.stringify(command));
  console.log("Arguments: \n " + JSON.stringify(args));

  //Help command: gives a basic overview of command options.
  if (command === "help"){
    return message.channel.send(''+
    'To enter a command, type \`?o [command]\`\n' +
    'Valid commands: \n' +
    '\`?o register\` - Register yourself in Obt (You only need to do this once)\n' +
    '\`?o balance\` - Gives your current amount of ObtCoins\n' +
    '\`?o daily\` - Gives you your daily 100 ObtCoins\n' +
    '\`?o transfer [@Target] [amount]\` - Transfers [amount] of ObtCoins to [@Target] from your account\n'
    );
  }

  if (command === "register"){
    //Register a new user (or reply with a message if they're already registered)
    if (ObtUser.getUserIndexById(message.author.id,users) === -1){
      var newUser = new ObtUser(message.author.id);
      users.push(newUser);
      //This bit of code updates users.
      fs.writeFile("users.json", JSON.stringify(users), function(err) {
        if (err) {
          console.log(err);
        }
      });
      return message.reply('you are now registered!');
    } else {
      return message.reply('you\'re already registered!');
    }
  }

  //Get userId from message
  var userId = ObtUser.getUserIndexById(message.author.id, users);

  //Give unregistered user warning if they are unregistered, skip other checks (that may cause crashes) if they are.
  if (userId === -1){
    return message.reply("please use `?o register` before using other commands.");
  }

  if (command === "debuguserarray"){
    //Output the array of the users to the console for debug purposes
    return console.log(JSON.stringify(users));
  }

  //EXAMPLE COMMAND
  //To start a command, do if (command === "[commandtexthere]")
  //The 'command' variable is the first word of the message after ?o, converted to lowercase
    //Do note that command will always be all lowercase
  if (command === "debugping"){
    //If you start a line with 'return' like is done here, all code afterward will be ignored.
      //As a general rule, use `return` before the final line in the code of whatever you're doing (otherwise you'll be wasting some processing power)
    //`message` here refers to the message that the event handler is currently looking at
    //`channel` is a "property" of `message`. It refers to the channel the message is found in.
      //To learn more about the properties of various objects, see the discord.js documentation on that object
    //`send()` is a "method" of the channel object. In this case, you're running the send() method on the channel from before
    //`send()` takes a string here, so in the parentheses you put down the message you want to send
      //For more information on the methods of various objects, see the discord.js documentation on that object
    return message.channel.send("pong");
    //Alternatively, you can use `message.reply("text")` instead of message.channel.send.
    //The reply() method of the message obejct replies to the message directly, by typing @[sendername], [messagehere]
      //ex: message.reply("Hello") will look like "@Shabacka, Hello"
  }

  if (command === "daily"){
    //Give the user their daily ObtCoin allowance
    //If the date today and the last daily date are different
    //Known bug: If a user tries to retrieve their daily coins on the same date of the month as the last time they did (eg. last retrieved - Feb 16, current date Mar 16), it will fail due to "already claiming their coins".
    //Fix this if you like, I'm not planning to since that case is very unlikely and has very little consequence. Remove these comments if you do.
    if (new Date(Date.now()).getDate() != users[userId].lastDailyDate){
      message.reply("here is your daily 100 ObtCoins.");
      users[userId].coin += 100;
      //Set daily date to today
      users[userId].lastDailyDate = new Date(Date.now()).getDate();
      //Rewrite the json file storing all users
      fs.writeFile("users.json", JSON.stringify(users), function(err) {
        if (err) {
          console.log(err);
        }
      });
      return;
    } else {
      return message.reply("you've already claimed your daily ObtCoins");
    }
  }

  //Transfer money to another user
  if (command === "transfer"){
    //Set relevant users, send error message if necessary
    try{
      var payee = ObtUser.getUserIndexById(message.mentions.users.first().id, users);
      var payer = ObtUser.getUserIndexById(message.author.id, users);
    } catch {
      return message.reply("please mention a user (@Username) to use this command!");
    }
    //If the input is a valid number input
    var amount = parseInt(args[1]);
    if (typeof amount != NaN && amount != 0){
      //If the payer can afford the input amount
      try{
        if (amount <= users[payer].coin){
          ObtUser.transfer(message.author.id, message.mentions.users.first().id, users, amount);
          message.reply(amount + " ObtCoins successfully sent to " + message.mentions.users.first());
          fs.writeFile("users.json", JSON.stringify(users), function(err) {
            if (err) {
              console.log(err);
            }
          });
          return;
        } else {
          return message.reply("you can't afford that!");
        }
      }catch{
        return message.reply("that user isn't registered.");
      }
    } else {
      return message.reply("please enter a valid number input.");
    }
  }

  //Give the user their current balance of ObtCoins
  if (command === "balance"){
    return message.reply("you have " + users[userId].coin + " ObtCoins");
  }

});

client.login(config.token);
}catch(e){
  console.log(e);
}
