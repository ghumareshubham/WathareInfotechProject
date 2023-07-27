import React, { useEffect, useRef,useImperativeHandle,forwardRef, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { useParams } from 'react-router-dom';


const ChartView = forwardRef((props, ref) => {
  // const { id } = match.params;
  const { id } = useParams();
  const [studentData, setStudentData] = useState({});

  useEffect(() => {
    console.log("id id id id id id id ...."+id)
    fetchData();
  }, []);
  useEffect(() => {
    console.log("id id id id id id id ...."+id)
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/data/${id}`);
      setStudentData(response.data);
      console.log("studentttttttttttttttttttttttt"+response.data)
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const chartCanvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (studentData && Object.keys(studentData).length !== 0) {
      console.log("in ChartView Useeffect.....")
      const studentName = studentData.name;
      const mathScore = studentData.marks.math;
      const scienceScore = studentData.marks.science;
      const englishScore = studentData.marks.english;

      if (!chartRef.current) {
        chartRef.current = new Chart(chartCanvasRef.current, {
          type: 'bar',
          
          data: {
            labels: ['Math', 'Science', 'English'],
            datasets: [
              {
                label: studentName,
                data: [mathScore, scienceScore, englishScore],
                backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)'],
            
                pointStyle: 'none', // Set the shape of the legend marker to a rectangle
                
            
            
              },
            ],
          },


          options: {
            plugins: {
              title: {
                  display: true,
                  text: 'Student Subjectwise Marks',
                  position:"top",
              },

              legend:{
                display:true,
                position:"top",
                labels: {
                  color: '#FF52A2',
                  fontSize: 25, 
                  usePointStyle: true,  
                },
              },
             

          },


            responsive:true,
            scales: {
              y: {
                beginAtZero: true,
                suggestedMax: 100,
              },
            },

            animation:{
              duration:1000,
              easing:"easeInOutCirc"
            }

          },

        

        });
      } else {
        // Update chart data and options when data changes
        chartRef.current.data.datasets[0].label = studentName;
        chartRef.current.data.datasets[0].data = [mathScore, scienceScore, englishScore];
        chartRef.current.update();
      }
    }
  }, [studentData, chartRef, chartCanvasRef]);

   // Expose the fetchData function to the parent component using ref
  useImperativeHandle(ref, () => ({
    fetchData,
  }));
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
      <h2>Student Chart</h2>
      <canvas width={200} height={200} ref={chartCanvasRef}></canvas>
    </div>
  </div>
  );
});

export default ChartView;
