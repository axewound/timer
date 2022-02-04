import React from "react";

const {useEffect, useRef, useState, useCallback} = React;

const TimerController = () => {
    const [renderedStreamDuration, setRenderedStreamDuration] = useState(
        "00:00:00"
        ),
        streamDuration = useRef(0),
        previousTime = useRef(0),
        requestAnimationFrameId = useRef(null),
        [isStartTimer, setIsStartTimer] = useState(false),
        [isStopTimer, setIsStopTimer] = useState(false),
        [isPauseTimer, setIsPauseTimer] = useState(false),
        [isResumeTimer, setIsResumeTimer] = useState(false),
        isStartBtnDisabled = isStartTimer,
        isStopBtnDisabled = !(isPauseTimer || isResumeTimer || isStartTimer),
        isPauseBtnDisabled = !(isStartTimer || (!isStartTimer && isResumeTimer)),
        isResumeBtnDisabled = isResumeTimer && !isStartTimer;

    const updateTimer = useCallback(() => {
        let now = performance.now();
        let dt = now - previousTime.current;

        if (dt >= 1000) {
            streamDuration.current = streamDuration.current + Math.round(dt / 1000);
            const formattedStreamDuration = new Date(streamDuration.current * 1000)
                .toISOString()
                .substr(11, 8);
            setRenderedStreamDuration(formattedStreamDuration);
            previousTime.current = now;
        }
        requestAnimationFrameId.current = requestAnimationFrame(updateTimer);
    }, []);

    const startTimer = useCallback(() => {
        previousTime.current = performance.now();
        requestAnimationFrameId.current = requestAnimationFrame(updateTimer);
    }, [updateTimer]);

    useEffect(() => {
        if (isStartTimer && !isStopTimer) {
            startTimer();
        }
        if (isStopTimer && !isStartTimer ) {
            streamDuration.current = 0;
            cancelAnimationFrame(requestAnimationFrameId.current);
            setRenderedStreamDuration("00:00:00");
        }
    }, [isStartTimer, isStopTimer, startTimer]);

    const startHandler = () => {
        setIsStartTimer(true);
        setIsStopTimer(false);
    };

    const stopHandler = () => {
        setIsStopTimer(true);
        setIsStartTimer(false);
        setIsPauseTimer(false);
        setIsResumeTimer(false);
    };

    const pauseHandler = () => {
        setIsPauseTimer(true);
        setIsStartTimer(false);
        setIsResumeTimer(false);

        cancelAnimationFrame(requestAnimationFrameId.current);
    };

    const resetHandler = () => {
            setIsStopTimer(true);
            setIsStartTimer(false);
            setIsPauseTimer(false);
            setIsResumeTimer(false);
    };

    return (
        <div className="timer-controller-wrapper">
            <div className="timer-display">{renderedStreamDuration}</div>
            <div className="buttons-wrapper">
                <button
                    onClick={startHandler}
                    disabled={isStartBtnDisabled}
                    className={`timer-controller-btn ${
                        isStartBtnDisabled ? "disabled" : ""
                    }`}
                >
                    Start
                </button>
                <button
                    className={`timer-controller-btn danger ${
                        isStopBtnDisabled ? "disabled" : ""
                    }`}
                    disabled={isStopBtnDisabled}
                    onClick={stopHandler}
                >
                    Stop
                </button>
                <button
                    className={`timer-controller-btn ${
                        isPauseBtnDisabled ? "disabled" : ""
                    }`}
                    disabled={isPauseBtnDisabled}
                    onDoubleClick={pauseHandler}
                >
                    Wait
                </button>
                <button
                    className={`timer-controller-btn ${
                        isResumeBtnDisabled ? "disabled" : ""
                    }`}
                    disabled={isResumeBtnDisabled}
                    onClick={resetHandler}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default TimerController