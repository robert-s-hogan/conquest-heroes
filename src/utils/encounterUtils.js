// src/utils/encounterUtils.js

export const difficultyOptions = ["Easy", "Medium", "Hard", "Deadly"];
export const terrainOptions = [
  "Volcanic Island",
  "Forest",
  "Desert",
  "Mountain",
];
export const timeOfDayOptions = ["Day", "Night", "Dawn", "Dusk"];
export const weatherOptions = [
  "Clear",
  "Rainy",
  "Stormy",
  "Light Sandstorm (getting worse)",
];
export const objectivesOptions = [
  "Remove all Enemies from the area",
  "Rescue the Hostage",
  "Defend the Base",
];

export function generateEncounterNumber(encounters) {
  return encounters.length > 0
    ? Math.max(...encounters.map((encounter) => encounter.encounterNumber)) + 1
    : 1;
}

export function generateDate() {
  return new Date().toISOString();
}

export function getPlayers() {
  // Fetch or define players; for now, return a sample array
  return ["Alice", "Bob", "Charlie", "Dave"];
}

export function getNumberOfPlayers(players) {
  return players.length;
}

export function getXpThresholdsByCharacterLevel(level) {
  // This function can be expanded to return thresholds based on the level
  return {
    easy: 500,
    medium: 1000,
    hard: 1500,
    deadly: 2000,
  };
}

export function getRandomEncounterDifficultyOption() {
  return difficultyOptions[
    Math.floor(Math.random() * difficultyOptions.length)
  ];
}

export function getRandomEncounterOppositionType() {
  const types = ["Solo", "Duo", "Trio", "Group", "Horde"];
  return types[Math.floor(Math.random() * types.length)];
}

export function calculateEncounterExperience() {
  // Placeholder function; replace with your actual calculation
  return 440;
}

export function calculatePercentOfAdventuringDayXpRemaining(
  adventuringDayXpLimit,
  groupExperience
) {
  // Placeholder calculation
  const xpUsed = groupExperience || 0;
  const percentRemaining =
    ((adventuringDayXpLimit - xpUsed) / adventuringDayXpLimit) * 100;
  return Math.max(0, percentRemaining);
}

export function getRandomBoolean() {
  return Math.random() >= 0.5;
}

export function getRandomTimeBetweenEncounters() {
  const times = ["30min", "1hr", "2hrs", "3hrs"];
  return times[Math.floor(Math.random() * times.length)];
}

export function getRandomMapTerrainType() {
  return terrainOptions[Math.floor(Math.random() * terrainOptions.length)];
}

export function getRandomStartingQuadrant() {
  return Math.floor(Math.random() * 4) + 1;
}

export function getRandomObjectivesOfEncounter() {
  return objectivesOptions[
    Math.floor(Math.random() * objectivesOptions.length)
  ];
}

export function getRandomTimeOfDay() {
  return timeOfDayOptions[Math.floor(Math.random() * timeOfDayOptions.length)];
}

export function getRandomWeather() {
  return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
}

export function getRandomGoldEarned() {
  // Placeholder function; replace with your actual calculation
  return parseFloat((Math.random() * 100).toFixed(4));
}

export function getRandomDoesCaravanAppear() {
  return Math.random() < 0.5;
}
