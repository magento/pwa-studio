import React, { useCallback, useEffect, useState, useRef } from 'react';
import styles from './rangeSlider.module.css';

const valueCSS = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    gap: '2px',
    paddingTop: '10px'
};

const PriceRangeSlider = ({
    min,
    max,
    onChange,
    valueStyle = valueCSS,
    width = '300px',
    trackColor = '#cecece',
    rangeColor = '#2954fe'
}) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);

    // Convert value to percentage for positioning
    const getPercent = useCallback(
        value => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // set the width of the range to decrease from right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Handle min and max value changes
    useEffect(() => {
        if (minVal !== minValRef.current || maxVal !== maxValRef.current) {
            onChange({ min: minVal, max: maxVal });
            minValRef.current = minVal;
            maxValRef.current = maxVal;
        }
    }, [minVal, maxVal, onChange]);

    return (
        // <div className="w-full flex justify-center flex-col space-y-14">
        //   {/* Display Price Value */}
        //   <div className="w-[300px] px-4 flex items-center justify-between gap-x-5">
        //     <span>
        //       {currencyText} {minVal}
        //     </span>

        //     <div className="flex-1 border-dashed border border-neutral-500 mt-1" />

        //     <span>
        //       {currencyText} {maxVal}
        //     </span>
        //   </div>

        //   {/* Slider */}
        //   <div className="relative" style={{ width }}>
        //     <div className="progress"></div>
        //     <div className="sliders-wrapper">
        //       {/* Min slider */}
        //       <input
        //         type="range"
        //         min={min}
        //         max={max}
        //         value={minVal}
        //         onChange={(event) => {
        //           const value = Math.min(Number(event.target.value), maxVal - 1);
        //           setMinVal(value);
        //         }}
        //         className="thumb thumb-left"
        //         style={{
        //           position: 'absolute',
        //           zIndex: 2,
        //           width,
        //           top: '50%',
        //           transform: 'translateY(-50%)',
        //           background: 'none',
        //         }}
        //       />

        //       {/* Max slider */}
        //       <input
        //         type="range"
        //         min={min}
        //         max={max}
        //         value={maxVal}
        //         onChange={(event) => {
        //           const value = Math.max(Number(event.target.value), minVal + 1);
        //           setMaxVal(value);
        //         }}
        //         className="thumb thumb-right"
        //         style={{
        //           position: 'absolute',
        //           zIndex: 3,
        //           width,
        //           top: '50%',
        //           transform: 'translateY(-50%)',
        //           background: 'none',
        //         }}
        //       />
        //     </div>
        //   </div>
        // </div>
        <div className="w-full flex justify-center flex-col space-y-14">
            {/* Display Price Value */}
            <div className="w-[300px] px-4 flex justify-between gap-x-5">
                <span>{minVal}</span>
                <span>{maxVal}</span>
            </div>

            {/* Style the price range slider */}
            <div className="multi-slide-input-container" style={{ width }}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={event => {
                        const value = Math.min(
                            Number(event.target.value),
                            maxVal - 1
                        );
                        setMinVal(value);
                    }}
                    className={`${styles.thumb} ${styles.thumbleft}`}
                    style={{
                        width,
                        zIndex:
                            minVal > max - 100 || minVal === maxVal
                                ? 5
                                : undefined
                    }}
                />

                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={event => {
                        const value = Math.max(
                            Number(event.target.value),
                            minVal + 1
                        );
                        setMaxVal(value);
                    }}
                    className={`${styles.thumb} ${styles.thumbright}`}
                    style={{
                        width,
                        zIndex:
                            minVal > max - 100 || minVal === maxVal
                                ? 4
                                : undefined
                    }}
                />

                <div className={styles.slider}>
                    <div
                        style={{ backgroundColor: trackColor }}
                        className={styles.trackslider}
                    />

                    <div
                        ref={range}
                        style={{ backgroundColor: rangeColor }}
                        className={styles.rangeslider}
                    />
                </div>
            </div>
        </div>
    );
};

export default PriceRangeSlider;
