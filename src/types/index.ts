export interface Label {
  name: string
  color: string
}

export type Box = [number, number, number, number]

export type Source = HTMLImageElement | HTMLVideoElement

interface Index {
  boxes: number // [1,2,3,4]
  classes: number // liczby całk
  scores: number // liczby 0 - 1
}

export interface DetectedObject {
  label: Label
  score: string
  box: Box
}

export interface ModelConfig {
  labels: Label[]
  threshold: number
  index: Index
  path: string
}
