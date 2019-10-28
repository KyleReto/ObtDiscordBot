const Discord = require('discord.js');
//This is a class, ObtUser, which stores various details about each user of the bot.
//This is separate from Discord.js' user class, because we have other data to store.
//To convert from discord User to ObtUser, use the getUserIndexById() method
//To convert the other way, this.id refers to the discord id
class ObtUser{
  constructor(id){
    //The user's discord id (Snowflake type)
    this.id = id;
    //The user's ObtCoins. Should always be an integer.
    this.coin = 0;
    //The last date (eg 31 for the 31st of a month) a user has taken their daily coins.
    this.lastDailyDate = 0;
    //The user's inventory
    this.inventory = [];
  }
  //Given an id and an array, search an array of ObtUsers for a given user by id
  //Returns -1 if no user with a matching id is found, or the index if they are.
  static getUserIndexById(id, array){
    for (var i = 0; i < array.length; i++){
      if (array[i].id === id){
        return i;
      }
    }
    return -1
  }
  //Tranfers money one user to another
  //id1 = id of sender, id2 = id of reciever, array = array of users, amount = (positive integer) amount to tranfer
  //Returns the amount transfered if successful, or -1 if the other user was not found
  static transfer(id1, id2, array, amount){
    var sender = array[ObtUser.getUserIndexById(id1, array)];
    var target = array[ObtUser.getUserIndexById(id2, array)];
    if (target != -1 && sender != -1){
      target.coin = target.coin +  amount;
      sender.coin = sender.coin - amount;
    } else {
      return -1;
    }
  }
}
module.exports = ObtUser;
