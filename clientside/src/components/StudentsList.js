//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
import React, { useState, useEffect, forwardRef,useRef, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// const ChartViewRef = useRef(); // Create a reference to the ChartView component

const StudentsList = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  // const ChartViewRef = useRef(); // Move the useRef call inside the function component

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      setData(response.data);
      // console.log(response.data); // Check the data in the console
      // if (ChartViewRef.current) {
      //   ChartViewRef.current.fetchData();
      // }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Expose the fetchData function to the parent component using ref
  useImperativeHandle(ref, () => ({
    fetchData,
  }));

  return (
    <div>
      <h2>Click On Any Student Name From Below List To Show Their Chart</h2>
      <ul>
        {data.map((student) => (
          <li key={student._id}>
          <Link to={`/chart/${student._id}`}>{student.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default StudentsList;
