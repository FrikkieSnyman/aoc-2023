import { parseLines, readInput } from 'io'
import { product } from '../utils'

const input = await readInput('day-06')

type Boat = {
  speed: number
  buttonHeldTime: number
}

type Race = {
  allowedTime: number
  recordDistance: number
}

const mapLines = (lines: string[]): Race[] => {
  const parsed = lines.map((l) => {
    return l.split(/:\s*/)[1].split(/\s+/).map(Number)
  })
  return parsed[0].map((time, index) => ({
    allowedTime: time,
    recordDistance: parsed[1][index]
  }))
}

const removeWhitespace = (lines: string[]): string[] => {
  return lines.map((l) => {
    return l.replace(/\s*/g, '')
  })
}

const getDistanceTravelledForRace = (boat: Boat, race: Race) => {
  const travelTime = race.allowedTime - boat.buttonHeldTime
  return boat.speed * travelTime
}

const getNumberOfWaysToWin = (race: Race): number => {
  const boats: Boat[] = []
  for (let i = 0; i <= race.allowedTime; ++i) {
    boats.push({
      buttonHeldTime: i,
      speed: i
    })
  }
  const distances = boats.map((b) => getDistanceTravelledForRace(b, race))
  return distances.filter((d) => d > race.recordDistance).length
}

export const part1 = () => {
  const races = mapLines(parseLines(input))
  const wins = races.map(getNumberOfWaysToWin)
  return product(wins)
}

export const part2 = () => {
  const races = mapLines(removeWhitespace(parseLines(input)))
  return getNumberOfWaysToWin(races[0])
}
