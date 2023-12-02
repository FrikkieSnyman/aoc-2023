import { parseLines, readInput } from 'io'
import { sum } from '../utils'

const input = await readInput('day-01')

const MAPPED_NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

const findFirstNumber = (msg: string) => {
  for (let i = 0; i < msg.length; ++i) {
    if (!Number.isNaN(Number(msg[i]))) {
      return Number(msg[i])
    }
  }
}

const replaceWordsWithNumbers = (line: string): string => {
  let ret = line
  const record = {
    first: { index: -1, number: '', value: 0 },
    last: { index: -1, number: '', value: 0 },
  }
  MAPPED_NUMBERS.forEach((n, i) => {
    const f = ret.indexOf(n)
    const l = ret.lastIndexOf(n)

    if (f > -1 && (f < record.first.index || record.first.index < 0)) {
      record.first = { index: f, number: n, value: i }
    }
    if (l > -1 && l > record.last.index) {
      record.last = { index: l, number: n, value: i }
    }
  })
  if (record.first.index > -1) {
    ret = ret.replace(record.first.number, `${record.first.value}`)
  }
  if (record.last.index > -1) {
    ret = ret.replace(record.last.number, `${record.last.value}`)
  }

  return ret
}
const getNumberPair = (line: string) => {
  return [findFirstNumber(line), findFirstNumber(line.split('').reverse().join(''))]
}

const getNumberPairWithWords = (line: string) => {
  return getNumberPair(replaceWordsWithNumbers(line))
}

export const part1 = () => {
  const lines = parseLines(input)
  const numberPairs = lines.map(getNumberPair).map((p) => Number(p.join('')))
  return sum(numberPairs)
}

export const part2 = () => {
  const lines = parseLines(input)
  const numberPairs = lines.map(getNumberPairWithWords).map((p) => Number(p.join('')))
  return sum(numberPairs)
}
