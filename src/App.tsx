import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import './App.css'
import { detectObjects, drawObjects, DetectedObject } from './utils'
import { model } from '.'

const App = () => {
  const [image, setImage] = useState<HTMLImageElement | null>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const detect = async () => {
      if (canvasRef.current && image && model) {
        canvasRef.current.width = 640
        canvasRef.current.height = 640

        const getTensorImage = () => {
          const tfImage = tf.browser.fromPixels(image)
          const resizedTfImage = tf.image.resizeBilinear(tfImage, [640, 640])
          const castResizedTfImage = resizedTfImage.cast('int32')
          const expanded = castResizedTfImage.expandDims(0)
          return expanded
        }

        tf.engine().startScope()

        model
          .executeAsync(getTensorImage())
          .then(async (predictions: any) => {
            const boxes = await predictions[2].array()
            const classes = await predictions[3].array()
            const scores = await predictions[5].array()
            return detectObjects(boxes[0], classes[0], scores[0], 0.9, 640, 640)
          })
          .then((objects: DetectedObject[]) => {
            const ctx = canvasRef.current?.getContext('2d')
            if (ctx) {
              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
              drawObjects(objects, ctx)
            }
          })
          .then(() => tf.engine().endScope())
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
      image.addEventListener('load', () => setImage(image))
    }
  }

  const onRemoveImage = () => setImage(null)

  return (
    <div className='App'>
      <header className='App-header'>
        <p>Tensorflow camera</p>
      </header>
      <div style={styles.container}>
        <input accept='image/*' type='file' onChange={onChangeImage} />
        {image && (
          <div style={styles.preview}>
            <img src={image.src} style={styles.image} alt='Uploaded' />
            <button onClick={onRemoveImage} style={styles.delete}>
              Remove This Image
            </button>
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                marginLeft: 'auto',
                marginRight: 'auto',
                left: 0,
                right: 0,
                textAlign: 'center',
                zIndex: 999,
                width: 640,
                height: 640,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  } as React.CSSProperties,
  preview: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,
  image: { width: 640, height: 640 },
  delete: {
    cursor: 'pointer',
    padding: 15,
    background: 'red',
    color: 'white',
    border: 'none',
  },
}
