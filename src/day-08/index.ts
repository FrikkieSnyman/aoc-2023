import { parseGroups, parseLines, readInput } from 'io'
import { InstructionSet } from './InstructionSet'

const input = await readInput('day-08')

export const part1 = () => {
  const [instructions, elements] = parseGroups(input)
  const instructionSet = new InstructionSet(instructions[0], elements)

  return instructionSet.traverseElements()
}
