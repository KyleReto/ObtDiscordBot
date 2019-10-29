const Discord = require('discord.js');
class Battle{
  constructor(characterArray1, characterArray2){
    this.team1 = characterArray1;
    this.team2 = characterArray2;
  }

  //This method simulates battle, getting input values as necessary to decide turn actions.
  //Returns 0 if team 1 won, 1 if team 2 won, or -1 if the battle ended without a winner.
  async battle(client){
    let battleComplete = false;
    let winner = -1;
    while(battleComplete === false){
      let turnCharacter = battleTick();
      //Send the output of displayActions() to the owner of the turnCharacter
      turnCharacter.owner.dmChannel.send(turnCharacter.displayActions());
      let input = "";
      //await the message from the user, set input as the input string
      const filter = m => m.content.startsWith('!');
      turnCharacter.owner.dmChannel.awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
          .then(collected => input = collected[0])
          .catch(collected => battleComplete = true);
      //inputArray = the input, minus the "!", with each part separated into an array by the space character
      let inputArray = input.slice(1).trim().split(/ +/g);
      //Parse inputArray into the option being selected and the targets
      let option = inputArray[0];
      let arrayOfPossibleTargets = team1.concat(team2);
      let targets = [];
      //Add each selected target into the targets array
      for (let i = 1; i < inputArray; i++){
        targets.push(arrayofPossibleTargets[inputArray[i]]);
      }
      //Do the turn actions on the option and targets according to the turnCharacter's class.
      turnCharacter.turn(option, targets);
      //Check if team 1 is defeated
      if (isTeamDefeated(team1)){
        winner = 1;
        battleComplete = true;
      }
      //Check if team 2 is defeated
      if (isTeamDefeated(team2)){
        winner = 0;
        battleComplete = true;
      }
    }
    return winner;
  }

  //This method manages the progress of the battle, incrementing action gauges until a character can move, at which point it returns that character.
  battleTick(){
    //while(true) is bad practice, but I don't really know a better way for this problem, so...
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
      if (maxActionGauge >= 100 && maxActionGaugeCharacter.getHp() != 0){
        maxActionGaugeCharacter.setActionGauge(maxActionGauge - 100);
        return maxActionGaugeCharacter;
      }
      //Increment all characters' action gauges by their speed value / 10 (eg 225 spd = 22.5 AG per tick)
      this.team1.forEach(function (item, index) {
        if(item.getHp() != 0){
          item.setActionGauge(item.getActionGauge() + item.getSpeed());
        }
      });
      this.team2.forEach(function (item, index) {
        if(item.getHp() != 0){
          item.setActionGauge(item.getActionGauge() + item.getSpeed());
        }
      });
      //At this point, loop back from the beginning, check for 100%+ AG and try again.
    }
  }
}

function isTeamDefeated(team){
  let result = true;
  this.team1.forEach(function (item, index) {
    if (item.getHp() > 0){
      result = false;
    }
  });
  return result;
}

module.exports = Battle;
