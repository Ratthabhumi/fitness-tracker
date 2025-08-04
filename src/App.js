import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Target, Zap, Calendar, Calculator as CalcIcon, Info, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';



const FitnessTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingExercise, setEditingExercise] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Sample data based on the Excel structure
  const [exerciseData, setExerciseData] = useState([
    {
      id: 1,
      name: "Bench Press",
      realKg: 30,
      realLb: 0,
      totalKg: 30,
      barKg: 20,
      plateKg: 50,
      rm: 5,
      percentRM: 87,
      oneRM: 57.47,
      approxRM: 57,
      strengthApprox: 49,
      fit24_7Kg: 62.5,
      fit24_7Lb: 138,
      fit24_7ApproxLb: 140
    },
    {
      id: 2,
      name: "Squat",
      realKg: 0,
      realLb: 90,
      totalKg: 41,
      barKg: 0,
      plateKg: 41,
      rm: 5,
      percentRM: 87,
      oneRM: 47.13,
      approxRM: 47,
      strengthApprox: 40,
      fit24_7Kg: 50,
      fit24_7Lb: 111,
      fit24_7ApproxLb: 120
    },
    {
      id: 3,
      name: "Deadlift",
      realKg: 0,
      realLb: 110,
      totalKg: 50,
      barKg: 0,
      plateKg: 50,
      rm: 5,
      percentRM: 87,
      oneRM: 57.47,
      approxRM: 57,
      strengthApprox: 49,
      fit24_7Kg: 60,
      fit24_7Lb: 133,
      fit24_7ApproxLb: 140
    },
    {
      id: 4,
      name: "Overhead Press",
      realKg: 15,
      realLb: 0,
      totalKg: 15,
      barKg: 10,
      plateKg: 25,
      rm: 6,
      percentRM: 85,
      oneRM: 29.41,
      approxRM: 29,
      strengthApprox: 25,
      fit24_7Kg: 25,
      fit24_7Lb: 56,
      fit24_7ApproxLb: 60
    },
    {
      id: 5,
      name: "Barbell Row",
      realKg: 50,
      realLb: 0,
      totalKg: 50,
      barKg: 20,
      plateKg: 70,
      rm: 10,
      percentRM: 75,
      oneRM: 93.33,
      approxRM: 93,
      strengthApprox: 79,
      fit24_7Kg: 80,
      fit24_7Lb: 177,
      fit24_7ApproxLb: 180
    }
  ]);

  const trainingPhases = [
    { phase: 'Endurance', percentRM: '60-70', reps: '12 to 15', rounds: '2 to 3', rest: '1' },
    { phase: 'Hypertrophy', percentRM: '70-80', reps: '8 to 10', rounds: '3', rest: '1 to 2' },
    { phase: 'Strength', percentRM: '85-90', reps: '3 to 5', rounds: '4', rest: '2 to 3' }
  ];

  const rmProgressionData = [
    { rm: 1, percent: 100 },
    { rm: 2, percent: 95 },
    { rm: 3, percent: 93 },
    { rm: 4, percent: 90 },
    { rm: 5, percent: 87 },
    { rm: 6, percent: 85 },
    { rm: 7, percent: 83 },
    { rm: 8, percent: 80 },
    { rm: 9, percent: 77 },
    { rm: 10, percent: 75 },
    { rm: 11, percent: 70 },
    { rm: 12, percent: 67 },
    { rm: 15, percent: 65 }
  ];

  // Calculate derived values
  const calculateDerivedValues = (exercise) => {
  const realTotalKg = exercise.realKg + (exercise.realLb * 0.453592);
  const totalKg = realTotalKg + exercise.barKg;
  const oneRM = totalKg / (1.0278 - (0.0278 * exercise.rm));
  const percentRM = Math.round((totalKg / oneRM) * 100);

  return {
    ...exercise,
    totalKg: Math.round(totalKg * 100) / 100,
    oneRM: Math.round(oneRM * 100) / 100,
    percentRM: percentRM,
    approxRM: Math.round(oneRM),
    strengthApprox: Math.round(oneRM * 0.85),
    fit24_7Kg: Math.round(oneRM * 1.08 * 2) / 2, // Round to nearest 0.5
    fit24_7Lb: Math.round(oneRM * 1.08 * 2.20462),
    fit24_7ApproxLb: Math.round(oneRM * 1.08 * 2.20462 / 5) * 5 // Round to nearest 5
  };
};

// Add this function to calculate the trend value
const getTrendValue = (exerciseData) => {
  const prevMonthData = exerciseData.filter((ex) => {
    const date = new Date(ex.createdAt);
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    return date >= prevMonth;
  });

  const prevMonthAvg1RM = prevMonthData.length > 0
    ? Math.round(prevMonthData.reduce((acc, ex) => acc + ex.oneRM, 0) / prevMonthData.length)
    : 0;

  const currentAvg1RM = exerciseData.length > 0
    ? Math.round(exerciseData.reduce((acc, ex) => acc + ex.oneRM, 0) / exerciseData.length)
    : 0;

  const trendValue = currentAvg1RM - prevMonthAvg1RM;
  return trendValue > 0 ? `+${trendValue.toFixed(1)}kg this month` : `${trendValue.toFixed(1)}kg this month`;
};


  const startEditing = (exercise) => {
    setEditingExercise(exercise.id);
    setEditForm({ ...exercise });
  };

  const cancelEditing = () => {
    setEditingExercise(null);
    setEditForm({});
  };

  const saveExercise = () => {
  const updatedExercise = calculateDerivedValues({
    ...editForm,
    realKg: parseFloat(editForm.realKg) || 0,
    realLb: parseFloat(editForm.realLb) || 0,
    barKg: parseFloat(editForm.barKg) || 0,
    rm: parseInt(editForm.rm) || 1,
  });
  setExerciseData(prev => 
    prev.map(ex => ex.id === editingExercise ? updatedExercise : ex)
  );
  setEditingExercise(null);
  setEditForm({});
};

  const deleteExercise = (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      setExerciseData(prev => prev.filter(ex => ex.id !== id));
    }
  };

  const addNewExercise = () => {
  const newId = Math.max(...exerciseData.map(ex => ex.id)) + 1;
  const newExercise = {
    id: newId,
    name: "New Exercise",
    realKg: 0,
    realLb: 0,
    totalKg: 0,
    barKg: 20,
    plateKg: 0,
    rm: 5,
    percentRM: 0,
    oneRM: 0,
    approxRM: 0,
    strengthApprox: 0,
    fit24_7Kg: 0,
    fit24_7Lb: 0,
    fit24_7ApproxLb: 0,
    createdAt: new Date().toISOString()
  };
  setExerciseData(prev => [...prev, newExercise]);
  setEditingExercise(newId);
  setEditForm({ ...newExercise });
};
const now = new Date();
const oneWeekAgo = new Date();
oneWeekAgo.setDate(now.getDate() - 7);

const recentExerciseCount = exerciseData.filter(ex => {
  return ex.createdAt && new Date(ex.createdAt) > oneWeekAgo;
}).length;

const previousValue = exerciseData.length > 1 ? exerciseData[exerciseData.length - 2].percentRM : 0;
const currentValue = exerciseData.length > 0 ? exerciseData[exerciseData.length - 1].percentRM : 0;
const strengthLevelTrend = Math.round(((currentValue - previousValue) / previousValue) * 100);

const getTrainingDaysThisMonth = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const trainingDays = exerciseData.filter(exercise => {
    const exerciseDate = new Date(exercise.date);
    return exerciseDate >= firstDayOfMonth && exerciseDate <= lastDayOfMonth;
  });
  const checkedDays = trainingDays.filter(exercise => exercise.checked);
  return checkedDays.length;
};

  const StatCard = ({ title, value, unit, icon: Icon, trend }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {value} {unit && <span className="text-sm font-normal text-gray-500">{unit}</span>}
          </p>
          {trend && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  

  
  const ExerciseCard = ({ exercise, index }) => {
    const isEditing = editingExercise === exercise.id;
    
    

    if (isEditing) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-300 w-full max-w-md">
            {/* Edit Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={editForm.realKg ?? ''}
                    onChange={e => setEditForm({ ...editForm, realKg: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    value={editForm.realLb ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, realLb: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bar Weight (kg)</label>
                  <input
                    type="number"
                    value={editForm.barKg ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, barKg: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
                  <input
                    type="number"
                    value={editForm.rm ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, rm: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="15"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={saveExercise}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {exercise.percentRM}% 1RM
            </span>
            <button
              onClick={() => startEditing(exercise)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteExercise(exercise.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Current Weight</p>
            <p className="text-xl font-bold text-gray-900">{exercise.totalKg} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">1RM Estimate</p>
            <p className="text-xl font-bold text-green-600">{exercise.oneRM.toFixed(1)} kg</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">24/7 Fit Recommendation</p>
            <p className="text-lg font-semibold text-purple-600">{exercise.fit24_7Kg} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Reps</p>
            <p className="text-lg font-semibold text-gray-900">{exercise.rm} reps</p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${exercise.percentRM}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
  title="Total Exercises" 
  value={exerciseData.length} 
  icon={Target}
  trend={`+${recentExerciseCount} this week`}
/>

        <StatCard 
  title="Avg 1RM" 
  value={exerciseData.length > 0 ? Math.round(exerciseData.reduce((acc, ex) => acc + ex.oneRM, 0) / exerciseData.length) : 0} 
  unit="kg"
  icon={TrendingUp}
  trend={getTrendValue(exerciseData)}
/>
        <StatCard 
  title="Strength Level" 
  value={exerciseData.length > 0 ? Math.round(exerciseData.reduce((acc, ex) => acc + ex.percentRM, 0) / exerciseData.length) : 0} 
  unit="%"
  icon={Zap}
  trend={strengthLevelTrend > 0 ? `+${strengthLevelTrend}% improvement` : `${strengthLevelTrend}% decline`}
/>
        <StatCard 
  title="Training Days" 
  value={getTrainingDaysThisMonth()} 
  unit="this month"
  icon={Calendar}
/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">1RM Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={exerciseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="oneRM" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RM % Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rmProgressionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rm" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="percent" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exercise Cards */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Exercise Details</h3>
          <button
            onClick={addNewExercise}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exerciseData.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </div>
      </div>
    </div>
  );

  const TrainingPhases = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Training Phase Guidelines</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Phase</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">% 1RM</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Reps</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Sets</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Rest (min)</th>
              </tr>
            </thead>
            <tbody>
              {trainingPhases.map((phase, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      phase.phase === 'Endurance' ? 'bg-green-100 text-green-800' :
                      phase.phase === 'Hypertrophy' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {phase.phase}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{phase.percentRM}</td>
                  <td className="py-4 px-4 text-gray-900">{phase.reps}</td>
                  <td className="py-4 px-4 text-gray-900">{phase.rounds}</td>
                  <td className="py-4 px-4 text-gray-900">{phase.rest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trainingPhases.map((phase, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              phase.phase === 'Endurance' ? 'bg-green-100 text-green-800' :
              phase.phase === 'Hypertrophy' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {phase.phase}
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{phase.phase} Training</h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Intensity: <span className="font-medium text-gray-900">{phase.percentRM}% 1RM</span></p>
              <p className="text-sm text-gray-600">Volume: <span className="font-medium text-gray-900">{phase.reps} reps × {phase.rounds} sets</span></p>
              <p className="text-sm text-gray-600">Recovery: <span className="font-medium text-gray-900">{phase.rest} min rest</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CalculatorTab = () => {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [result, setResult] = useState(null);
    const [unit, setUnit] = useState('kg');

    const calculate1RM = () => {
      if (weight && reps && parseFloat(weight) > 0 && parseInt(reps) > 0) {
        const w = parseFloat(weight);
        const r = parseInt(reps);
        const oneRM = w / (1.0278 - (0.0278 * r));
        setResult({
          oneRM: oneRM.toFixed(1),
          percentages: {
            95: (oneRM * 0.95).toFixed(1),
            90: (oneRM * 0.90).toFixed(1),
            85: (oneRM * 0.85).toFixed(1),
            80: (oneRM * 0.80).toFixed(1),
            75: (oneRM * 0.75).toFixed(1),
            70: (oneRM * 0.70).toFixed(1),
            65: (oneRM * 0.65).toFixed(1),
            60: (oneRM * 0.60).toFixed(1)
          }
        });
      }
    };

    const clearCalculator = () => {
      setWeight('');
      setReps('');
      setResult(null);
    };

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <CalcIcon className="w-8 h-8 mr-3 text-blue-600" />
            1RM Calculator
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your estimated one-rep maximum (1RM) using the proven Brzycki formula.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Calculate Your 1RM</h3>
            <p className="text-blue-100">Enter your current lift weight and reps completed</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight Lifted
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter weight"
                  min="0"
                  step="0.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reps Completed
                </label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter reps"
                  min="1"
                  max="15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={calculate1RM}
                disabled={!weight || !reps}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium"
              >
                Calculate 1RM
              </button>
              <button
                onClick={clearCalculator}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1RM Result */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 text-green-600 mr-2" />
                <h4 className="text-xl font-bold text-green-800">Your Estimated 1RM</h4>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {result.oneRM} {unit}
                </p>
                <p className="text-green-700 text-sm">
                  Based on {weight} {unit} × {reps} reps
                </p>
              </div>
            </div>

            {/* Training Percentages */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                <h4 className="text-xl font-bold text-gray-900">Training Percentages</h4>
              </div>
              <div className="space-y-3">
                {Object.entries(result.percentages).map(([percentage, value]) => (
                  <div key={percentage} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm font-medium text-gray-700">{percentage}% 1RM</span>
                    <span className="font-semibold text-gray-900">{value} {unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Information Cards */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">About 1RM Calculation</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                This calculator uses the Brzycki formula to estimate your one-rep maximum (1RM). 
                The 1RM is the maximum weight you can lift for a single repetition with proper form. 
                This estimation is most accurate for rep ranges between 2-10 reps.
              </p>
            </div>
          </div>
        </div>

        {/* Formula Explanation */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Brzycki Formula</h4>
          <div className="bg-white rounded-lg p-4 font-mono text-center border border-gray-300">
            <p className="text-gray-800">1RM = Weight ÷ (1.0278 - 0.0278 × Reps)</p>
          </div>
          <p className="text-gray-600 text-sm mt-3 text-center">
            Developed by Matt Brzycki in 1993, this formula is widely used by strength coaches and athletes worldwide.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  1RM
                </h1>
              </div>
            </div>
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('phases')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'phases'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Training Phases
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'calculator'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Calculator
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'phases' && <TrainingPhases />}
        {activeTab === 'calculator' && <CalculatorTab />}
      </main>
    </div>
  );
};

export default FitnessTracker;