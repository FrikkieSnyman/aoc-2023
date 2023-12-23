import { parseLines, readInput } from 'io'

const input = await readInput('day-07')

const Cards = ['*', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const
type Card = typeof Cards[number]
type Hand = {
  order: Card[]
  group: Map<Card, number>
  bid: number
  value: number
}

const getCardValue = (card: Card): number => {
  return Cards.indexOf(card)
}

const groupHand = (hand: Card[]): Map<Card, number> => {
  const ret = new Map<Card, number>()

  hand.forEach((card) => {
    ret.set(card, (ret.get(card) || 0) + 1)
  })
  return ret
}

const getHandValue = (hand: Map<Card, number>): number => {
  const copy = new Map<Card, number>(hand)

  const entries = copy.entries()

  let entry = entries.next()
  let high: number = entry.value[1]
  let highCard: Card = entry.value[0]
  while (!entry.done) {
    const val = entry.value[1]
    const card = entry.value[0]
    if (val > high || (highCard === '*' && (val >= high))) {
      high = val
      highCard = card
    }
    entry = entries.next()
  }
  if (highCard !== '*' && copy.has('*')) {
    const count = copy.get('*') || 0
    high += count
    copy.delete('*')
    copy.set(highCard, high)
  }
  const weight = 6 - Array.from(copy.keys()).length
  const score = high * weight
  return score
}

const mapToHands = (lines: string[]): Hand[] => {
  return lines.map((l) => {
    const [hand, bid] = l.split(' ')
    const parsedHand: Card[] = hand.split('') as Card[]
    const groupedHand = groupHand(parsedHand)
    return {
      bid: Number(bid),
      order: parsedHand,
      group: groupedHand,
      value: getHandValue(groupedHand)
    }
  })
}

const breakTie = (hand: Hand, comparedTo: Hand) => {
  for (let i = 0; i < hand.order.length; ++i) {
    const handValue = getCardValue(hand.order[i])
    const comparedToValue = getCardValue(comparedTo.order[i])
    if (handValue === comparedToValue) {
      continue
    }
    return handValue - comparedToValue
  }
  throw new Error('Hands are equal')
}

const rankHands = (hands: Hand[]): Hand[] => {
  return [...hands].sort((a, b) => {
    if (a.value === b.value) {
      return breakTie(a, b)
    };
    return a.value - b.value
  })
}
const play = (lines: string[]): number => {
  const hands = mapToHands(lines)
  const ranked = rankHands(hands)
  return ranked.reduce<number>((acc, curr, index) => {
    return acc + curr.bid * (index + 1)
  }, 0)
}
export const part1 = () => {
  const lines = parseLines(input)
  return play(lines)
}

export const part2 = () => {
  const lines = parseLines(input).map((l) => l.replaceAll('J', '*'))
  return play(lines)
}
