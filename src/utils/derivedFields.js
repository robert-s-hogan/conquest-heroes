// src/utils/derivedFields.js
export function calculateDerivedFields(campaign) {
  const adventuringDayXpRemaining =
    campaign.currentAdventuringDayXp || campaign.adventuringDayXpLimit
  const percentAdventuringDayXpRemaining = (
    (adventuringDayXpRemaining / campaign.adventuringDayXpLimit) *
    100
  ).toFixed(0)

  const firstRestThreshold = 0.68 * campaign.adventuringDayXpLimit
  const secondRestThreshold = 0.35 * campaign.adventuringDayXpLimit

  // Safely check for `xpThresholds` and assign a default in case `easy` is undefined
  const easyThreshold = campaign.xpThresholds?.easy ?? 500

  const shortRestNeededFirst = adventuringDayXpRemaining <= firstRestThreshold
  const shortRestNeededSecond = adventuringDayXpRemaining <= secondRestThreshold
  const longRestNeeded = adventuringDayXpRemaining < easyThreshold

  return {
    shortRestNeededFirst,
    shortRestNeededSecond,
    longRestNeeded,
    percentAdventuringDayXpRemaining,
  }
}
