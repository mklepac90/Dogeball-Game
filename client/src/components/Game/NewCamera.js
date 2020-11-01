//1. Install dependencis DONE
//2. Import dependencies DONE
//3. Setup webcam and canvas DONE
//4. Define references to those DONE
//5. Load posenet DONE
//6. Detect functions DONE
//7. Drawing utilities from tensorflow DONE
//8. Draw functions

import React, { useRef, useState } from 'react';
import './Game.scss';
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import DrawAvatar from "./DrawAvatar";
import {collisionDetection, projectileGenerator} from '../../utilities';

function NewCamera() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const projectileCoords = [];
  let isBad = 1;
  let score = 0;

  //generate 8 good balls on canvas
  for (let i = 0; i < 20; i++) {
    
    projectileGenerator(projectileCoords, isBad);
     console.log("line29 NewCamera: projectileCoords  & i is", i, projectileCoords)
  
  }

  //Load posenet
  const runPosenet = async () => {
    //wait till posenet is loaded
    const net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: { width: 320, height: 240 },
      multiplier: 0.5 //set this to a lower scale => faster but less accurate model
    })

    //continuously run the posenet model to create detections
    setInterval(() => {
      detect(net)
    }, 20)
  }

  //function to actually detect stuff. net is the loaded posenet model
  const detect = async (net) => {
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      //Get Video Properties
      const video = webcamRef.current.video
      const videoWidth = window.innerWidth;
      const videoHeight = window.innerHeight;

      // Set video width
      video.width = videoWidth;
      video.height = videoHeight;

      //Make Detections of pose
      const pose = await net.estimateSinglePose(video, {
        flipHorizontal: true
      });
      
      // Look for a collision (returns index position of collided object)
      const collision = collisionDetection(pose, 0.6, projectileCoords, videoWidth, videoHeight, 30);
      //result is a pair of numbers eg. [2, 0], [6,0] or [other numbers in 1~7, 1] or [undefined, undefined]; 
      //first number is the index of projectile in the projectiles array
      //second number is strike(1) or no strike[0]

      // Adjust score
      if (collision[0]) { //remove the [undefined, undefined] pairs
        
        if (collision[1] === 0) {
          score--;
        } else if (collision[1] === 1) {
          score++;
        }
        
        console.log(score);
        
        // remove object from array of items to be rendered, if collison occurred
        projectileCoords.splice(collision[0], 1);

        // add new set of coordinates to array of projectile coordinates
        projectileGenerator(projectileCoords, isBad);
        isBad++;
        console.log("inside NewCamera line 89; isBad is ", isBad) //=> keeps incrementing? 
      }
      //this draws both the keypoint avatars and all the projectile balls
      DrawAvatar(canvasRef, pose, projectileCoords, videoWidth, videoHeight);
      
    }
  };

  runPosenet();
  
  return (
    <div className="App">
      <header className="App-header">
       <Webcam
        ref={webcamRef}
        style= {{
          position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            visibility: "hidden"
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
             zindex: -1
          }}
        />

      </header>
    </div>
  );
}

export default NewCamera;
