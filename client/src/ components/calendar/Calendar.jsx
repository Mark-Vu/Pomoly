import { lazy, Suspense, useState, useEffect } from 'react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faPlus, faCircle, faClose } from "@fortawesome/free-solid-svg-icons";
const Block = lazy(() => import('./CalendarBlock.jsx'));
import '../../assets/styles/calendar.css'
import api from '../authentication/Api.jsx';
import Cookies from 'js-cookie';
import Popup from '../error/Popup.jsx'
import {nanoid} from 'nanoid';

export default function Calendar({todoList, handleSetTodo}) {
  

  const today=new Date()
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  //Keeping track of the current displaying blocks
  const [currentDate, setCurrentDate] = useState({
    day: todayDate,
    month: todayMonth,
    year: todayYear,
    isSelected: false,
    isToday: false,
    hasTodo: false,
  })


  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState({
    day: todayDate,
    month: todayMonth,
    year: todayYear
  });


  React.useEffect(() => {
    //Render the calendar
    setCalendarDays(prevCalendarDays => {
      return prevCalendarDays.map(row => {
        return row.map(block => {
          let isSelected =
            selectedDay.day === block.props.text &&
            selectedDay.month === block.props.currentDate.month &&
            selectedDay.year === block.props.currentDate.year;
            
          return React.cloneElement(block, {
            ...block.props,
            currentDate: { ...block.props.currentDate, isSelected: isSelected }
          });
        });
      });
    });
  }, [selectedDay]);

  /*-------------------- HELPER FUNCTIONS --------------------*/

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getMonthName(month) {
    const options = { month: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(todayYear, month));
  }

  function hasTodo(day, month, year) {
    const formattedDate = formatDate(day, month, year);
    if (formattedDate in todoList && todoList[formattedDate].length > 0) {
      return true;
    }
    return false;
  }

  function formatDate(day, month, year) {
    const date = new Date(year, month, day);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate
  }


  /*-------------------- CALENDAR UI --------------------*/

  function renderCalendar() {
    const year = todayYear;
    const daysInMonth = getDaysInMonth(year, currentDate.month);
    const firstDay = new Date(year, currentDate.month, 1).getDay();
  
    const prevMonthDays = getDaysInMonth(year, currentDate.month - 1);
    let calendar = [];
  
    let day = 1;
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          const prevMonthDaysText = prevMonthDays - firstDay + j + 1;
         
          row.push(
              <Block
              key={nanoid()}
              text={prevMonthDaysText}
              type="prevMonthDate"
              currentDate={{ ...currentDate, month: currentDate.month - 1 }}
              onClick={() => prevMonthDateClick(prevMonthDaysText, currentDate.month - 1, year)}
            />
          );
        } else if (day > daysInMonth) {
          const nextMonthDaysText = day - daysInMonth;
          row.push(
              <Block
                key={nanoid()}
                text={nextMonthDaysText}
                type="nextMonthDate"
                currentDate={{ ...currentDate, month: currentDate.month + 1 }}
                onClick={() => nextMonthDateClick(nextMonthDaysText, currentDate.month + 1, year)}
              />
          );
          day++;
        } else {
          const dayText = day;
          const isToday = todayDate === day &&
                          todayMonth === currentDate.month &&
                          todayYear === currentDate.year 
                          ? true : false
          const containTodo = hasTodo(day, currentDate.month, currentDate.year);
          row.push(
              <Block
                key={nanoid()}
                text={dayText}
                type="date"
                currentDate={{...currentDate, isToday: isToday, hasTodo: containTodo}}
                onClick={() => thisMonthDateClick(dayText, currentDate.month, year)}
              />
          );
          day++;
        }
      }
      calendar.push(row);
    }
    return calendar;
  }
  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    } else {
      const lastDigit = day % 10;
      switch (lastDigit) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    }
  }

  function toggleNextMonth() {
    setCurrentDate(prevCurrentDate => {
      const nextMonth = prevCurrentDate.month === 11 ? 0 : prevCurrentDate.month + 1;
      const nextYear = prevCurrentDate.month === 11 ? prevCurrentDate.year + 1 : prevCurrentDate.year;
      return { ...prevCurrentDate, month: nextMonth, year: nextYear };
    });
  }

  function togglePrevMonth() {
    setCurrentDate(prevCurrentDate => {
      const prevMonth = prevCurrentDate.month === 0 ? 11 : prevCurrentDate.month - 1;
      const prevYear = prevCurrentDate.month === 0 ? prevCurrentDate.year - 1 : prevCurrentDate.year;
      return { ...prevCurrentDate, month: prevMonth, year: prevYear };
    });
  }
  /*-------------------- CALENDAR FUNCTIONS --------------------*/

  function handleDaySelection(day, month, year) {
    //Select active day
    setSelectedDay({
      day: day,
      month: month,
      year: year
    });
  }
  function prevMonthDateClick(day, month, year) {
    handleDaySelection(day, month, year);
  }

  function thisMonthDateClick(day, month, year) {
    handleDaySelection(day, month, year);
  }

  function nextMonthDateClick(day, month, year) {
    handleDaySelection(day, month, year);
  }

  function selectToday() {
    handleDaySelection(todayDate, todayMonth, todayYear);
    setCurrentDate(prevCurrentDate => ({
      ...prevCurrentDate,
      day: todayDate,
      month: todayMonth,
      year: todayYear,
    }));
  }

  
  const dayOfWeek = new Date(selectedDay.year, selectedDay.month, selectedDay.day).toLocaleString('en-US', { weekday: 'short' });
  const dayMonthYear = `${selectedDay.day}${getDaySuffix(selectedDay.day)} ${getMonthName(selectedDay.month)} ${selectedDay.year}`
  
  /*-------------------- Todos --------------------*/

  const [isAddEvent, setIsAddEvent] = React.useState(false)
  const [todoForm, setTodoForm] = React.useState({
    title: "",
    time: "",
  })

  function todoFormOnChange(event) {
    const {name, value} = event.target;
    setTodoForm( prevTodoForm => ({
      ...prevTodoForm,
      [name]:value
    })
    )
  }
  
  function toggleAddEvent() {
    setIsAddEvent(prevIsAddEvent => !prevIsAddEvent)
  }
  
  async function addEvent(event) {
    event.preventDefault();
  
    const formattedDate = formatDate(selectedDay.day, selectedDay.month, selectedDay.year);
    const payload = {
      date: formattedDate,
      title: todoForm.title,
      time: todoForm.time,
    };
  
    try {
      const response = await api.put('/calendar', payload);
      console.log(response.data.message)
      handleSetTodo(prevTodoList => {
        const existingTodos = prevTodoList[formattedDate] || [];
        return {
          ...prevTodoList,
          [formattedDate]: [...existingTodos, {...payload, id:response.data.event_id}]
        };
      });
  
      setTodoForm({
        title: "",
        time: "",
      });
      setIsAddEvent(false); 
    } catch (error) {
      console.log(error)
    }
  }
  

  async function deleteEvent(id) {
      try {
        const response =  await api.delete(`/calendar/${id}`);
    
        // Update the local state (todoList) to reflect the deleted event
        handleSetTodo((prevTodoList) => {
          const updatedTodoList = { ...prevTodoList };
    
          // Iterate over the dates in todoList and remove the event with the matching ID
          for (const date in updatedTodoList) {
            updatedTodoList[date] = updatedTodoList[date].filter((event) => event.id !== id);
          }
    
          return updatedTodoList;
        });
        console.log(response.data.message)
      } catch (error) {
        console.log(error)
      }
    
    //Update in the UI
    handleSetTodo((prevTodoList) => {
      const updatedTodoList = {};
  
      Object.keys(prevTodoList).forEach(date => {
        updatedTodoList[date] = prevTodoList[date].filter(event => event.id !== id);
      });
  
      return updatedTodoList;
    });
  }
  
  // Check if the selected day has todo
  const formattedDate = formatDate(selectedDay.day, selectedDay.month, selectedDay.year);
  const eventsForSelectedDay = formattedDate in todoList ? todoList[formattedDate] : [];
  const sortedEvents = sortEventsByTime(eventsForSelectedDay);
  /*-----------------------------------------------------------*/
  React.useEffect(() => {
    setCalendarDays(renderCalendar());
  }, [currentDate, todoList])

  /*----------------------------RESTRICT MONTH YEAR INPUT-------------------------------*/
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  function handleMonthChange(e) {
    let value = e.target.value;
    const month = value.replace(/[^0-9]/g, '');
    if (month === '' || month === '0' || (month.length === 1 && month >= '1') || (month.length === 2 && month >= '01' && month <= '12')) {
      setMonth(month);
    }
  }

  function handleYearChange(e) {
    const value = e.target.value;
    setYear(value.replace(/[^0-9]/g, '').slice(0, 4));
  }

  /*----------------------------GO TO FUNCTION-------------------------------*/
  const [inputMonth, setInputMonth] = useState('');
  const [inputYear, setInputYear] = useState('');

  function handleMonthChange(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '0' || (value.length === 2 && parseInt(value, 10) > 12)) {
      value = '';
    } else if (value.length === 1 && parseInt(value, 10) > 1) {
      value = `0${value}`;
    }
    setInputMonth(value);
  }

  function handleGoClick() {
    // Convert inputMonth to a number and subtract 1 because JavaScript months are 0-indexed
    const monthNumber = parseInt(inputMonth, 10) - 1;
    const yearNumber = parseInt(inputYear, 10);

    // Validate the inputs
    if (!isNaN(monthNumber) && !isNaN(yearNumber) && monthNumber >= 0 && monthNumber < 12) {
      setCurrentDate({
        ...currentDate,
        month: monthNumber,
        year: yearNumber
      });
      // Reset the input fields
      setInputMonth('');
      setInputYear('');
    } else {
      alert("Please enter a valid month (01-12) and year (YYYY).");
    }
  }
  /*----------------------------RANDOM NO EVENT TEXT-------------------------------*/ 
  const [noEventText, setNoEventText] = useState(getRandomNoEventText());

  function getRandomNoEventText() {
    const noEventTexts = [
      "Your day is a blank canvas, ready for new experiences!",
      "Looks like you've got some free time today!",
      "Nothing on the agenda. Enjoy your free time!",
      "All clear! Time to relax or try something new.",
      "Take it easy! There are no events scheduled for today.",
      "A clear schedule means endless possibilities.",
      "Breathe easy—no events to see here.",
      "Your day is wide open. What will you create?",
      "Seize the day! It's all yours to enjoy.",
      "Embrace the calm. No events are on the horizon."
    ];
    const randomIndex = Math.floor(Math.random() * noEventTexts.length);
    return noEventTexts[randomIndex];
  }

  useEffect(() => {
    const formattedDate = formatDate(selectedDay.day, selectedDay.month, selectedDay.year);
    if (!(formattedDate in todoList && todoList[formattedDate].length > 0)) {
      setNoEventText(getRandomNoEventText());
    }
  }, [selectedDay, todoList]);  

  /*----------------------------SORT EVENT BY TIME-------------------------------*/ 
  function sortEventsByTime(events) {
    return events.sort((a, b) => {
      // Assuming the time is in 'HH:mm' format
      return a.time.localeCompare(b.time);
    });
  }

  return (
    <section className="calendar--wrapper">
      <div className="calendar--container">
        <div className="left">
          <div className="calendar">
            <div className="month">
              <FontAwesomeIcon icon={faAngleLeft} style={{ cursor: 'pointer' }} onClick={togglePrevMonth} />
              <div className="date">
                <span className="year">{getMonthName(currentDate.month)} {currentDate.year}</span>
              </div>
              <FontAwesomeIcon icon={faAngleRight} style={{ cursor: 'pointer' }} onClick={toggleNextMonth} />
            </div>
            <div className="weekdays">
              <div className='sun'>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <Suspense fallback={<div>Loading</div>}>
              <div className="days">{calendarDays}</div>
            </Suspense>
              <div className="goto-today">
                <div className="goto">
                  <input 
                    type="text" 
                    placeholder="MM" 
                    className="month-input" 
                    value={inputMonth}
                    onChange={handleMonthChange}
                    maxLength="2" 
                  />
                  <input 
                    type="text" 
                    placeholder="YYYY" 
                    className="year-input" 
                    value={inputYear}
                    onChange={(e) => setInputYear(e.target.value)}
                    maxLength="4" 
                  />
                  <button className="goto-btn" onClick={handleGoClick}>Go</button>
                </div>
                <button className="today-btn" onClick={selectToday}>Today</button>
              </div>
          </div>
        </div>
        <div className="right">
          <div className="today-date">
            <div className="event-day">{dayOfWeek}</div>
            <div className="event-date">{dayMonthYear}</div>
          </div>
          <div className="Todos">
          <div className='events'>
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => (
                <div className="event" key={event.id} onClick={() => deleteEvent(event.id)}>
                  <div className="title">
                    <FontAwesomeIcon icon={faCircle}/>
                    <h3 className="event-title">{event.title}</h3>
                  </div>
                  <div className="event-time">
                    <span>{event.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events">{noEventText}</div>
            )}
          </div>
          </div>
          <div className={isAddEvent ? "add-event-wrapper active" : "add-event-wrapper"}>
            <div className="add-event-header">
              <div className="title">Add Event</div>
            </div>
            <div className="add-event-body">
              <form>
                <div className="add-event-input">
                  <input 
                  type="text" 
                  placeholder="Event Name" 
                  className="event-name" 
                  onChange={todoFormOnChange}
                  name="title"
                  value={todoForm.title}
                  />
                </div>
                <div className="add-event-input">
                  <label htmlFor="timeInput" className={!todoForm.time ? "time-placeholder" : ""}>
                    {!todoForm.time && "From"}
                  </label>
                  <input 
                    type="time" 
                    className={todoForm.time ? "event-time-filled" : "event-time-from"}
                    onChange={todoFormOnChange} 
                    name="time"
                    value={todoForm.time}
                  />
                  <div className="clock-icon"></div>
                </div>
                <div className="add-event-input">
                  <label htmlFor="timeInput" className={!todoForm.time ? "time-placeholder" : ""}>
                    {!todoForm.time && "To"}
                  </label>
                  <input 
                    type="time" 
                    className={todoForm.time ? "event-time-filled" : "event-time-to"}
                    onChange={todoFormOnChange} 
                    name="time"
                    value={todoForm.time}
                  />
                  <div className="clock-icon"></div>
                </div>  
                <div className="add-event-footer">
                <button className="add-event-btn" onClick={addEvent}>Add</button>
                </div> 
              </form>
            </div>
          </div>
        </div>
        <button className="add-event" onClick={toggleAddEvent}>
          <FontAwesomeIcon icon={isAddEvent ? faClose : faPlus} />
        </button>
      </div>
    </section>
  );
  }