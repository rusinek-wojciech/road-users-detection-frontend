import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import './App.css'
import { drawRect } from './utils'

let model: tf.GraphModel | null = null
tf.loadGraphModel('tensorflow/model.json')
  .then((m) => (model = m))
  .catch(() => console.log('Failed to fetch model'))
  .finally(() => console.log('Finished loading model'))

const App = () => {
  const [image, setImage] = useState<HTMLImageElement | null>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const detect = async () => {
      if (canvasRef.current && image && model) {
        canvasRef.current.width = 640
        canvasRef.current.height = 640

        console.log('fromPixels')
        const tfImage = tf.browser.fromPixels(image)

        console.log('resizeBilinear')
        const resizedTfImage = tf.image.resizeBilinear(tfImage, [640, 640])

        console.log('cast')
        const castResizedTfImage = resizedTfImage.cast('int32')

        console.log('exapndDims')
        const expanded = castResizedTfImage.expandDims(0)

        console.log('obj')
        const obj = (await model.executeAsync(expanded)) as any
        const boxes = await obj[2].array()
        const classes = await obj[3].array()
        const scores = await obj[5].array()
        const ctx = canvasRef.current.getContext('2d')

        if (ctx) {
          requestAnimationFrame(() => {
            drawRect(boxes[0], classes[0], scores[0], 0.9, 640, 640, ctx)
          })

          tf.dispose(tfImage)
          tf.dispose(resizedTfImage)
          tf.dispose(castResizedTfImage)
          tf.dispose(expanded)
          tf.dispose(obj)
        }
      }
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx?.clearRect(0, 0, 640, 640)
    }

    detect()
  }, [image])

  const changeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files && files.length > 0) {
      const file = files[0]
      if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
        const image = new Image()
        image.src = URL.createObjectURL(file)
        image.addEventListener('load', () => setImage(image))
      } else {
        console.warn('File is not valid image')
      }
    }
  }

  const removeImage = () => setImage(null)

  return (
    <div className='App'>
      <header className='App-header'>
        <p>Tensorflow camera</p>
        <div style={styles.container}>
          <input accept='image/*' type='file' onChange={changeImage} />
          {image && (
            <div style={styles.preview}>
              <img src={image.src} style={styles.image} alt='Uploaded' />
              <button onClick={removeImage} style={styles.delete}>
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
      </header>
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
