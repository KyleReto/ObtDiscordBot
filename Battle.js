const Discord = require('discord.js');
class Battle{
  constructor(characterArray1, characterArray2){
    this.team1 = characterArray1;
    this.team2 = characterArray2;
  }
  //This method manages the progress of the battle, incrementing action gauges until a character can move, at which point it returns that character.
  battleTick(){
    //This is bad practice, but I don't really know a better way for this problem, so...
    while(true){
      //Find the max action gauge and the character it belongs to
      let maxActionGauge = 0;
      let maxActionGaugeCharacter = team1[0];
      this.team1.forEach(function (item, index) {
        if (item.getActionGauge() > maxActionGauge){
          maxActionGauge = item.getActionGauge();
          maxActionGaugeCharacter = item;
        }
      });
      this.team2.forEach(function (item, index) {
        if (item.getActionGauge() > maxActionGauge){
          maxActionGauge = item.getActionGauge();
          maxActionGaugeCharacter = item;
        }
      });
      //If the max is over 100(%), decrement it by 100 and return the character
      if (maxActionGauge >= 100){
        maxActionGaugeCharacter.setActionGauge(maxActionGauge - 100);
        return maxActionGaugeCharacter;
      }
      //Increment all characters' action gauges by their speed value / 10 (eg 225 spd = 22.5 AG per tick)
      this.team1.forEach(function (item, index) {
        item.setActionGauge(item.getActionGauge() + item.getSpeed());
      });
      this.team2.forEach(function (item, index) {
        item.setActionGauge(item.getActionGauge() + item.getSpeed());
      });
      //At this point, loop back from the beginning, check for 100%+ AG and try again.
    }
  }
}
module.exports = Battle;
