import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
      label: 'Weekly Training Hours',
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  });

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  useEffect(() => {
    fetchPracticeData();
  }, []);

  const fetchPracticeData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await fetch('/profile/practice-log', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      updateChartWithPracticeData(data);
    } catch (error) {
      console.error("Error fetching practice data for chart:", error);
    }
  };

  const updateChartWithPracticeData = (practiceData) => {
    // Get current week's date range
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday of current week

    const weekDays = [];
    const weekData = [0, 0, 0, 0, 0, 0, 0]; // Initialize with zeros for each day

    // Create array of dates for this week
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dateKey = day.toISOString().split('T')[0];
      weekDays.push(dateKey);

      // If we have practice data for this day, use it
      if (practiceData[dateKey]) {
        weekData[i] = practiceData[dateKey];
      }
    }

    // Update chart data
    setChartData({
      ...chartData,
      datasets: [{
        ...chartData.datasets[0],
        data: weekData
      }]
    });
  };

  return <Bar data={chartData} options={options} />;
};

export default ProgressChart;






