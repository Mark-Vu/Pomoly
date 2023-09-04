import  Timer  from './ components/timer/Timer';
import HomePage from './ components/authentication/HomePage'
import Calendar from './ components/calendar/Calendar';
import { Route, Routes } from "react-router-dom";
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/dashboard" element={ <DashboardLayout/>}> </Route>
      </Routes>
    </>
  );
}
function DashboardLayout() {
  return (
    <div>
      <Timer />
      <Calendar />
    </div>
    );
}