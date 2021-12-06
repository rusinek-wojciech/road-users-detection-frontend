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
  BOXES_INDEX: number
  CLASSES_INDEX: number
  SCORES_INDEX: number
  PATH: string
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
  PATH: 'tensorflow/road/model.json',
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
  PATH: 'tensorflow/kangaroo-detector/model.json',
}

// set current profle
export const config: Config = resnet50
