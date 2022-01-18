export interface Config {
  labels: {
    name: string
    color: string
  }[]
  treshold: number
  // // model pretrained sizes
  modelWidth: number
  modelHeight: number
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
  modelWidth: 640,
  modelHeight: 640,
  treshold: 0.55,
  index: {
    boxes: 6,
    classes: 5,
    scores: 7,
  },
  path: getModelPath('ssd_mobilenet'),
})
