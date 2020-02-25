//On an error, log to console (see catch at end of file)
try{
// Import the discord.js module
// See https://discord.js.org/#/docs/main/stable/general/welcome
const Discord = require('discord.js');
//Set client to reference Discord.Client() from discord.js
const client = new Discord.Client();
//Set config to the config json file (see ./config.json in this folder)
const config = require("./config.json");
//Set ObtUser to the ObtUser file (see ./ObtUser.js in this folder)
const ObtUser = require('./ObtUser.js');
//fs is Node's filestream, used to read and write files
var fs = require('fs');
//users = the users.json file containing saved user data.
let users = JSON.parse(fs.readFileSync("users.json"));

//Prefix for command input
const prefix = "?o";
/**
 * All bot code must follow the ready event
 */
client.on('ready', () => {
  console.log('I am ready!');
  client.user.setActivity(`Testing new features!`);
});
// Create an event listener for messages
//In other words, all the code in this section will be executed once for every message sent in the server
//The code will stop early if it runs into "return" and ignore the rest of the code (for that message)
client.on("message", async message => {
  //Ignore bot input (prevents looping mainly, also deals with other bots)
  if(message.author.bot) return;

  if (message.content.toLowerCase().includes("fbi open up")){
    const ATTACHMENT = new Discord.Attachment('./resources/fbiopenup.gif');

    console.log('fbi open up');

    return message.channel.send(ATTACHMENT);
  }

  //im obt methods: Removed for being... well, annoying, to be honest
  /*if (message.content.toLowerCase().includes("im ")){
    let finalString = message.content;
    finalString = finalString.slice(finalString.toLowerCase().search("im")+3);
    console.log(finalString.toLowerCase().search(" "));
    if(finalString.toLowerCase().search(" ") != -1) {
      finalString = finalString.slice(0, finalString.toLowerCase().search(" "));
    }
    console.log(finalString);
    message.channel.send("Hi "+finalString+" im obt!");
    return console.log("Im obt");
  }*/

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
    '\`?o balance\` - Gives your current amount of ObtCoins\n' +
    '\`?o daily\` - Gives you your daily 100 ObtCoins\n' +
    '\`?o transfer [@Target] [amount]\` - Transfers [amount] of ObtCoins to [@Target] from your account\n' +
    '\`?o inventory\` - See your inventory of items\n' +
    '\`?o shop\` - See the shop of items to buy'
    );
  }

  //Get userId from message
  var userId = ObtUser.getUserIndexById(message.author.id, users);

  //If the user is unregistered
  if (userId === -1){
    //Register them
    if (ObtUser.getUserIndexById(message.author.id,users) === -1){
      var newUser = new ObtUser(message.author.id);
      users.push(newUser);
      //This bit of code updates users.
      saveUsers(users);
      //Update userId to point to the new user's index
      userId = ObtUser.getUserIndexById(message.author.id, users);
    }
  }

  /*EXAMPLE COMMAND: SENDING A MESSAGE
  To start a command, do if (command === ``[commandtexthere]``)
  The 'command' variable is the first word of the message after ?o, converted to lowercase
      Do note that command will always be all lowercase
  All words after the command (all strings separated by spaces) will be saved in the args[] array.
      The second word is args[0], third is args[1], etc etc.
      Generally, this is used for other information a command needs once the command is known
          eg In Tatsumaki, you can do !t avatar @username. "avatar" is the command, "@username" is the first argument (args[0])
  */
  if (command === "debugping"){
    /*
    If you start a line with 'return' like is done here, all code after that line will be ignored.
        As a general rule, use `return` before the final line in the code of whatever you're doing (otherwise you'll be wasting some processing power by doing a bunch of unnecessary checks on the message)
    `message` here refers to the message that the event handler is currently looking at
    `channel` is a "property" of `message`. It refers to the channel the message is found in.
        To learn more about the properties of various objects, see the discord.js documentation on that object
    `send()` is a "method" of the channel object. In this case, you're running the send() method on the channel from before
    `send()` takes a string here, so in the parentheses you put down the message you want to send
        For more information on the methods of various objects, see the discord.js documentation on that object
    */
    return message.channel.send("pong");
    /*
    Alternatively, you can use `message.reply("text")` instead of message.channel.send.
    The reply() method of the message obejct replies to the message directly, by typing @[sendername], [messagehere]
        ex: message.reply("Hello"); will look like "@Shabacka, Hello"*/
  }

  //EXAMPLE COMMAND: SENDING AN IMAGE
  if (command === "vibecheck") {
    /*
    Set the constant `ATTACHMENT` to be a new Attatchment object from the Discord module
        A constant, (final in other languages) is like a variable but you can't change it.
        When making constants, name them in all caps and separate parts of the name with "_" (Ex: ATTACHMENT_NAME)
        As a general rule, if something should never be changed, make it a constant.
    The Attachment "constructor" takes an image file path (the directions to an image file) as a string
        ./ = In the same folder as this document
        resources/ = From there, in the folder titled "resources"
        vibecheck.jpg = The file called "vibecheck.jpg" (You need the file ending
    The image used for this command can be found in the resources folder, which is where you should put pretty much every file used by the bot other than this one.
    */
    const ATTACHMENT = new Discord.Attachment('./resources/vibecheck.gif');
    //Send a message that consists of the Attachment object in the ATTACHMENT constant from above.
    //Log the text "vibecheck" into the console (The window you see when you run obt on your computer).
    //`console.log`s are mostly for debugging purposes, they don't do anything practical.
    console.log('vibecheck');
    return message.channel.send(ATTACHMENT);
    
  }

  // How Cute command
  if (command == "how cute") {
    //grab how cute
    const ATTACHMENT = new Discord.Attachment('./resources/howcute.jpg');

    //print to console
    console.log('howcute');

    //send pic
    return message.channel.send(ATTACHMENT);
  }

  // Medic Bag Command
  if (command == "i need a medic bag"){
    const ATTACHMENT = new Discord.Attachment('./resources/medicbag.png');

    console.log('fbi open up');

    return message.channel.send(ATTACHMENT);
  }

  //Bruh Moment Command
  if (command == "bruh moment"){
    //grab bruh Moment
    const ATTACHMENT = new Discord.Attachment('./resources/bruhMoment.png');

    //print to console
    console.log('THIS IS A CERTIFIED BRUH MOMENT');

    //print message
    message.channel.send('THIS IS A CERTIFIED BRUH MOMENT');

    //send IMAGE
    return message.channel.send(ATTACHMENT);
  }
  
  //Piranha Plant command
  if (command == "piranha plant"){
    message.channel.send('**DID SOMEONE SAY PIRANHA PLANT?!**');
    message.channel.send('I wrote my thesis on Piranha Plants! There are just so many species! You got your basic Piranha Plants, your Fire Piranha Plants, Ptooies, Nipper Plants, Nipper Spores, Munchers, Jumping Piranhas, Wild Ptooie Piranhas, Propeller Piranhas, Naval Piranhas, Chewies, Megasmilax, Piranha Pests, Piranha Sprouts, Frost Piranhas, Putrid Piranhas, Proto Piranhas, Piranhabons, Piranha Beans, Mom Piranhas, Small Piranhas, Elasto-Piranhas, Piranha Planets, Bungee Piranhas, Big Bungee Piranhas, Ghosts, Nipper Dandelions, Spiny Piranhas, Dino Piranhas, Fire Stalking Piranhas, Piranha Plorps, River Piranhas, Big Piranhas, Stalking Piranhas, Big Fire Piranhas, Prickly Piranhas, Peewee Piranhas, Inky Piranhas, Gold Piranhas, Bone Piranhas, Big Bone Piranhas, Piranha Pods, Piranha Creepers, Nipper Spore Patches, Paper Fire Piranhas, Poison Piranhas, Big Poison Piranhas, Upside-Down Piranhas, Petey Piranha, Paper Petey Piranha, Petea Piranha-');
    message.channel.send('I haven\'t even started on all the minor variations!');
    return console.log("Piranha Plant");
  }
  
  //excuse me command
  if (command === "excuseme") {
    //grab excuse me
    const ATTACHMENT = new Discord.Attachment('./resources/excuseme.gif');

    //print to console
    console.log('excuseme');

    //send pic
    return message.channel.send(ATTACHMENT);
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
      saveUsers(users);
      return;
    } else {
      return message.reply("you've already claimed your daily ObtCoins");
    }
  }

  //Transfer money to another user
  if (command === "transfer"){
    //Set relevant users, send error message if necessary
    try{
      ObtUser.getUserIndexById(message.mentions.users.first().id, users);
      var payer = ObtUser.getUserIndexById(message.author.id, users);
    } catch (e){
      return message.reply("please mention a user (@Username) to use this command!");
    }
    //If the input is a valid number input
    var amount = parseInt(args[1]);
    if (typeof !amount.isNan() && amount != 0){
      //If the payer can afford the input amount
      try{
        if (amount <= users[payer].coin){
          ObtUser.transfer(message.author.id, message.mentions.users.first().id, users, amount);
          message.reply(amount + " ObtCoins successfully sent to " + message.mentions.users.first());
          saveUsers(users);
          return;
        } else {
          return message.reply("you can't afford that!");
        }
      }catch (e){
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

  //Shop: Display a list of items
  if (command === "shop"){
    return message.channel.send("" +
    "Type \`?o buy [item number]\` to buy an item.\n" +
    "1. Uno Reverse Card - 50 Coin\n"+
    "2. God Role - 10000000 Coin\n" +
    "3. The Pass - 1000 Coin"
  );
  }

  //Buy: Buy an item from the Shop
  if (command === "buy"){
    let items = [["Uno Reverse Card", 50], ["God Role - How did you even get this item?",10000000], ["The Pass", 1000]];
    //If the user can't afford that item
    try{
      if (users[userId].coin < items[args[0]-1][1]){
        return message.reply("you can't afford that!");
      } else{
        if (items[args[0]-1][0] === "The Pass"){
          //Currently you can still buy this even if you have the role, correct this if you like.
          console.log("Granting pass");
          message.member.addRole("539247904553041930");
        }
        if (items[args[0]-1][0] === "God Role - How did you even get this item?"){
          console.log("Granting God Role");
          message.member.addRole("375449062528385027");
          message.channel.send("How did you even afford this?");
        }
        //Subtract the correct amount of coin
        users[userId].coin -= items[args[0]-1][1];
        //Add the item to the user's inventory
        users[userId].inventory.push(items[args[0]-1][0]);

        saveUsers(users);

        //Give confirmation message
        return message.reply(items[args[0]-1][0]+" successfully purchased!");
      }
    } catch (e){
      message.reply("please enter a valid item to purchase");
    }
  }

  //Inventory: Display the user's inventory
  //Will display multiple copies of an item, feel free to add quantity display
  if (command === "inventory"){
    let output = "Inventory:\n";
    for (i = 0; i < users[userId].inventory.length; i++){
      output += (users[userId].inventory[i].toString() + "\n");
    }
    return message.channel.send(output);
  }

  //NoU: Uses an Uno Reverse Card
  if (command === "nou") {
    let item = 'Uno Reverse Card';
    //Checks\ the inventory for a reverse Card
    for (var i = 0; i <= users[userId].inventory.length; i++){
      if(users[userId].inventory[i] === item){
        //Removes the card from the user's inventory
        users[userId].inventory.splice(i,1);
        //Grabs the reverse card image
        const ATTACHMENT = new Discord.Attachment('./resources/uno.jpg');
        //returns the reverse card image
        return message.channel.send(ATTACHMENT);
      }else{
        //returns if the user doesn't have an uno card
        return message.channel.send("... you can't");
      }
    }
  }

  //Kirby of Dissapointment command
  if (command === "kirb") {
    //grab Sad kirby
    const ATTACHMENT = new Discord.Attachment('./resources/kirb.jpg');

    //print to console
    console.log('kirb');

    //send message
    message.channel.send('...');

    //send pic
    return message.channel.send(ATTACHMENT);
  }

});

client.login(config.token);
}catch(e){
  console.log(e);
}

function saveUsers(users){
  fs.writeFile("users.json", JSON.stringify(users), function(err) {
    if (err) {
      console.log(err);
    }
  });
}
