const Discord = require('discord.js');
const DeBuff = require('./DeBuffs.js');

class Card {
  constructor(emoji) {
    //The emoji that cooresponds with the card
    this.emoji = emoji;
    //The speed stat of the card
    this.speed = 0;
    //The effect this card has as a function
    this.effect;
  }

  static yamcha(attacker, defender) {
    let buff = new DeBuff("Invincible", true, 0);
    attacker.buffs.push(buff);
    return attacker.name + " is playing dead!";
  }

  static test1(attacker, defender) {
    return attacker.name + " performs test attack 1!";
  }
}

module.exports = Card;
