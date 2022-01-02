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
const resnet50: Config = {
  LABELS: [
    {
      name: 'bike',
      color: 'red',
    },
    {
      name: 'scooter',
      color: 'yellow',
    },
  ],
  TRESHOLD: 0.9,
  MODEL_WIDTH: 640,
  MODEL_HEIGHT: 640,
  BOXES_INDEX: 2,
  CLASSES_INDEX: 3,
  SCORES_INDEX: 5,
  PATH: getModelPath('road'),
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const kangaroo: Config = {
  LABELS: [
    {
      name: 'kangaroo',
      color: 'red',
    },
    {
      name: 'other',
      color: 'yellow',
    },
  ],
  MODEL_WIDTH: 320,
  MODEL_HEIGHT: 320,
  TRESHOLD: 0.75,
  BOXES_INDEX: 0,
  CLASSES_INDEX: 5,
  SCORES_INDEX: 4,
  PATH: getModelPath('kangaroo-detector'),
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resnet101: Config = {
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
  TRESHOLD: 0.9,
  MODEL_WIDTH: 640,
  MODEL_HEIGHT: 640,
  BOXES_INDEX: 2,
  CLASSES_INDEX: 3,
  SCORES_INDEX: 5,
  PATH: getModelPath('resnet101'),
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
  TRESHOLD: 0.75,
  BOXES_INDEX: 5,
  CLASSES_INDEX: 6,
  SCORES_INDEX: 4,
  PATH: getModelPath('ssd_mobilenet'),
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ssdMobilenet2: Config = {
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
  PATH: getModelPath('ssd_mobilenet_2'),
}

// set current profle
export const config: Config = ssdMobilenet2
