import { parseLines, readInput } from 'io'
import { sum } from '../utils'

const input = await readInput('day-03')

type ValueSpan = {
  value: number
  span: {
    start: number
  }
}

const extractNumber = (line: string, index: number): ValueSpan => {
  let start = index
  let end = index
  while (!Number.isNaN(Number.parseInt(line[start]))) {
    start--
  }
  while (!Number.isNaN(Number.parseInt(line[end]))) {
    end++
  }
  return {
    value: Number.parseInt(line.slice(start + 1, end)),
    span: {
      start: start + 1,
    }
  }
}

const getNeighboursThatAreNumbers = (lines: string[], y: number, x: number) => {
  const numberedNeighbours: ValueSpan[] = []
  for (let j = -1; j <= 1; ++j) {
    const neighboursForThisRow: ValueSpan[] = []
    for (let i = -1; i <= 1; ++i) {
      const searchX = x + i
      const searchY = y + j
      // these checks prolly don't matter because out of bounds indeces will just return undefined
      if (searchX === 0 && searchY === 0) {
        continue
      }
      if (searchX < 0 || searchY < 0 || searchY >= lines.length || searchX >= lines[searchY].length) {
        continue
      }
      if (!Number.isNaN(Number.parseInt(lines[searchY][searchX]))) {
        const num = extractNumber(lines[searchY], searchX)
        if (!neighboursForThisRow.find((n) => n.span.start === num.span.start)) {
          neighboursForThisRow.push(num)
        }
      }
    }
    numberedNeighbours.push(...neighboursForThisRow)
  }
  return numberedNeighbours
}

const getPartNumbers = (lines: string[]): ValueSpan[] => {
  const parts: ValueSpan[] = []

  lines.forEach((line, index) => {
    for (let c = 0; c < line.length; ++c) {
      const curr = line[c]
      if (curr !== '.' && Number.isNaN(Number.parseInt(curr))) {
        parts.push(...getNeighboursThatAreNumbers(lines, index, c))
      }
    }
  })
  return parts
}

export const part1 = () => {
  const lines = parseLines(input)
  return sum(getPartNumbers(lines).map((p) => p.value))
}

const getGearRatios = (lines: string[]): number[] => {
  const ratios: number[] = []
  lines.forEach((line, index) => {
    for (let c = 0; c < line.length; ++c) {
      const curr = line[c]
      if (curr === '*') {
        const neighbours = getNeighboursThatAreNumbers(lines, index, c)
        if (neighbours.length === 2) {
          ratios.push(neighbours[0].value * neighbours[1].value)
        }
      }
    }
  })
  return ratios
}

export const part2 = () => {
  const lines = parseLines(input)
  return sum(getGearRatios(lines))
}
