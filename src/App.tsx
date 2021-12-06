import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import {
  detectObjects,
  drawObjects,
  DetectedObject,
  getTensorImage,
} from './utils'
import { model } from '.'
import { config } from './config'

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  preview: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'column',
  },
  image: { width: '100%', height: '*' },
  delete: {
    cursor: 'pointer',
    padding: 15,
    background: 'red',
    color: 'white',
    border: 'none',
  },
  canvas: {
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 999,
    width: '100%',
    height: '*',
  },
  app: {
    textAlign: 'center',
    minHeight: '100vh',
  },
  appHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
  },
}

export const App = () => {
  const [image, setImage] = useState<HTMLImageElement | null>()
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    const draw = () => {
      if (ctx && canvasRef.current && image) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        const width = window.innerWidth
        const height = Math.floor(
          width * (image.naturalHeight / image.naturalWidth)
        )

        canvasRef.current.width = width
        canvasRef.current.height = height

        drawObjects(
          detectedObjects,
          ctx,
          width / image.naturalWidth,
          height / image.naturalHeight
        )
      }
      requestRef.current = requestAnimationFrame(draw)
    }
    requestRef.current = requestAnimationFrame(draw)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [image, detectedObjects])

  useEffect(() => {
    const detect = async () => {
      if (image && model) {
        tf.engine().startScope()
        model
          .executeAsync(
            getTensorImage(image, config.MODEL_WIDTH, config.MODEL_HEIGHT)
          )
          .then(async (predictions: any) => {
            const boxes = predictions[config.BOXES_INDEX].arraySync()[0]
            const classes = predictions[config.CLASSES_INDEX].arraySync()[0]
            const scores = predictions[config.SCORES_INDEX].arraySync()[0]
            return detectObjects(
              boxes,
              classes,
              scores,
              config.TRESHOLD,
              image.naturalWidth,
              image.naturalHeight
            )
          })
          .then((objects: DetectedObject[]) => setDetectedObjects(objects))
          .finally(() => tf.engine().endScope())
      }
    }
    detect()
  }, [image])

  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (
      files &&
      files.length > 0 &&
      /\.(jpe?g|png|gif)$/i.test(files[0].name)
    ) {
      const image = new Image()
      image.src = URL.createObjectURL(files[0])
      image.addEventListener('load', () => {
        setDetectedObjects([])
        setImage(image)
      })
    }
  }

  const onRemoveImage = () => {
    setDetectedObjects([])
    setImage(null)
  }

  return (
    <div style={styles.app}>
      <header style={styles['appHeader']}>
        <p>Tensorflow Road Traffic Detection</p>
      </header>
      <div style={styles.container}>
        <input accept='image/*' type='file' onChange={onChangeImage} />
        {image && (
          <div style={styles.preview}>
            <img src={image.src} style={styles.image} alt='Uploaded' />
            <button onClick={onRemoveImage} style={styles.delete}>
              Remove This Image
            </button>
            <canvas ref={canvasRef} style={styles.canvas} />
          </div>
        )}
      </div>
    </div>
  )
}
