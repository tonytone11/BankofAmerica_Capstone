import React, { useState, useEffect } from 'react';
import '../styles/Goals.css'

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch goals from the database on component mount
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError("You must be logged in to view goals");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://bankofamerica-capstone.onrender.com/profile/goals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      // Transform data to match our component's state structure
      const formattedGoals = data.map(item => ({
        id: item.id,
        text: item.goal,
        completed: item.completed === 1 || item.completed === true
      }));

      setGoals(formattedGoals);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
      setError("Failed to load goals. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new goal
  const addGoal = async (e) => {
    e.preventDefault();
    if (newGoal.trim() === "") return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError("You must be logged in to add goals");
      return;
    }

    try {
      const response = await fetch('https://bankofamerica-capstone.onrender.com/profile/goals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ goal: newGoal })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Add the new goal to state with the ID from the server
      const newGoalItem = {
        id: data.id,
        text: newGoal,
        completed: false
      };

      setGoals([...goals, newGoalItem]);
      setNewGoal("");
    } catch (error) {
      console.error("Failed to add goal:", error);
      setError("Failed to add goal. Please try again.");
    }
  };

  // Toggle goal completion status
  const toggleGoal = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Find the current goal
    const goalToUpdate = goals.find(goal => goal.id === id);
    if (!goalToUpdate) return;

    // Optimistically update the UI
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));

    try {
      const response = await fetch(`https://bankofamerica-capstone.onrender.com/profile/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !goalToUpdate.completed })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
        // If there's an error, revert the optimistic update
        setGoals(goals);
      }
    } catch (error) {
      console.error("Failed to update goal:", error);
      // Revert the optimistic update
      setGoals(goals);
      setError("Failed to update goal. Please try again.");
    }
  };

  // Delete a goal
  const deleteGoal = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Optimistically update the UI
    setGoals(goals.filter(goal => goal.id !== id));

    try {
      const response = await fetch(`https://bankofamerica-capstone.onrender.com/profile/goals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
        // If there's an error, revert the optimistic update
        fetchGoals(); // Refetch all goals
      }
    } catch (error) {
      console.error("Failed to delete goal:", error);
      // Revert the optimistic update
      fetchGoals(); // Refetch all goals
      setError("Failed to delete goal. Please try again.");
    }
  };

  return (
    <div className="goals-container">
      <div> <p>Keep track of your Goals</p></div>
      <h2>My Goals</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={addGoal} className="goal-form">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Enter a new goal"
          className="goal-input"
        />
        <button type="submit" className="add-goal-btn">Add Goal</button>
      </form>

      {isLoading ? (
        <p className="loading">Loading goals...</p>
      ) : (
        <ul className="goals-list">
          {goals.length === 0 ? (
            <p className="no-goals">No goals yet. Add one above!</p>
          ) : (
            goals.map(goal => (
              <li key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
                <label className="goal-label">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => toggleGoal(goal.id)}
                    className="goal-checkbox"
                  />
                  <span className="goal-text">{goal.text}</span>
                </label>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="delete-goal-btn"
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Goals;






