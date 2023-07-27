import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChartView from './components/ChartView';
import StudentsList from './components/StudentsList';
import AddStudentForm from './components/AddStudentForm'; // Import the new component


const App = () => {
  return (
    <Router>
      <div>
        <h1>Live Data Chart For Students </h1>
        <AddStudentForm />
        <Routes>
        {/* <Route exact path="/" component={StudentsList} /> */}
          <Route path="/chart/:id" element={<ChartView/> } />
          {/* <Route path="/add" element={<AddStudentForm />} /> New route for the form */}

        </Routes>
      </div>
    </Router>
  );
};

export default App;

