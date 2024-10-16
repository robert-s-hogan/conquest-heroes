// src/utils/encounterUtils.js

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
  const options = ["Easy", "Medium", "Hard", "Deadly"];
  return options[Math.floor(Math.random() * options.length)];
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
  const terrains = ["Volcanic Island", "Forest", "Desert", "Mountain"];
  return terrains[Math.floor(Math.random() * terrains.length)];
}

export function getRandomStartingQuadrant() {
  return Math.floor(Math.random() * 4) + 1;
}

export function getRandomObjectivesOfEncounter() {
  const objectives = [
    "Remove all Enemies from the area",
    "Rescue the Hostage",
    "Defend the Base",
  ];
  return objectives[Math.floor(Math.random() * objectives.length)];
}

export function getRandomTimeOfDay() {
  const times = ["Day", "Night", "Dawn", "Dusk"];
  return times[Math.floor(Math.random() * times.length)];
}

export function getRandomWeather() {
  const weatherConditions = [
    "Clear",
    "Rainy",
    "Stormy",
    "Light Sandstorm (getting worse)",
  ];
  return weatherConditions[
    Math.floor(Math.random() * weatherConditions.length)
  ];
}

export function getRandomGoldEarned() {
  // Placeholder function; replace with your actual calculation
  return parseFloat((Math.random() * 100).toFixed(4));
}

export function getRandomDoesCaravanAppear() {
  return Math.random() < 0.5;
}
