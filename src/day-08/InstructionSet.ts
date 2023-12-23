export const INSTRUCTION = ['L', 'R'] as const
export type Instruction = typeof INSTRUCTION[number]
export type ElementMap = { [key in string]: [keyof ElementMap, keyof ElementMap] }

const createElementMap = (elements: string[]): ElementMap => {
  return elements.reduce<ElementMap>((acc, curr) => {
    const [key, unparsedElements] = curr.split(' = ')
    const el = unparsedElements.replace(/\(|\)/g, '').split(', ')
    return { ...acc, [key]: [el[0], el[1]] }
  }, {})
}

export class InstructionSet {
  private _elementMap: ElementMap
  private _instructions: Instruction[]
  private _activeInstructionIndex: number = 0
  private _currentElement: keyof ElementMap = 'AAA'
  private _stepsTaken = 0
  constructor(instructions: string, elements: string[]) {
    this._instructions = instructions.split('') as Instruction[]
    this._elementMap = createElementMap(elements)
  }

  private getAndAdvanceInstruction(): number {
    if (this._activeInstructionIndex >= this._instructions.length) {
      this._activeInstructionIndex = 0
    }
    return INSTRUCTION.indexOf(this._instructions[this._activeInstructionIndex++])
  }

  public traverseElements(): number {
    while (this._currentElement !== 'ZZZ') {
      this._currentElement = this._elementMap[this._currentElement][this.getAndAdvanceInstruction()]
      ++this._stepsTaken
    }
    return this._stepsTaken
  }
}
