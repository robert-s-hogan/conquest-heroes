// src/utils/encounterUtils.js
import { xpThresholdsByCharLvl } from '@/utils/xpTables'

export const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Deadly']
export const terrainOptions = [
  'Volcanic Island',
  'Forest',
  'Desert',
  'Mountain',
]

export const timeOfDayOptions = ['Day', 'Night', 'Dawn', 'Dusk']
export const weatherOptions = [
  'Clear',
  'Rainy',
  'Stormy',
  'Light Sandstorm (getting worse)',
]
export const objectivesOptions = [
  'Remove all Enemies from the area',
  'Rescue the Hostage',
  'Defend the Base',
]

/**
 * Pool of possible items for each map location.
 */
const possibleItemsPerLocation = {
  top: [
    'Trap - Grease Trap',
    'Beast (Ox)',
    "Cartographer's Station (empty)",
    'Hidden Pitfall',
    'Magical Barrier',
  ],
  left: ['Ladder, metal, 25ft telescopic', 'Rope Ladder, wooden', 'Net Trap'],
  center: ['Levitating Stones, orbiting', 'Construct, large', 'Player Beacon'],
  right: ['Levitating Stones, orbiting', 'Construct, large', 'Player Beacon'],
}

/**
 * Defines the number of items each location should have.
 */
const numberOfItemsPerLocation = {
  top: 3,
  left: 1,
  center: 3,
  right: 3,
}

export function getRandomEncounterDifficultyOption() {
  return difficultyOptions[Math.floor(Math.random() * difficultyOptions.length)]
}

export function generateMapLocationsWithItems() {
  const mapLocations = {}

  Object.keys(possibleItemsPerLocation).forEach((location) => {
    const possibleItems = possibleItemsPerLocation[location]
    const numItems = numberOfItemsPerLocation[location] || 1
    const selectedItems = []

    for (let i = 0; i < numItems; i++) {
      // Randomly select an item from the pool
      const randomIndex = Math.floor(Math.random() * possibleItems.length)
      const selectedItem = possibleItems[randomIndex]

      selectedItems.push(selectedItem)
    }

    mapLocations[location] = selectedItems
  })

  return mapLocations
}

export function generateEncounterNumber(encounters) {
  return encounters.length > 0
    ? Math.max(...encounters.map((encounter) => encounter.encounterNumber)) + 1
    : 1
}

export function generateDate() {
  return new Date().toISOString()
}

export function getPlayers(numberOfPlayers) {
  const players = ['Player 1', 'Player 2', 'Player 3', 'Player 4']
  return players.slice(0, numberOfPlayers)
}

export function getXpThresholdsByCharacterLevel(level) {
  return (
    xpThresholdsByCharLvl[level] || {
      easy: 0,
      medium: 0,
      hard: 0,
      deadly: 0,
    }
  )
}

export function calculateRemainingAdventuringDayXP(
  adventuringDayXpLimit,
  usedXp
) {
  return adventuringDayXpLimit - usedXp
}

export function getRandomEncounterOppositionType() {
  const types = ['Solo', 'Duo', 'Trio', 'Group', 'Horde']
  return types[Math.floor(Math.random() * types.length)]
}

export function calculateEncounterExperience(
  encounterDifficultyOption,
  levelOfPlayerCharacters,
  numberOfPlayers
) {
  // Ensure that the logic properly calculates experience based on inputs
  const baseXP =
    xpThresholdsByCharLvl[levelOfPlayerCharacters]?.[
      encounterDifficultyOption.toLowerCase()
    ]

  if (baseXP) {
    return baseXP * numberOfPlayers // Example logic
  }

  console.error('Failed to calculate encounter experience')
  return 0 // Return a default value or handle the error
}

export function calculatePercentOfAdventuringDayXpRemaining(
  adventuringDayXpLimit,
  groupExperience
) {
  const xpUsed = groupExperience || 0
  const percentRemaining =
    ((adventuringDayXpLimit - xpUsed) / adventuringDayXpLimit) * 100
  return Math.max(0, percentRemaining)
}

export function getRandomBoolean() {
  return Math.random() >= 0.5
}

export function getRandomTimeBetweenEncounters() {
  const times = ['30min', '1hr', '2hrs', '3hrs']
  return times[Math.floor(Math.random() * times.length)]
}

export function getRandomMapTerrainType() {
  return terrainOptions[Math.floor(Math.random() * terrainOptions.length)]
}

export function getRandomStartingQuadrant() {
  return Math.floor(Math.random() * 4) + 1
}

export function getRandomObjectivesOfEncounter() {
  return objectivesOptions[Math.floor(Math.random() * objectivesOptions.length)]
}

export function getRandomTimeOfDay() {
  return timeOfDayOptions[Math.floor(Math.random() * timeOfDayOptions.length)]
}

export function getRandomWeather() {
  return weatherOptions[Math.floor(Math.random() * weatherOptions.length)]
}

export function getRandomGoldEarned() {
  return parseFloat((Math.random() * 100).toFixed(4))
}

export function getRandomDoesCaravanAppear() {
  return Math.random() < 0.5
}
