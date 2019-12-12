/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect } from 'react';

export const Video = ({ registerStream }) => {
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
        <video
            id="video"
            autoPlay
            style={{
                width: '100%',
                height: '90%'
            }}
        />
    );
};
