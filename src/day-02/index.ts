import { parseLines, readInput } from 'io'
import { desc, sum } from '../utils'

type Set = {
  red: number
  green: number
  blue: number
}

type Game = {
  id: number
  sets: Set[]
}

const limits: Set = {
  red: 12,
  green: 13,
  blue: 14,
}

const input = await readInput('day-02')

const getGameId = (gameString: string): number => {
  return Number.parseInt(gameString.split(' ')[1])
}

const getSets = (setsString: string): Set[] => {
  const sets = setsString.split('; ')
  return sets.map((setString) => {
    const colors = setString.split(', ')
    return colors.reduce<Set>((prev, curr) => {
      const [freq, color] = curr.split(' ') as [string, keyof Set]
      prev[color] = Number.parseInt(freq)
      return prev
    }, { red: 0, green: 0, blue: 0 })
  })
}

const isSetPossible = (set: Set, limits: Set) => {
  return set.red <= limits.red && set.green <= limits.green && set.blue <= limits.blue
}

const isGamePossible = (sets: Set[], limits: Set) => {
  return sets.every((set) => isSetPossible(set, limits))
}

const getPossibleGames = (games: Game[]) => {
  return games.filter((game) => isGamePossible(game.sets, limits))
}

export const part1 = () => {
  const lines = parseLines(input)
  const games: Game[] = lines.map((l) => {
    const [gameString, setString] = l.split(': ')

    return {
      id: getGameId(gameString),
      sets: getSets(setString)
    }
  })
  return sum(getPossibleGames(games).map((g) => g.id))
}

const getLimits = (game: Game): Set => {
  return {
    red: game.sets.map((s) => s.red).sort(desc)[0],
    green: game.sets.map((s) => s.green).sort(desc)[0],
    blue: game.sets.map((s) => s.blue).sort(desc)[0],
  }
}

const getCubePower = (set: Set) => {
  return set.blue * set.green * set.red
}

export const part2 = () => {
  const lines = parseLines(input)
  const games: Game[] = lines.map((l) => {
    const [gameString, setString] = l.split(': ')

    return {
      id: getGameId(gameString),
      sets: getSets(setString)
    }
  })

  return sum(games.map(getLimits).map(getCubePower))
}
