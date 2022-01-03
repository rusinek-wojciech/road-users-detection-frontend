interface Config {
  LABELS: {
    name: string
    color: string
  }[]
  TRESHOLD: number
  // // model pretrained sizes
  MODEL_WIDTH: number
  MODEL_HEIGHT: number
  // objects indecies
  BOXES_INDEX: number // [1,2,3,4]
  CLASSES_INDEX: number // liczby całk
  SCORES_INDEX: number // liczby 0 - 1
  PATH: string
}

const getModelPath = (model: string): string => {
  return `tensorflow/${model}/model.json`
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ssdMobilenet: Config = {
  LABELS: [
    {
      name: 'bike',
      color: 'red',
    },
    {
      name: 'scooter',
      color: 'yellow',
    },
    {
      name: 'rolls',
      color: '#6495ED',
    },
    {
      name: 'pedestrian',
      color: '#7FFF00',
    },
    {
      name: 'uto',
      color: '#008B8B',
    },
  ],
  MODEL_WIDTH: 640,
  MODEL_HEIGHT: 640,
  TRESHOLD: 0.55,
  BOXES_INDEX: 5,
  CLASSES_INDEX: 3,
  SCORES_INDEX: 6,
  PATH: getModelPath('ssd_mobilenet'),
}

// set current profle
export const config: Config = ssdMobilenet
