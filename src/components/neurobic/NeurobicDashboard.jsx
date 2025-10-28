import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/appContext';
import {
  NEUROBIC_EXERCISES,
  EXERCISE_CATEGORIES,
  getDailyExercise,
  getPersonalizedRecommendations
} from '../../services/neurobicService';
import styles from '../../assets/styles/neurobic.module.css';
import { toast } from 'react-toastify';

function NeurobicDashboard() {
  const { user, getExerciseSessions, getExerciseStats } = useApp();
  
  const [stats, setStats] = useState(null);
  const [dailyExercise, setDailyExercise] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      
      // Get user statistics
      const userStats = await getExerciseStats(user.uid);
      setStats(userStats);
      
      // Get daily exercise
      const daily = getDailyExercise();
      setDailyExercise(daily);
      
      // Get personalized recommendations
      const sessions = await getExerciseSessions(user.uid);
      const progressData = sessions.docs.map((doc) => doc.data());
      const recs = getPersonalizedRecommendations(progressData);
      setRecommendations(recs);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load exercise data');
    } finally {
      setLoading(false);
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case EXERCISE_CATEGORIES.MEMORY:
        return '🧠';
      case EXERCISE_CATEGORIES.ATTENTION:
        return '👁️';
      case EXERCISE_CATEGORIES.PROBLEM_SOLVING:
        return '🧩';
      case EXERCISE_CATEGORIES.CREATIVITY:
        return '🎨';
      case EXERCISE_CATEGORIES.SENSORY:
        return '🌈';
      default:
        return '⚡';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case EXERCISE_CATEGORIES.MEMORY:
        return '#8B5CF6';
      case EXERCISE_CATEGORIES.ATTENTION:
        return '#F59E0B';
      case EXERCISE_CATEGORIES.PROBLEM_SOLVING:
        return '#10B981';
      case EXERCISE_CATEGORIES.CREATIVITY:
        return '#EC4899';
      case EXERCISE_CATEGORIES.SENSORY:
        return '#3B82F6';
      default:
        return '#6366F1';
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return { label: 'Beginner', color: '#10B981' };
      case 'intermediate':
        return { label: 'Intermediate', color: '#F59E0B' };
      case 'advanced':
        return { label: 'Advanced', color: '#EF4444' };
      default:
        return { label: difficulty, color: '#6366F1' };
    }
  };

  const filteredExercises = selectedCategory === 'all'
    ? NEUROBIC_EXERCISES
    : NEUROBIC_EXERCISES.filter(ex => ex.category === selectedCategory);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading neurobic exercises...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h2>🧠 Neurobic Exercises</h2>
        <p className={styles.subtitle}>
          Enhance your cognitive abilities through scientifically-designed brain exercises
        </p>
      </div>

      {/* Statistics */}
      {stats && stats.totalSessions > 0 && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏆</div>
            <div className={styles.statValue}>{stats.totalSessions}</div>
            <div className={styles.statLabel}>Exercises Completed</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statValue}>{stats.avgScore}</div>
            <div className={styles.statLabel}>Average Score</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📈</div>
            <div className={styles.statValue}>
              {Object.keys(stats.categoryStats).length}
            </div>
            <div className={styles.statLabel}>Categories Explored</div>
          </div>
        </div>
      )}

      {/* Daily Exercise */}
      {dailyExercise && (
        <section className={styles.dailySection}>
          <h3>✨ Today's Featured Exercise</h3>
          <div 
            className={styles.dailyCard}
            style={{ borderTopColor: getCategoryColor(dailyExercise.category) }}
          >
            <div className={styles.dailyHeader}>
              <span className={styles.dailyIcon}>
                {getCategoryIcon(dailyExercise.category)}
              </span>
              <span className={styles.dailyCategory}>
                {dailyExercise.category.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            <h4>{dailyExercise.title}</h4>
            <p className={styles.dailyDescription}>{dailyExercise.description}</p>
            
            <div className={styles.dailyMeta}>
              <span>⏱️ {dailyExercise.duration} min</span>
              <span 
                className={styles.difficultyBadge}
                style={{ backgroundColor: getDifficultyBadge(dailyExercise.difficulty).color }}
              >
                {getDifficultyBadge(dailyExercise.difficulty).label}
              </span>
            </div>
            
            <Link
              to={`/profile/neurobic/exercise/${dailyExercise.id}`}
              className={styles.dailyButton}
            >
              Start Daily Challenge
            </Link>
          </div>
        </section>
      )}

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <section className={styles.recommendationsSection}>
          <h3>💡 Recommended For You</h3>
          <div className={styles.recommendationsGrid}>
            {recommendations.map((rec, index) => (
              <div key={index} className={styles.recommendationCard}>
                <h5>{rec.type === 'improvement' ? '📊 Focus Area' : '🌟 Try Something New'}</h5>
                <p>{rec.message}</p>
                <div className={styles.recExercises}>
                  {rec.exercises.map(exercise => (
                    <Link
                      key={exercise.id}
                      to={`/profile/neurobic/exercise/${exercise.id}`}
                      className={styles.recExerciseLink}
                    >
                      {exercise.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className={styles.exercisesSection}>
        <div className={styles.sectionHeader}>
          <h3>All Exercises</h3>
          <div className={styles.categoryFilter}>
            <button
              className={selectedCategory === 'all' ? styles.filterActive : ''}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {Object.values(EXERCISE_CATEGORIES).map(cat => (
              <button
                key={cat}
                className={selectedCategory === cat ? styles.filterActive : ''}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  borderColor: selectedCategory === cat ? getCategoryColor(cat) : 'transparent'
                }}
              >
                {getCategoryIcon(cat)} {cat.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        <div className={styles.exerciseGrid}>
          {filteredExercises.map((exercise) => {
            const difficultyInfo = getDifficultyBadge(exercise.difficulty);
            
            return (
              <div
                key={exercise.id}
                className={styles.exerciseCard}
                style={{ borderLeftColor: getCategoryColor(exercise.category) }}
              >
                <div className={styles.exerciseHeader}>
                  <span className={styles.exerciseIcon}>
                    {getCategoryIcon(exercise.category)}
                  </span>
                  <span
                    className={styles.difficultyBadge}
                    style={{ backgroundColor: difficultyInfo.color }}
                  >
                    {difficultyInfo.label}
                  </span>
                </div>

                <h4>{exercise.title}</h4>
                <p className={styles.exerciseDescription}>{exercise.description}</p>

                <div className={styles.exerciseBenefits}>
                  <h5>Benefits:</h5>
                  <ul>
                    {exercise.benefits.slice(0, 2).map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.exerciseMeta}>
                  <span>⏱️ {exercise.duration} min</span>
                  <span className={styles.exerciseType}>{exercise.type}</span>
                </div>

                <Link
                  to={`/profile/neurobic/exercise/${exercise.id}`}
                  className={styles.startExerciseButton}
                  style={{ backgroundColor: getCategoryColor(exercise.category) }}
                >
                  Start Exercise
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Progress Link */}
      <div className={styles.bottomActions}>
        <Link to="/profile/neurobic/progress" className={styles.progressLink}>
          📊 View Your Progress & Statistics
        </Link>
      </div>

      {/* Information Section */}
      <section className={styles.infoSection}>
        <h3>About Neurobic Exercises</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h4>🧠 What are Neurobics?</h4>
            <p>
              Neurobic exercises are activities designed to stimulate your brain in new and 
              unexpected ways. They help create new neural pathways, enhance cognitive flexibility, 
              and improve overall brain health.
            </p>
          </div>

          <div className={styles.infoCard}>
            <h4>🎯 How to Get Started</h4>
            <ul>
              <li>Start with beginner exercises</li>
              <li>Practice daily for best results</li>
              <li>Try exercises from different categories</li>
              <li>Challenge yourself with harder levels as you improve</li>
              <li>Track your progress over time</li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h4>💪 Benefits</h4>
            <ul>
              <li>Enhanced memory and recall</li>
              <li>Improved focus and attention</li>
              <li>Better problem-solving skills</li>
              <li>Increased mental flexibility</li>
              <li>Reduced cognitive decline</li>
              <li>Stress reduction</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NeurobicDashboard;

