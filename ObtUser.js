const Discord = require('discord.js');
class ObtUser{
  constructor(id){
    this.id = id;
    this.coin = 0;
    this.lastDailyDate = 0;
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
