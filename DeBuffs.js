const Discord = require('discord.js');

class DeBuff {
  constructor(name, type, duration) {
    this.name = name;
    //isBuff determines if if is a buff or debuff
    //true is a buff, false is a debuff
    this.isBuff = type;
    //Number of turns the buff lasts
    //0 = only the turn that its used, -1 = infinite duration
    this.duration = duration;
  }
}

module.exports = DeBuff;
