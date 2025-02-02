// src/utils/encounterUtils.js
import { xpThresholdsByCharLvl } from '@/utils/xpTables'
import mapItems from '@/data/mapItems.json' // NEW: import flat lookup of map items

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

export function getRandomEncounterDifficultyOption() {
  return difficultyOptions[Math.floor(Math.random() * difficultyOptions.length)]
}

// NEW: Generate an array of map items (agnostic to location).
// Randomly decide on a number of slots (between 1 and 5); for each slot, with a 20% chance, select a random item from the lookup table (the item’s “name” is used here).
export function generateMapLocationsWithItems() {
  const numberOfSlots = 1 + Math.floor(Math.random() * 5)
  const slots = []
  for (let i = 0; i < numberOfSlots; i++) {
    if (Math.random() < 0.2) {
      // 20% chance to roll an item
      const randomIndex = Math.floor(Math.random() * mapItems.length)
      slots.push(mapItems[randomIndex].name)
    } else {
      slots.push('')
    }
  }
  return slots
}

export function getRandomOppositionStart() {
  const options = ['Top', 'Left', 'Right']
  return options[Math.floor(Math.random() * options.length)]
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
  if (!baseXP) {
    console.error('XP Calculation Error: No base XP for difficulty')
    return 0
  }
  return baseXP * numberOfPlayers
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
