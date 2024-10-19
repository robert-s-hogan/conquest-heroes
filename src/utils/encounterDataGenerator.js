// src/utils/encounterDataGenerator.js
import {
  generateEncounterNumber,
  generateDate,
  getPlayers,
  getRandomEncounterDifficultyOption,
  calculateEncounterExperience,
  calculatePercentOfAdventuringDayXpRemaining,
  getRandomBoolean,
  getRandomTimeBetweenEncounters,
  getRandomMapTerrainType,
  getRandomStartingQuadrant,
  getRandomObjectivesOfEncounter,
  getRandomTimeOfDay,
  getRandomWeather,
  getRandomGoldEarned,
  getRandomDoesCaravanAppear,
  generateMapLocationsWithItems,
} from "@/utils/encounterUtils";
import { xpThresholdsByCharLvl } from "@/utils/xpTables";

export function generateEncounterData(currentCampaign, encounters) {
  const encounterNumber = generateEncounterNumber(encounters);
  const date = generateDate();
  const numberOfPlayers = currentCampaign?.numberOfPlayers || 4;
  const players = getPlayers(numberOfPlayers);

  const levelOfPlayerCharacters = currentCampaign?.groupLevel || 4;

  // Ensure players is valid
  if (!players || players.length === 0) {
    console.error("Players field is invalid:", players);
    return; // Prevent further execution
  }

  const xpThresholdsByCharacterLevel =
    xpThresholdsByCharLvl[levelOfPlayerCharacters];

  const encounterDifficultyOption = getRandomEncounterDifficultyOption();
  const encounterExperience = calculateEncounterExperience(
    encounterDifficultyOption,
    levelOfPlayerCharacters,
    numberOfPlayers
  );

  const percentOfAdventuringDayXpRemaining =
    calculatePercentOfAdventuringDayXpRemaining(
      currentCampaign?.adventuringDayXpLimit || 6800,
      currentCampaign?.groupExperience || 0
    );
  const shortRestNeededFirstOne = getRandomBoolean();
  const shortRestNeededSecondOne = getRandomBoolean();
  const shortRestCounter = shortRestNeededFirstOne + shortRestNeededSecondOne;
  const longRestNeeded = getRandomBoolean();
  const timeSpentResting = "-";
  const timeBetweenEncounters = getRandomTimeBetweenEncounters();
  const mapTerrainType = getRandomMapTerrainType();
  const startingQuadrantOfOppositionOnMap = getRandomStartingQuadrant();
  const objectivesOfEncounter = getRandomObjectivesOfEncounter();
  const timeOfDay = getRandomTimeOfDay();
  const weather = getRandomWeather();
  const goldEarnedFromEncounter = getRandomGoldEarned();
  const doesCaravanAppear = getRandomDoesCaravanAppear();
  const npcTypes = ["", "", "", ""];
  const mapLocations = generateMapLocationsWithItems() || [];

  return {
    encounterNumber,
    date,
    players,
    numberOfPlayers,
    levelOfPlayerCharacters,
    xpThresholdsByCharacterLevel:
      xpThresholdsByCharLvl[levelOfPlayerCharacters],
    encounterDifficultyOption,
    encounterExperience,
    percentOfAdventuringDayXpRemaining,
    shortRestNeededFirstOne,
    shortRestNeededSecondOne,
    shortRestCounter,
    longRestNeeded,
    timeSpentResting,
    timeBetweenEncounters,
    mapTerrainType,
    startingQuadrantOfOppositionOnMap,
    objectivesOfEncounter,
    timeOfDay,
    weather,
    goldEarnedFromEncounter,
    doesCaravanAppear,
    npcTypes,
    mapLocations,
  };
}
