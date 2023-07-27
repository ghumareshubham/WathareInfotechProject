import React, { useState ,useRef} from 'react';
import axios from 'axios';
import StudentsList from './StudentsList';
import '../styles.css'


const AddStudentForm = ({ fetchData }) => {
  const [name, setName] = useState('');
  const [marks, setMarks] = useState({ math: '', science: '', english: '' });
  const studentsListRef = useRef(); // Create a reference to the StudentsList component


  const handleAddStudent = async (e) => {
    e.preventDefault();
    const mathScore = parseInt(marks.math);
    const scienceScore = parseInt(marks.science);
    const englishScore = parseInt(marks.english);
  
    // Check if the marks are valid numbers
    if (isNaN(mathScore) || isNaN(scienceScore) || isNaN(englishScore)) {
      console.error('Invalid marks. Please enter valid numbers.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/addStudent', { name, marks: { math: mathScore, science: scienceScore, english: englishScore } });
        // fetchData(); // Fetch data again after adding the student to update the list
      setName('');
      setMarks({ math: '', science: '', english: '' });
      if (studentsListRef.current) {
        studentsListRef.current.fetchData();
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };
  
  return (
    <div className="form-container">
      <h2 className="form-heading">Add Student Data</h2>
      <form onSubmit={handleAddStudent}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Math:
          <input type="number" value={marks.math} onChange={(e) => setMarks({ ...marks, math: parseInt(e.target.value) })} />
        </label>
        <br />
        <label>
          Science:
          <input type="number" value={marks.science} onChange={(e) => setMarks({ ...marks, science: parseInt(e.target.value) })} />
        </label>
        <br />
        <label>
          English:
          <input type="number" value={marks.english} onChange={(e) => setMarks({ ...marks, english: parseInt(e.target.value) })} />
        </label>
        <br />
        <button  className="submit-button" type="submit">Add Student</button>
      </form>
      <StudentsList ref={studentsListRef} />

    </div>
  );
};

export default AddStudentForm;
