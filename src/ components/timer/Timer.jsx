import React from 'react';
import EditBlock from './EditBlock.jsx';
import '../../assets/styles/timer.css';
export default function Timer() {
  let defaultWorkMin = 25;
  let defaultBreakMin = 5;
  let defaultLongBreakMin = 15;
  let clockSpeedInMillisec = 1000;

  const [workMinute, setWorkMinute] = React.useState(defaultWorkMin);
  const [breakMinute, setBreakMinute] = React.useState(defaultBreakMin);
  const [longBreakMinute, setLongBreakMinute] = React.useState(defaultLongBreakMin);

  const [timerMinute, setTimerMinute] = React.useState(workMinute); // For displaying minute
  const [timerSecond, setTimerSecond] = React.useState(0); // For displaying second

  const [mode, setMode] = React.useState('work'); // 3 modes: work, break, and longBreak
  const [isPaused, setIsPaused] = React.useState(true); // Check if the clock is paused or running
  const [workIntervalCounter, setWorkIntervalCounter] = React.useState(0); // How many work intervals before the long break

  React.useEffect(() => {
    setTimerMinute(mode === 'work' ? workMinute : mode === 'break' ? breakMinute : longBreakMinute);
  }, [mode]);
  React.useEffect(() => {
    if (!isPaused) {
      let interval = setInterval(() => {
        if ((timerSecond === 0 || timerSecond === "0" )&& (timerMinute === 0 || timerMinute === "0")) {
          // Timer reached 0:00
          if (mode === 'work') {
            setWorkIntervalCounter(prevWorkIntervalCounter => prevWorkIntervalCounter + 1);
            if (workIntervalCounter === 3) {
              setTimerMinute(longBreakMinute);
              setMode('longBreak');
              setWorkIntervalCounter(0);
            } else {
              setTimerMinute(breakMinute);
              setMode('break');
            }
          } else {
            setMode('work');
            setTimerMinute(workMinute);
          }
          setIsPaused(prevIsPaused => !prevIsPaused);
        } else {
          if (timerSecond === 0) {
            // Decrease minute when seconds reach 0
            setTimerMinute(prevMinute => prevMinute - 1);
            setTimerSecond(59);
          } else {
            // Decrease seconds
            setTimerSecond(prevSecond => prevSecond - 1);
          }
        }
      }, clockSpeedInMillisec);
      return () => clearInterval(interval);
    }
  }, [isPaused, timerMinute, timerSecond, mode, workMinute, breakMinute, longBreakMinute, workIntervalCounter]);
  

  function togglePause() {
    setIsPaused(prevIsPaused => !prevIsPaused);
  }
  function resetTime() {
    setTimerMinute(() => (mode === 'work' ? workMinute : mode === 'break' ? breakMinute : longBreakMinute));
    setTimerSecond(0);
    setIsPaused(true);
  }

  function handleLengthChange(lengthType, increment) {
    resetTime();
    let newMinute;
    
    if (lengthType === 'break') {
      newMinute = parseInt(breakMinute, 10) + increment;
      setBreakMinute(Math.max(0, Math.min(newMinute, 99)));
      if (mode === 'break') {
        setTimerMinute(Math.max(0, Math.min(newMinute, 99)));
      }
    }
    if (lengthType === 'work') {
      newMinute = parseInt(workMinute, 10) + increment;
      setWorkMinute(Math.max(0, Math.min(newMinute, 99)));
      if (mode === 'work') {
        setTimerMinute(Math.max(0, Math.min(newMinute, 99)));
      }
    }
    if (lengthType === 'longBreak') {
      newMinute = parseInt(longBreakMinute, 10) + increment;
      setLongBreakMinute(Math.max(0, Math.min(newMinute, 99)));
      if (mode === 'longBreak') {
        setTimerMinute(Math.max(0, Math.min(newMinute, 99)));
      }
    }
  }

  function increaseLength(lengthType) {
    handleLengthChange(lengthType, 1);
  }

  function decreaseLength(lengthType) {
    handleLengthChange(lengthType, -1);
  }

  function editLength(event) {
    // Handle changing the length of focus, break, and long break
    resetTime();
    const { name, value } = event.target;
    let newValue = parseInt(value, 10); // Parse value as an integer
    if (newValue < 0 || newValue > 99) {
      newValue = mode === 'work' ? workMinute : mode === 'break' ? breakMinute : longBreakMinute;
    }

    // Update corresponding state variables based on mode
    if (isNaN(newValue)) {
      newValue = 0;

    }
    //Remove leading zeros by converting to string
    newValue = newValue.toString();

  
    // Update state variables and timer based on the input name
    if (name === 'breakMinute') {
      setBreakMinute(newValue);
      if (mode === 'break') {
        setTimerMinute(newValue);
      }
    }
    if (name === 'workMinute') {
      setWorkMinute(newValue);
      if (mode === 'work') {
        setTimerMinute(newValue);
      }
    }
    if (name === 'longBreakMinute') {
      setLongBreakMinute(newValue);
      if (mode === 'longBreak') {
        setTimerMinute(newValue);
      }
    }
  }
  
  function selectMode(type) {
    resetTime();
    setMode(type);
  }

  const timerMinuteDisplay = (timerMinute < 10 ? '0' : '') + timerMinute;
  const timerSecondDisplay = (timerSecond < 10 && timerSecond > 0 ? '0' : '') + timerSecond + (timerSecond === 0 ? '0' : '');

  return (
    <div className="timer--wrapper flex">
      <div className="flex wrapper rounded-l">
      <div className="timer--container flex">
        <div className="container__timer--display rounded-l flex">
          <div className="timer--display__select--mode flex">
            <button onClick={() => selectMode('work')} className={mode === 'work' ? 'selected__button' : ''}>
              Focus
            </button>
            <button onClick={() => selectMode('break')} className={mode === 'break' ? 'selected__button' : ''}>
              Short Break
            </button>
            <button onClick={() => selectMode('longBreak')} className={mode === 'longBreak' ? 'selected__button' : ''}>
              Long Break
            </button>
          </div>
          <h1 className="timer--display__time">{`${timerMinuteDisplay}:${timerSecondDisplay}`}</h1>
          <div className="timer--display__buttons flex">
            <button onClick={togglePause}>{isPaused ? 'Start' : 'Pause'}</button>
            <button onClick={resetTime}>Reset</button>
          </div>
        </div>
        <div className="container__timer--edit flex ">
        <EditBlock
          minute={workMinute}
          lengthType="Focus"
          handleIncrease={() => increaseLength('work')}
          handleDecrease={() => decreaseLength('work')}
          onChange={editLength}
          
          name="workMinute"
        />
        <EditBlock
          minute={breakMinute}
          lengthType="Short Break"
          handleIncrease={() => increaseLength('break')}
          handleDecrease={() => decreaseLength('break')}
          onChange={editLength}
          
          name="breakMinute"
        />
        <EditBlock
          minute={longBreakMinute}
          lengthType="Long Break"
          handleIncrease={() => increaseLength('longBreak')}
          handleDecrease={() => decreaseLength('longBreak')}
          onChange={editLength}
          
          name="longBreakMinute"
        />

        </div>
      </div>
    </div>
    </div>
  
  );
}
