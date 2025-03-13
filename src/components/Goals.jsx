import React, { useState } from 'react';
import '../styles/Goals.css'

const Goals = () => {
  const [goals, setGoals] = useState([
    { id: 1, text: "Train 3 times a week", completed: false },
    { id: 2, text: "Learn a new technique", completed: false }
  ]);
  const [newGoal, setNewGoal] = useState("");

  // Add a new goal
  const addGoal = (e) => {
    e.preventDefault();
    if (newGoal.trim() === "") return;
    
    const newGoalItem = {
      id: Date.now(),
      text: newGoal,
      completed: false
    };
    
    setGoals([...goals, newGoalItem]);
    setNewGoal("");
  };

  // Toggle goal completion status
  const toggleGoal = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  // Delete a goal
  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="goals-container">
      <h2>My Goals</h2>
      
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
    </div>
  );
};

export default Goals;