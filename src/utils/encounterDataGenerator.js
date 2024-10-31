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
} from '@/utils/encounterUtils'
import { xpThresholdsByCharLvl } from '@/utils/xpTables'

/**
 * Generates encounter data with properly structured mapLocations.
 *
 * @param {Object} currentCampaign - The current campaign details.
 * @param {Array} encounters - The list of existing encounters.
 * @returns {Object} - The newly generated encounter data.
 */
export function generateEncounterData(currentCampaign, encounters) {
  const encounterNumber = generateEncounterNumber(encounters)
  const date = generateDate()
  const numberOfPlayers = currentCampaign?.numberOfPlayers || 4
  const players = getPlayers(numberOfPlayers)

  const levelOfPlayerCharacters = currentCampaign?.groupLevel || 4

  // Ensure players is valid
  if (!players || players.length === 0) {
    console.error('Players field is invalid:', players)
    return null // Return null or handle as per your application's requirements
  }

  const xpThresholdsByCharacterLevel = xpThresholdsByCharLvl[
    levelOfPlayerCharacters
  ] || {
    easy: 0,
    medium: 0,
    hard: 0,
    deadly: 0,
  }

  const encounterDifficultyOption = getRandomEncounterDifficultyOption()
  const encounterExperience = calculateEncounterExperience(
    encounterDifficultyOption,
    levelOfPlayerCharacters,
    numberOfPlayers
  )

  const percentOfAdventuringDayXpRemaining =
    calculatePercentOfAdventuringDayXpRemaining(
      currentCampaign?.adventuringDayXpLimit || 6800,
      currentCampaign?.groupExperience || 0
    )

  const shortRestNeededFirstOne = getRandomBoolean()
  const shortRestNeededSecondOne = getRandomBoolean()
  const shortRestCounter =
    (shortRestNeededFirstOne ? 1 : 0) + (shortRestNeededSecondOne ? 1 : 0)
  const longRestNeeded = getRandomBoolean()
  const timeSpentResting = '-' // Placeholder or implement as needed
  const timeBetweenEncounters = getRandomTimeBetweenEncounters()
  const mapTerrainType = getRandomMapTerrainType()
  const startingQuadrantOfOppositionOnMap = getRandomStartingQuadrant()
  const objectivesOfEncounter = getRandomObjectivesOfEncounter()
  const timeOfDay = getRandomTimeOfDay()
  const weather = getRandomWeather()
  const goldEarnedFromEncounter = getRandomGoldEarned()
  const doesCaravanAppear = getRandomDoesCaravanAppear()
  const npcTypes = ['', '', '', ''] // Initialize with empty strings or as per requirements

  // Generate mapLocations as an object
  const mapLocations = generateMapLocationsWithItems() || {}

  return {
    encounterNumber,
    date,
    players,
    numberOfPlayers,
    levelOfPlayerCharacters,
    xpThresholdsByCharacterLevel,
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
  }
}
