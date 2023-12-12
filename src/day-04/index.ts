import { parseLines, readInput } from 'io'
import { sum } from '../utils'

const input = await readInput('day-04')

type Card = {
  index: number
  winning: number[]
  drawn: number[]
}

const getCardFromLine = (line: string): Card => {
  const [cardIndex, lines] = line.split(': ')
  const [winning, drawn] = lines.split(' | ')
  const getNumbers = (line: string) => {
    return line.split(' ').filter((n) => !!n).map(Number)
  }
  const splitCardIndex = cardIndex.split(' ')
  return {
    index: Number(splitCardIndex[splitCardIndex.length - 1].trim()),
    winning: getNumbers(winning),
    drawn: getNumbers(drawn)
  }
}

const getCardMatches = (card: Card): number[] => {
  return card.drawn.filter((d) => card.winning.includes(d))
}

const getCardValue = (card: Card): number => {
  const matches = getCardMatches(card)
  if (matches.length === 0) {
    return 0
  }
  return 2 ** (matches.length - 1)
}

export const part1 = () => {
  const cards = parseLines(input).map(getCardFromLine)
  return sum(cards.map(getCardValue))
}

const buildStack = (cards: Card[], index: number, stack: number[]): number[] => {
  const currentCard = cards[index]
  if (!currentCard) {
    return stack
  }
  // console.log('index', index, currentCard, stack)
  const matches = getCardMatches(currentCard)
  // console.log('matches', matches.length)
  const repeat = stack[index]
  const ret = [...stack]
  const cardsToPush = cards.slice(currentCard.index, currentCard.index + matches.length)
  cardsToPush.forEach((c) => {
    const i = c.index - 1
    // console.log('adding', c.index, ret[i], repeat)
    ret[i] = ret[i] + repeat
  })
  return buildStack(cards, index + 1, ret)
}

export const part2 = () => {
  const cards = parseLines(input).map(getCardFromLine)
  const stack = buildStack(cards, 0, cards.reduce<number[]>((p) => ([...p, 1]), []))
  return sum(stack)
}
