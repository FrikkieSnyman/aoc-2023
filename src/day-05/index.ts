import { parseGroups, readInput } from 'io'
import { asc } from '../utils'

const input = await readInput('day-05', 'example')

type Range = {
  start: number
  range: number
}
type RangeToDestinationMap = {
  destination: Range
  source: Range
}

const getValueInRanges = (input: number, ranges: RangeToDestinationMap[]): number => {
  const viableRanges = ranges.filter((r) => r.source.start <= input && (r.source.start + r.source.range) >= input)
  if (!viableRanges.length) {
    return input
  }
  const range = viableRanges[0]
  const distance = input - range.source.start
  return range.destination.start + distance
}

const mapGroup = (group: string[]): RangeToDestinationMap[] => {
  const ret: RangeToDestinationMap[] = []
  for (let i = 1; i < group.length; ++i) {
    const split = group[i].split(' ')
    ret.push({
      destination: {
        start: Number(split[0]),
        range: Number(split[2])
      },
      source: {
        start: Number(split[1]),
        range: Number(split[2])
      }
    })
  }
  return ret
}
const mapSeeds = (group: string[]): number[] => {
  return group[0].split(': ')[1].split(' ').map(Number)
}

const mapSeedPairs = (group: string[]): number[][] => {
  const seeds = mapSeeds(group)
  const ret: number[][] = []
  for (let i = 0; i < seeds.length; i += 2) {
    ret.push([seeds[i], seeds[i + 1]])
  }
  return ret
}

const mapSeedRanges = (group: string[]): Range[] => {
  const seedPairs = mapSeedPairs(group)
  return seedPairs.map((sp) => ({
    start: sp[0],
    range: sp[1]
  }))
}

const traverseMaps = (start: number, maps: RangeToDestinationMap[][]): number => {
  let source = start
  maps.forEach((map) => {
    source = getValueInRanges(source, map)
  })
  return source
}
const reverseMaps = (maps: RangeToDestinationMap[][]): RangeToDestinationMap[][] => {
  return maps.reverse().map((mps) => {
    return mps.map((m) => ({
      destination: m.source,
      source: m.destination
    }))
  })
}

export const part1 = () => {
  const [seedsUnparsed, ...mapsUnparsed] = parseGroups(input)
  const seeds = mapSeeds(seedsUnparsed)
  const maps = mapsUnparsed.map(mapGroup)
  const locations = seeds.map((s) => traverseMaps(s, maps))
  return locations.sort(asc)[0]
}

export const part2 = () => {
  const [seedsUnparsed, ...mapsUnparsed] = parseGroups(input)
  const seeds = mapSeedRanges(seedsUnparsed)
  const maps = mapsUnparsed.map(mapGroup)
  const reversedMaps = reverseMaps(maps)
  const locationRanges = reversedMaps[0].map((m) => m.source)
  const viableSeeds = locationRanges.map((l) => traverseMaps(l, reversedMaps))
  return viableSeeds.sort(asc)[0]

  // const seeds = seedPairs.reduce<number[]>((p, c) => {
  //   const add = []
  //   for (let i = 0; i < c[1]; ++i) {
  //     add.push(c[0] + i)
  //   }
  //   return [...p, ...add]
  // }, [])
  // return 0
  // const maps = mapsUnparsed.map(mapGroup)
}
