import  Timer  from './ components/timer/Timer';
import  Nav  from './ components/nav/Nav';
import Calendar from './ components/calendar/Calendar';

export default function App() {
  return (
    <div>
        <Nav/>
        <Timer />
        <Calendar/>
    </div>
  );
}