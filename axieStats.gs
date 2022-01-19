/*====================================================================================================================================*
  Get Axie Stats by Jasper Gabriel (KS Hyun-)
  ====================================================================================================================================
  Version:         1.1.1
  Project Page:    https://github.com/JasperGab/axie-stats
  Copyright:       (c) 2021 by Jasper Gabriel
  License:         GNU General Public License, version 3 (GPL-3.0) 
                   http://www.opensource.org/licenses/gpl-3.0.html
  Ronin Address:   ronin:16aa6b0d2bfb0d1cfa74f5dfbc765408896720c2
  ETH/BSC Address: 0x994CCa07C9f25Fe84211eA61b61EaB5552A32c6d
  ------------------------------------------------------------------------------------------------------------------------------------
  A function to get axie stats for my axie damage calculator google sheet.
  
  This function utilizes Sky Mavis' APIs.

  For future enhancements see https://github.com/jasperg/
  
  For bug reports see https://github.com/JasperGab/axie-stats/issues
  ------------------------------------------------------------------------------------------------------------------------------------
  Changelog:

  1.0.0  Initial release
  1.1.0  Include calculation for most card effect bonuses
  1.1.1  Update skill calculations with S20 changes
 *====================================================================================================================================*/

/**
 * Import Axie data used for damage calculations
 *
 * @param {axieId}  ID of Axie
 * @return 
 * @customfunction
 **/
function getAxieStats() {
  /**  
   * Replace with your Axie's ID
  **/
  var axieId = SpreadsheetApp.getActiveSpreadsheet().getRange('B13').getValue();

  var url = 'https://graphql-gateway.axieinfinity.com/graphql';
  var options = {};
  options["method"] = "post";
  options["contentType"] = "application/json";
  options["payload"] = JSON.stringify({
      "operationName": "GetAxieDetail",
      "query": "query GetAxieDetail($axieId: ID!) {\n  axie(axieId: $axieId) {\n    ...AxieDetail\n    __typename\n  }\n}\n\nfragment AxieDetail on Axie {\n  id\n  image\n  class\n  chain\n  name\n  genes\n  owner\n  birthDate\n  bodyShape\n  class\n  sireId\n  sireClass\n  matronId\n  matronClass\n  stage\n  title\n  breedCount\n  level\n  figure {\n    atlas\n    model\n    image\n    __typename\n  }\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  ownerProfile {\n    name\n    __typename\n  }\n  battleInfo {\n    ...AxieBattleInfo\n    __typename\n  }\n  children {\n    id\n    name\n    class\n    image\n    title\n    stage\n    __typename\n  }\n  __typename\n}\n\nfragment AxieBattleInfo on AxieBattleInfo {\n  banned\n  banUntil\n  level\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n",
      "variables": {
          "axieId": axieId
      }
  });

  var fetchResult = UrlFetchApp.fetch(url, options);
  var result = JSON.parse(fetchResult.getContentText());

  /**  
   * Axie Info
  **/
  var image = result.data.axie.image;
  var name = result.data.axie.name;
  var birthDate = result.data.axie.birthDate;
  var axieClass = result.data.axie.class;
  var sireClass = result.data.axie.sireClass;
  var matronClass = result.data.axie.matronClass;
  birthDate = (new Date(birthDate * 1000)).toDateString();

  /**  
   * Axie Stats
  **/
  var hp = result.data.axie.stats.hp;
  var speed = result.data.axie.stats.speed;
  var skill = result.data.axie.stats.skill;
  var morale = result.data.axie.stats.morale;

  /**  
   * Axie Parts
  **/
  var backClass = result.data.axie.parts[2].class;
  var backName = result.data.axie.parts[2].name;
  var backAttack = result.data.axie.parts[2].abilities[0].attack;
  var backDefense = result.data.axie.parts[2].abilities[0].defense;
  // var backImage = result.data.axie.parts[2].abilities[0].backgroundUrl;

  var mouthClass = result.data.axie.parts[3].class;
  var mouthName = result.data.axie.parts[3].name;
  var mouthAttack = result.data.axie.parts[3].abilities[0].attack;
  var mouthDefense = result.data.axie.parts[3].abilities[0].defense;
  // var mouthImage = result.data.axie.parts[3].abilities[0].backgroundUrl;

  var hornClass = result.data.axie.parts[4].class;
  var hornName = result.data.axie.parts[4].name;
  var hornAttack = result.data.axie.parts[4].abilities[0].attack;
  var hornDefense = result.data.axie.parts[4].abilities[0].defense;
  // var hornImage = result.data.axie.parts[4].abilities[0].backgroundUrl;

  var tailClass = result.data.axie.parts[5].class;
  var tailName = result.data.axie.parts[5].name;
  var tailAttack = result.data.axie.parts[5].abilities[0].attack;
  var tailDefense = result.data.axie.parts[5].abilities[0].defense;
  // var tailImage = result.data.axie.parts[5].abilities[0].backgroundUrl;

  /**  
   * Set Axie Info Value to Cells
  **/
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('A1:C11').setValue(`=image("${image}")`);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B14').setValue(name);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B15').setValue(axieClass);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B16').setValue(birthDate);

  /**  
   * Set Axie Stats Value to Cells
  **/
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B17').setValue(hp);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B18').setValue(speed);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B19').setValue(skill);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B20').setValue(morale);

  /**  
   * Set Axie Parts Value to Cells
  **/
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('D8').setValue(backName);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('E8').setValue(backClass);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('F8').setValue(backAttack);
  // SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('9').setValue(backDefense);

  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('D9').setValue(mouthName);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('E9').setValue(mouthClass);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('F9').setValue(mouthAttack);
  // SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('9').setValue(mouthDefense);

  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('D10').setValue(hornName);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('E10').setValue(hornClass);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('F10').setValue(hornAttack);
  // SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B10').setValue(hornDefense);

  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('D11').setValue(tailName);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('E11').setValue(tailClass);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('F11').setValue(tailAttack);
  // SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B15').setValue(tailDefense);

  return result.data.axie.id;
}

/**
 * Get Axie's card damage when played alone in a round.
 *
 * @param {axieClass}  Class of your Axie
 * @param {cardClass}  Class of your card
 * @param {enemyAxieClass}  Class of enemy Axie
 * @param {baseDamage}  Base damage of your card
 * @param {skill}  Skill stat of your Axie
 * @param {combo}  Combo if true or false
 * @return 
 * @customfunction
 **/
function getDamage(axieClass, cardClass, enemyAxieClass, baseDamage, skill, attackModifier, combo = false) {
  var sameClassBonus;
  var classAdvantageBonus;
  var skillBonusDamage = 1;

  // STAB (Same Type Attack Bonus)
  sameClassBonus = getSameCardAndBodyClassBonus(cardClass, axieClass);
  // RPS (Rock Paper Scissors Advantage)
  classAdvantageBonus = getClassAdvantageBonus(cardClass, enemyAxieClass);

  if (combo && baseDamage > 0) {
    skillBonusDamage = 1 + (skill * 0.55 - 12.25)/100;
  }

  var attackModifierBonus = 1 + (attackModifier * .2);
  
  var calculatedDamage = Math.floor(baseDamage * skillBonusDamage * sameClassBonus * classAdvantageBonus * attackModifierBonus)

  return calculatedDamage;
}

/**
 * Get Axie's card effect bonus damage.
 *
 * @param {axieClass}  Class of your Axie
 * @param {cardClass}  Class of your card
 * @param {enemyAxieClass}  Class of enemy Axie
 * @param {baseDamage}  Base damage of your card
 * @param {skill}  Skill stat of your Axie
 * @param {cardName}  Name of Card
 * @param {combo}  Combo if true or false
 * @return 
 * @customfunction
 **/
function getSpecialDamage(axieClass, cardClass, enemyAxieClass, baseDamage, skill, attackModifier, partName, combo = false) {
  var sameClassBonus;
  var classAdvantageBonus;
  var skillBonusDamage = 1;
  var cardEffectBonusDamage = 1;

  // STAB (Same Type Attack Bonus)
  sameClassBonus = getSameCardAndBodyClassBonus(cardClass, axieClass);
  // RPS (Rock Paper Scissors Advantage)
  classAdvantageBonus = getClassAdvantageBonus(cardClass, enemyAxieClass);

  if (combo && baseDamage > 0) {
    skillBonusDamage = 1 + (skill * 0.55 - 12.25)/100;
  }

  // Fix Pocky and Bug Splat
  if (partName == 'Thorny Caterpillar') {
    cardEffectBonusDamage = 1.3;
  } else if (partName == 'Cactus') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Lam') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Nut Cracker') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Nut Cracker') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Scaly Spear') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Trump') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Tiny Dino') {
    cardEffectBonusDamage = 1.5;
  } else if (partName == 'Pupae') {
    cardEffectBonusDamage = 2;
  } else if (partName == 'Beech') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Babylonia') {
    cardEffectBonusDamage = 1.3;
  } else if (partName == 'Feather Spear') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Swallow') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Navaga') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Pliers') {
    cardEffectBonusDamage = 1.3;
  } else if (partName == 'Risky Beast') {
    cardEffectBonusDamage = 1.5;
  } else if (partName == 'Pocky') {
    cardEffectBonusDamage = 1.2;
  } else if (partName == 'Cerastes') {
    cardEffectBonusDamage = 1.3;
  } else if (partName == 'Square Teeth') {
    cardEffectBonusDamage = 2;
  // } else if (partName == 'Furball') {
  // } else if (partName == 'Twin Tail') {
  // } else if (partName == 'Ronin') {
  // } else if (partName == 'Sandal') {
  } else {
    return 'n/a';
  }

  var attackModifierBonus = 1 + (attackModifier * .2);

  var calculatedDamage = Math.floor(baseDamage * skillBonusDamage * sameClassBonus * classAdvantageBonus * attackModifierBonus * cardEffectBonusDamage)

  return calculatedDamage;
}

/**
 * Get for Axie card class advantage bonus using card's class and enemy Axie's class.
 *
 * @param {axieClass}  Class of your Axie
 * @param {cardClass}  Class of your card
 * @param {enemyAxieClass}  Class of enemy Axie
 * @param {baseDamage}  Base damage of your card
 * @param {skill}  Skill stat of your Axie
 * @return 
 * @customfunction
 **/
function getSameCardAndBodyClassBonus(cardClass, axieClass) {
  var sameClassBonus = 1;
  var reptilePlant = ['Reptile', 'Plant', 'Dusk'];
  var aquaBird = ['Aquatic', 'Bird', 'Dawn'];
  var beastBug = ['Beast', 'Bug', 'Mech'];

  if (axieClass == cardClass) {
    sameClassBonus = 1.10;
  }

  if (axieClass == 'Dusk' && reptilePlant.includes(cardClass)) {
    sameClassBonus = 1.075;
  }
  
  if (axieClass == 'Dawn' && aquaBird.includes(cardClass)) {
    sameClassBonus = 1.075;
  }
  
  if (axieClass == 'Mech' && beastBug.includes(cardClass)) {
    sameClassBonus = 1.075;
  }
  
  return sameClassBonus;
}

/**
 * Get for Axie card class advantage bonus using card's class and enemy Axie's class.
 *
 * @param {axieClass}  Class of your Axie
 * @param {cardClass}  Class of your card
 * @param {enemyAxieClass}  Class of enemy Axie
 * @param {baseDamage}  Base damage of your card
 * @param {skill}  Skill stat of your Axie
 * @return 
 * @customfunction
 **/
function getClassAdvantageBonus(cardClass, enemyAxieClass) {
  var classAdvantageBonus = 1;
  var reptilePlantDusk = ['Reptile', 'Plant', 'Dusk'];
  var aquaBirdDawn = ['Aquatic', 'Bird', 'Dawn'];
  var beastBugMech = ['Beast', 'Bug', 'Mech'];

  /* 
   * Class: Plant, Reptile, Dusk
   * Strong: Aqua, Bird, Dawn
   * Weak: Beast, Bug, Mech
   */
  if (reptilePlantDusk.includes(cardClass) && aquaBirdDawn.includes(enemyAxieClass)) {
    classAdvantageBonus = 1.15;
  }
  if (reptilePlantDusk.includes(cardClass) && beastBugMech.includes(enemyAxieClass)) {
    classAdvantageBonus = 0.85;
  }

  /* 
   * Class: Aqua, Bird, Dawn
   * Strong: Beast, Bug, Mech
   * Weak: Plant, Reptile, Dusk
   */
  if (aquaBirdDawn.includes(cardClass) && beastBugMech.includes(enemyAxieClass)) {
    classAdvantageBonus = 1.15;
  }
  if (aquaBirdDawn.includes(cardClass) && reptilePlantDusk.includes(enemyAxieClass)) {
    classAdvantageBonus = 0.85;
  }

  /* 
   * Class: Beast, Bug, Mech
   * Strong: Plant, Reptile, Dusk
   * Weak: Aqua, Bird, Dawn
   */
  if (beastBugMech.includes(cardClass) && reptilePlantDusk.includes(enemyAxieClass)) {
    classAdvantageBonus = 1.15;
  }
  if (beastBugMech.includes(cardClass) && aquaBirdDawn.includes(enemyAxieClass)) {
    classAdvantageBonus = 0.85;
  }
  
  return classAdvantageBonus;
}

/**
 * Create custom menu
 **/
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Axie Tools')
      .addItem('Get Axie Stats', 'getAxieStats')
      .addToUi();
}

