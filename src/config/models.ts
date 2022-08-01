export interface ModelConfig {
  labels: {
    name: string
    color: string
  }[]
  treshold: number
  index: {
    boxes: number // [1,2,3,4]
    classes: number // liczby całk
    scores: number // liczby 0 - 1
  }
  path: string
}

const getModelPath = (model: string): string => `tensorflow/${model}/model.json`

export const ssdMobilenet: ModelConfig = {
  labels: [
    {
      name: 'Rowerzysta',
      color: '#D10000',
    },
    {
      name: 'Hulajnoga elektryczna',
      color: '#FFC400',
    },
    {
      name: 'Rolki',
      color: '#6495ED',
    },
    {
      name: 'Pieszy',
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
}
