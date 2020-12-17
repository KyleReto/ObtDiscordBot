const Discord = require('discord.js');

class Player {
  constructor(name) {
    //Name is the username of the player
    this.name = name;
    //Health is the amount of damage a player can take before being losing
    this.health = 25;
    //Buffs is a list of buffs that the player has
    this.buffs = [];
    //Debuffs is a list of debuffs that the player has
    this.debuffs = [];
    //Hand is the player's hand, which contains the cards they currently have
    this.hand = [];
  }
}

module.exports = Player;
