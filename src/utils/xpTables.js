// src/utils/xpTables.js

// XP thresholds by character level
export const xpThresholdsByCharLvl = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
}

// Recommended XP limits for a full adventuring day, by level
export const adventuringDayXpLimits = [
  // Renamed from adventuringDayXpLimit
  { level: 1, xp: 300 },
  { level: 2, xp: 600 },
  { level: 3, xp: 1200 },
  { level: 4, xp: 1700 },
  { level: 5, xp: 3500 },
  { level: 6, xp: 4000 },
  { level: 7, xp: 5000 },
  { level: 8, xp: 6000 },
  { level: 9, xp: 7500 },
  { level: 10, xp: 9000 },
  { level: 11, xp: 10500 },
  { level: 12, xp: 11500 },
  { level: 13, xp: 13500 },
  { level: 14, xp: 15000 },
  { level: 15, xp: 18000 },
  { level: 16, xp: 20000 },
  { level: 17, xp: 25000 },
  { level: 18, xp: 27000 },
  { level: 19, xp: 30000 },
  { level: 20, xp: 40000 },
]

// Character advancement table by level
export const characterAdvancementTable = [
  { level: 1, start: 0, end: 299, needed: 300, total: 299 },
  { level: 2, start: 300, end: 899, needed: 600, total: 1199 },
  { level: 3, start: 900, end: 2699, needed: 1800, total: 3599 },
  { level: 4, start: 2700, end: 6499, needed: 3800, total: 9199 },
  { level: 5, start: 6500, end: 13999, needed: 7500, total: 20499 },
  { level: 6, start: 14000, end: 22999, needed: 9000, total: 36999 },
  { level: 7, start: 23000, end: 33999, needed: 11000, total: 56999 },
  { level: 8, start: 34000, end: 47999, needed: 14000, total: 81999 },
  { level: 9, start: 48000, end: 63999, needed: 16000, total: 111999 },
  { level: 10, start: 64000, end: 84999, needed: 21000, total: 148999 },
  { level: 11, start: 85000, end: 99999, needed: 15000, total: 184999 },
  { level: 12, start: 100000, end: 119999, needed: 20000, total: 219999 },
  { level: 13, start: 120000, end: 139999, needed: 20000, total: 259999 },
  { level: 14, start: 140000, end: 164999, needed: 25000, total: 304999 },
  { level: 15, start: 165000, end: 194999, needed: 30000, total: 359999 },
  { level: 16, start: 195000, end: 224999, needed: 30000, total: 419999 },
  { level: 17, start: 225000, end: 264999, needed: 40000, total: 489999 },
  { level: 18, start: 265000, end: 304999, needed: 40000, total: 569999 },
  { level: 19, start: 305000, end: 354999, needed: 50000, total: 659999 },
  { level: 20, start: 355000, end: null, needed: null, total: null },
]

export function calculateXpFields(playerStartExperience) {
  const xpTotalToLevelTable = [
    { xpStart: 0, xpEnd: 299, xpNeeded: 300, xpTotal: 299, level: 1 },
    { xpStart: 300, xpEnd: 899, xpNeeded: 600, xpTotal: 1199, level: 2 },
    { xpStart: 900, xpEnd: 2699, xpNeeded: 1800, xpTotal: 3599, level: 3 },
    { xpStart: 2700, xpEnd: 6499, xpNeeded: 3800, xpTotal: 9199, level: 4 },
    { xpStart: 6500, xpEnd: 13999, xpNeeded: 7500, xpTotal: 20499, level: 5 },
    { xpStart: 14000, xpEnd: 22999, xpNeeded: 9000, xpTotal: 36999, level: 6 },
    { xpStart: 23000, xpEnd: 33999, xpNeeded: 11000, xpTotal: 56999, level: 7 },
    { xpStart: 34000, xpEnd: 47999, xpNeeded: 14000, xpTotal: 81999, level: 8 },
    {
      xpStart: 48000,
      xpEnd: 63999,
      xpNeeded: 16000,
      xpTotal: 111999,
      level: 9,
    },
    {
      xpStart: 64000,
      xpEnd: 84999,
      xpNeeded: 21000,
      xpTotal: 148999,
      level: 10,
    },
    {
      xpStart: 85000,
      xpEnd: 99999,
      xpNeeded: 15000,
      xpTotal: 184999,
      level: 11,
    },
    {
      xpStart: 100000,
      xpEnd: 119999,
      xpNeeded: 20000,
      xpTotal: 219999,
      level: 12,
    },
    {
      xpStart: 120000,
      xpEnd: 139999,
      xpNeeded: 20000,
      xpTotal: 259999,
      level: 13,
    },
    {
      xpStart: 140000,
      xpEnd: 164999,
      xpNeeded: 25000,
      xpTotal: 304999,
      level: 14,
    },
    {
      xpStart: 165000,
      xpEnd: 194999,
      xpNeeded: 30000,
      xpTotal: 359999,
      level: 15,
    },
    {
      xpStart: 195000,
      xpEnd: 224999,
      xpNeeded: 30000,
      xpTotal: 419999,
      level: 16,
    },
    {
      xpStart: 225000,
      xpEnd: 264999,
      xpNeeded: 40000,
      xpTotal: 489999,
      level: 17,
    },
    {
      xpStart: 265000,
      xpEnd: 304999,
      xpNeeded: 40000,
      xpTotal: 569999,
      level: 18,
    },
    {
      xpStart: 305000,
      xpEnd: 354999,
      xpNeeded: 50000,
      xpTotal: 659999,
      level: 19,
    },
    { xpStart: 355000, xpEnd: null, xpNeeded: null, xpTotal: null, level: 20 },
  ]

  let groupLevel = 1
  let xpThresholds = { easy: 0, medium: 0, hard: 0, deadly: 0 }
  let adventuringDayXpLimit = 0

  for (const levelData of xpTotalToLevelTable) {
    if (
      playerStartExperience >= levelData.xpStart &&
      (levelData.xpEnd === null || playerStartExperience <= levelData.xpEnd)
    ) {
      groupLevel = levelData.level
      xpThresholds = xpThresholdsByCharLvl[groupLevel] || {
        easy: 0,
        medium: 0,
        hard: 0,
        deadly: 0,
      }

      // Corrected to use adventuringDayXpLimits
      const xpLimitData = adventuringDayXpLimits.find(
        (dayXp) => dayXp.level === groupLevel
      )

      adventuringDayXpLimit = xpLimitData ? xpLimitData.xp : 0
      console.log('🎯 Debug: Adventuring Day XP Limit:', adventuringDayXpLimit)

      break
    }
  }

  console.log('✅ Found Group Level:', groupLevel)

  return {
    groupLevel,
    xpThresholds,
    adventuringDayXpLimit,
    currentAdventuringDayXp: adventuringDayXpLimit,
  }
}

export function calculateRemainingAdventuringDayXP(
  adventuringDayXpLimit,
  usedXp
) {
  return adventuringDayXpLimit - usedXp
}
