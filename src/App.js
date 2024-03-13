import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoModel from '@tensorflow-models/coco-ssd';

function App() {
  const [model, setModel] = useState();
  const [objectName, setObjectName] = useState();
  const [objectScore, setObjectScore] = useState();

  async function loadModel() {
    try {
      const dataset = await cocoModel.load();
      setModel(dataset);
      console.log("dataset ready...");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  async function predict() {
    const detection = await model.detect(document.getElementById("videoSource"));
    if (detection.length > 0) {
      detection.map((result, i) => {
        setObjectName(result.class);
        setObjectScore(result.score);
        console.log(result);
      })
    }
  }

  const videoOption = {
    width: '100%',
    height: 'auto',
    facingMode: "environment"
  }

  return (
    <div className="container">
      <h1>{objectName ? objectName.toString() : ""}</h1>
      <h1>{objectScore ? objectScore.toString() : ""}</h1>
      <div className='sub-container'>
        <Webcam
          style={{ maxWidth: '100%', height: '50vh' }}
          id='videoSource'
          audio={false}
          videoConstraints={videoOption}
        />
        <button onClick={() => predict()}>Start Detection</button>
      </div>
    </div>
  );
}

export default App;
