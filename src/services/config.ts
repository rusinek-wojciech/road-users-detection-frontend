export interface Config {
  labels: {
    name: string
    color: string
  }[]
  treshold: number
  // objects indecies
  index: {
    boxes: number // [1,2,3,4]
    classes: number // liczby całk
    scores: number // liczby 0 - 1
  }
  path: string
}

const getModelPath = (model: string): string => `tensorflow/${model}/model.json`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ssdMobilenet = (): Config => ({
  labels: [
    {
      name: 'rowerzysta',
      color: '#D10000',
    },
    {
      name: 'hulajnoga elektryczna',
      color: '#FFC400',
    },
    {
      name: 'rolki',
      color: '#6495ED',
    },
    {
      name: 'pieszy',
      color: '#7FFF00',
    },
    {
      name: 'UTO',
      color: '#008B8B',
    },
  ],
  treshold: 0.5,
  index: {
    boxes: 2,
    classes: 3,
    scores: 4,
  },
  path: getModelPath('ssd_mobilenet'),
})

export const WARMUP_TIME = 3000
