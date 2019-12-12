/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useCallback } from 'react';
import AFRAME from 'aframe';

import Slider from './Slider';

export const Video = ({ children, registerStream }) => {
    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log('Requesting camera permission');
            navigator.mediaDevices
                .getUserMedia({
                    audio: false,
                    video: true,
                    facingMode: 'environment'
                })
                .then(stream => {
                    console.log('Setting video output to video tag', stream);
                    const video = document.getElementById('video');
                    video.srcObject = stream;
                    registerStream(stream);
                });
        } else {
            console.error(
                'navigator.mediaDevices.getUserMedia is not supported. Use another browser.'
            );
        }
    }, [registerStream]);

    return (
        <div>
            <video
                id="video"
                autoPlay
                style={{
                    width: '90%',
                    height: '75%',
                    paddingLeft: '10%'
                }}
            />
            {children}
        </div>
    );
};

export const ARScene = ({
    setPosition,
    setRotation,
    setElement,
    element,
    position,
    rotation
}) => {
    const registerClickHandler = useCallback((event, self) => {
        // The raycaster gives a location of the touch in the scene
        const touchPoint = event.detail.intersection.point;

        if (!document.getElementById('model')) {
            // Create new entity for the new object
            const newElement = document.createElement('a-entity');
            setElement(newElement);

            const randomYRotation = Math.random() * 360;
            setRotation([rotation[0], randomYRotation, rotation[2]]);

            newElement.setAttribute('id', 'model');
            newElement.setAttribute('draggable', 'true');
            newElement.setAttribute('visible', 'false');
            newElement.setAttribute('scale', '0.0001 0.0001 0.0001');

            newElement.setAttribute('gltf-model', '#treeModel');
            self.el.sceneEl.appendChild(newElement);

            newElement.addEventListener('model-loaded', () => {
                // Once the model is loaded, we are ready to show it popping in using an animation
                newElement.setAttribute('visible', 'true');
                newElement.setAttribute('animation', {
                    property: 'scale',
                    to: '0.01 0.01 0.01',
                    easing: 'easeOutElastic',
                    dur: 800
                });
            });
        }
        setPosition({ ...touchPoint });
    }, []);

    useEffect(() => {
        AFRAME.registerComponent('tap-place', {
            init: function() {
                const ground = document.getElementById('ground');
                ground.addEventListener('click', event => {
                    registerClickHandler(event, this);
                });
            }
        });
    }, []);

    useEffect(() => {
        if (element) {
            element.setAttribute('position', position);
            element.setAttribute('rotation', rotation.join(' '));
        }
    }, [element, position, rotation]);

    useEffect(() => {
        if (element) {
            element.addEventListener('click', event => {
                console.log(event);
            });
        }
    }, [element]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div>
                <a-scene tap-place>
                    <a-assets>
                        <a-asset-item
                            id="treeModel"
                            src="./venia-static/3d-models/Tree/tree.glb"
                        />
                    </a-assets>

                    <a-camera
                        position="0 8 0"
                        raycaster="objects: .cantap"
                        cursor="fuse: false;rayOrigin: mouse;"
                    />

                    <a-entity camera look-controls mouse-cursor />

                    <a-entity
                        light="type: directional;
               intensity: 0.8;"
                        position="1 4.3 2.5"
                    />

                    <a-light type="ambient" intensity="1" />

                    <a-entity
                        id="ground"
                        class="cantap"
                        geometry="primitive: plane; height: 75%; width: 90%"
                        material="color: #ffffff; transparent: true; opacity: 0.0"
                        position="0 0 -10"
                    />
                </a-scene>
            </div>
        </div>
    );
};

export const Sliders = ({
    handleXRotation,
    handleYRotation,
    handleZRotation,
    element
}) => {
    return (
        <div
            style={{
                position: 'fixed',
                bottom: '0%',
                width: '50%',
                height: 'auto',
                paddingLeft: '25%'
            }}
        >
            <Slider
                label="X - Rotation"
                valueLabelDisplay="auto"
                name="x-rotation"
                defaultValue={0}
                min={-180}
                max={180}
                onChange={handleXRotation}
                disabled={!element}
            />

            <Slider
                label="Y - Rotation"
                valueLabelDisplay="auto"
                name="y-rotation"
                defaultValue={0}
                min={-180}
                max={180}
                onChange={handleYRotation}
                disabled={!element}
            />

            <Slider
                label="Z - Rotation"
                valueLabelDisplay="auto"
                name="z-rotation"
                defaultValue={0}
                min={-180}
                max={180}
                onChange={handleZRotation}
                disabled={!element}
            />
        </div>
    );
};
