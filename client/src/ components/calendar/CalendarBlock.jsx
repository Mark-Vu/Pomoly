import React from 'react';

export default function Block(props) {
    const {currentDate} = props;

    const isTodayClass = currentDate.isToday ? 'day today' : 'day';
  
    const dayClass =
      props.type === 'prevMonthDate'
        ? 'day prev-date'
        : props.type === 'nextMonthDate'
        ? 'day next-date'
        : isTodayClass;
    
    let blockClass = currentDate.isSelected ? `${dayClass} active` : dayClass;
    
    blockClass = currentDate.hasTodo ? `${blockClass} event` : blockClass;
   
    return (
      <div className={blockClass} onClick={props.onClick}>
        {props.text}
      </div>
    );
  }
  