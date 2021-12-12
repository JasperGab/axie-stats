/*====================================================================================================================================*
  Get Axie Stats by Jasper Gabriel (KS Hyun-)
  ====================================================================================================================================
  Version:      1.0.0
  Project Page: https://github.com/jasperg/ (WIP)
  Copyright:    (c) 2021 by Jasper Gabriel
  License:      GNU General Public License, version 3 (GPL-3.0) 
                http://www.opensource.org/licenses/gpl-3.0.html
  Ronin Address: ronin:549577812f53a0f49507eb443dc9dfcd20308ab0
  ------------------------------------------------------------------------------------------------------------------------------------
  A function to get axie stats for my axie damage calculator google sheet.
  
  This function utilizes Sky Mavis' APIs.

  For future enhancements see https://github.com/jasperg/
  
  For bug reports see https://github.com/jasperg//issues
  ------------------------------------------------------------------------------------------------------------------------------------
  Changelog:

  1.0.0  Initial release
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
  var axieId = SpreadsheetApp.getActiveSpreadsheet().getRange('B11').getValue();
  console.log(axieId)
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

  var mouthClass = result.data.axie.parts[3].class;
  var mouthName = result.data.axie.parts[3].name;
  var mouthAttack = result.data.axie.parts[3].abilities[0].attack;
  var mouthDefense = result.data.axie.parts[3].abilities[0].defense;

  var hornClass = result.data.axie.parts[4].class;
  var hornName = result.data.axie.parts[4].name;
  var hornAttack = result.data.axie.parts[4].abilities[0].attack;
  var hornDefense = result.data.axie.parts[4].abilities[0].defense;

  var tailClass = result.data.axie.parts[5].class;
  var tailName = result.data.axie.parts[5].name;
  var tailAttack = result.data.axie.parts[5].abilities[0].attack;
  var tailDefense = result.data.axie.parts[5].abilities[0].defense;

  /**  
   * Set Axie Info Value to Cells
  **/
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('A1:B9').setValue(`=image("${image}")`);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B12').setValue(name);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B13').setValue(axieClass);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B14').setValue(birthDate);

  /**  
   * Set Axie Stats Value to Cells
  **/
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B15').setValue(hp);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B16').setValue(speed);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B17').setValue(skill);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B18').setValue(morale);

  /**  
   * Set Axie Parts Value to Cells
  **/
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('D5').setValue(backName);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('E5').setValue(backClass);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('F5').setValue(backAttack);
  // SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('').setValue(backDefense);

  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('D6').setValue(mouthName);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('E6').setValue(mouthClass);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('F6').setValue(mouthAttack);
  // SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B15').setValue(mouthDefense);

  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('D7').setValue(hornName);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('E7').setValue(hornClass);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('F7').setValue(hornAttack);
  // SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('B15').setValue(hornDefense);

  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('D8').setValue(tailName);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('E8').setValue(tailClass);
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange('F8').setValue(tailAttack);
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
 * @return 
 * @customfunction
 **/
function getSingleDamage(axieClass, cardClass, enemyAxieClass, baseDamage) {
  var sameClassBonus;
  var classAdvantageBonus;

  sameClassBonus = getSameCardAndBodyClassBonus(cardClass, axieClass);

  classAdvantageBonus = getClassAdvantageBonus(cardClass, enemyAxieClass);

  var calculatedDamage = Math.floor(baseDamage * sameClassBonus * classAdvantageBonus)

  return calculatedDamage;
}

/**
 * Get Axie's card damage when played in a combo (2 or more cards) in a round.
 *
 * @param {axieClass}  Class of your Axie
 * @param {cardClass}  Class of your card
 * @param {enemyAxieClass}  Class of enemy Axie
 * @param {baseDamage}  Base damage of your card
 * @param {skill}  Skill stat of your Axie
 * @return 
 * @customfunction
 **/
function getComboDamage(axieClass, cardClass, enemyAxieClass, baseDamage, skill) {
  var sameClassBonus;
  var classAdvantageBonus;

  sameClassBonus = getSameCardAndBodyClassBonus(cardClass, axieClass);

  classAdvantageBonus = getClassAdvantageBonus(cardClass, enemyAxieClass);

  // * old formula
  // var skillBonusDamage = Math.floor(skill * baseDamage / 500);
  var skillBonusDamage = baseDamage != 0 ? skill * 0.55 - 12.5 : 0;

  var calculatedDamage = Math.floor(baseDamage * sameClassBonus * classAdvantageBonus + skillBonusDamage)

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

