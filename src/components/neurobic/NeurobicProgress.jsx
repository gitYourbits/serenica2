import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/appContext';
import { EXERCISE_CATEGORIES } from '../../services/neurobicService';
import styles from '../../assets/styles/neurobic.module.css';
import { toast } from 'react-toastify';

function NeurobicProgress() {
  const navigate = useNavigate();
  const { user, getExerciseSessions, getExerciseStats } = useApp();
  
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // all, week, month
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadProgressData();
  }, []);

  async function loadProgressData() {
    try {
      setLoading(true);
      
      // Get all sessions
      const sessionsSnapshot = await getExerciseSessions(user.uid);
      const sessionsData = sessionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by timestamp
      sessionsData.sort((a, b) => {
        if (b.timestamp && a.timestamp) {
          return b.timestamp.seconds - a.timestamp.seconds;
        }
        return 0;
      });
      
      setSessions(sessionsData);
      
      // Get statistics
      const userStats = await getExerciseStats(user.uid);
      setStats(userStats);
      
    } catch (error) {
      console.error('Error loading progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  }

  const getFilteredSessions = () => {
    let filtered = [...sessions];

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(session => {
        if (!session.timestamp) return false;
        const sessionDate = session.timestamp.toDate ? session.timestamp.toDate() : new Date(session.timestamp);
        
        if (timeFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return sessionDate >= weekAgo;
        } else if (timeFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return sessionDate >= monthAgo;
        }
        return true;
      });
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(session => session.category === categoryFilter);
    }

    return filtered;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const getScoreColor = (score) => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const calculateTrends = () => {
    if (sessions.length < 2) return null;

    const recentSessions = sessions.slice(0, 5);
    const olderSessions = sessions.slice(5, 10);
    
    if (olderSessions.length === 0) return null;

    const recentAvg = recentSessions.reduce((sum, s) => sum + (s.score || 0), 0) / recentSessions.length;
    const olderAvg = olderSessions.reduce((sum, s) => sum + (s.score || 0), 0) / olderSessions.length;
    
    const trend = recentAvg - olderAvg;
    
    return {
      direction: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable',
      value: Math.abs(Math.round(trend)),
      recentAvg: Math.round(recentAvg),
      olderAvg: Math.round(olderAvg)
    };
  };

  const filteredSessions = getFilteredSessions();
  const trends = calculateTrends();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your progress...</p>
      </div>
    );
  }

  return (
    <div className={styles.progressContainer}>
      {/* Header */}
      <div className={styles.progressHeader}>
        <button onClick={() => navigate('/profile/neurobic')} className={styles.backButton}>
          ← Back to Exercises
        </button>
        <h2>Your Progress & Statistics</h2>
        <p className={styles.subtitle}>Track your cognitive development journey</p>
      </div>

      {sessions.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h3>No exercise history yet</h3>
          <p>Complete some exercises to see your progress here!</p>
          <button
            onClick={() => navigate('/profile/neurobic')}
            className={styles.primaryButton}
          >
            Start Exercising
          </button>
        </div>
      ) : (
        <>
          {/* Overall Statistics */}
          <section className={styles.statsSection}>
            <h3>Overall Statistics</h3>
            <div className={styles.statsGrid}>
              <div className={styles.largeStat}>
                <div className={styles.statIcon}>🏆</div>
                <div className={styles.statValue}>{stats.totalSessions}</div>
                <div className={styles.statLabel}>Total Exercises</div>
              </div>
              
              <div className={styles.largeStat}>
                <div className={styles.statIcon}>⭐</div>
                <div className={styles.statValue}>{stats.avgScore}</div>
                <div className={styles.statLabel}>Average Score</div>
              </div>
              
              <div className={styles.largeStat}>
                <div className={styles.statIcon}>🎯</div>
                <div className={styles.statValue}>
                  {Object.keys(stats.categoryStats).length}/5
                </div>
                <div className={styles.statLabel}>Categories Mastered</div>
              </div>

              {trends && (
                <div className={styles.largeStat}>
                  <div className={styles.statIcon}>
                    {trends.direction === 'up' ? '📈' : trends.direction === 'down' ? '📉' : '➡️'}
                  </div>
                  <div className={styles.statValue}>
                    {trends.direction === 'up' && '+'}
                    {trends.value}
                  </div>
                  <div className={styles.statLabel}>Recent Trend</div>
                </div>
              )}
            </div>
          </section>

          {/* Category Breakdown */}
          {stats.categoryStats && Object.keys(stats.categoryStats).length > 0 && (
            <section className={styles.categorySection}>
              <h3>Performance by Category</h3>
              <div className={styles.categoryGrid}>
                {Object.entries(stats.categoryStats).map(([category, data]) => (
                  <div key={category} className={styles.categoryCard}>
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryIconLarge}>
                        {getCategoryIcon(category)}
                      </span>
                      <h4>{category.replace('_', ' ').toUpperCase()}</h4>
                    </div>
                    
                    <div className={styles.categoryStats}>
                      <div className={styles.categoryStat}>
                        <span className={styles.categoryStatValue}>
                          {Math.round(data.avgScore)}
                        </span>
                        <span className={styles.categoryStatLabel}>Avg Score</span>
                      </div>
                      <div className={styles.categoryStat}>
                        <span className={styles.categoryStatValue}>{data.count}</span>
                        <span className={styles.categoryStatLabel}>Completed</span>
                      </div>
                    </div>

                    <div className={styles.categoryProgress}>
                      <div
                        className={styles.categoryProgressBar}
                        style={{
                          width: `${data.avgScore}%`,
                          backgroundColor: getScoreColor(data.avgScore)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Filters */}
          <section className={styles.historySection}>
            <div className={styles.sectionHeader}>
              <h3>Exercise History</h3>
              <div className={styles.filterControls}>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Time</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Categories</option>
                  {Object.values(EXERCISE_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>
                      {cat.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sessions List */}
            {filteredSessions.length > 0 ? (
              <div className={styles.sessionsList}>
                {filteredSessions.map((session) => (
                  <div key={session.id} className={styles.sessionItem}>
                    <div className={styles.sessionIcon}>
                      {getCategoryIcon(session.category)}
                    </div>
                    
                    <div className={styles.sessionContent}>
                      <h4>{session.exerciseTitle}</h4>
                      <p className={styles.sessionMeta}>
                        {formatDate(session.timestamp)} • {session.difficulty}
                      </p>
                    </div>

                    <div className={styles.sessionStats}>
                      <div
                        className={styles.sessionScore}
                        style={{ color: getScoreColor(session.score) }}
                      >
                        {session.score}
                        <span className={styles.scoreLabel}>/100</span>
                      </div>
                      
                      {session.timeElapsed && (
                        <div className={styles.sessionTime}>
                          ⏱️ {formatDuration(session.timeElapsed)}
                        </div>
                      )}
                      
                      {session.performance && (
                        <div className={styles.sessionAccuracy}>
                          ✓ {Math.round((session.performance.correct / session.performance.total) * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyFiltered}>
                <p>No sessions match your filters</p>
              </div>
            )}
          </section>

          {/* Achievements */}
          <section className={styles.achievementsSection}>
            <h3>🏅 Achievements</h3>
            <div className={styles.achievementsGrid}>
              {stats.totalSessions >= 5 && (
                <div className={styles.achievement}>
                  <div className={styles.achievementIcon}>🌟</div>
                  <h4>Getting Started</h4>
                  <p>Completed 5 exercises</p>
                </div>
              )}
              
              {stats.totalSessions >= 25 && (
                <div className={styles.achievement}>
                  <div className={styles.achievementIcon}>⭐</div>
                  <h4>Dedicated Learner</h4>
                  <p>Completed 25 exercises</p>
                </div>
              )}
              
              {stats.totalSessions >= 50 && (
                <div className={styles.achievement}>
                  <div className={styles.achievementIcon}>💫</div>
                  <h4>Master Mind</h4>
                  <p>Completed 50 exercises</p>
                </div>
              )}
              
              {stats.avgScore >= 80 && (
                <div className={styles.achievement}>
                  <div className={styles.achievementIcon}>🎯</div>
                  <h4>High Performer</h4>
                  <p>Average score above 80</p>
                </div>
              )}
              
              {Object.keys(stats.categoryStats).length >= 3 && (
                <div className={styles.achievement}>
                  <div className={styles.achievementIcon}>🌈</div>
                  <h4>Well Rounded</h4>
                  <p>Tried 3+ categories</p>
                </div>
              )}
              
              {Object.keys(stats.categoryStats).length >= 5 && (
                <div className={styles.achievement}>
                  <div className={styles.achievementIcon}>🏆</div>
                  <h4>Complete Explorer</h4>
                  <p>Tried all categories</p>
                </div>
              )}
            </div>
          </section>

          {/* Insights */}
          {trends && (
            <section className={styles.insightsSection}>
              <h3>💡 Insights & Recommendations</h3>
              <div className={styles.insightsList}>
                <div className={styles.insightCard}>
                  {trends.direction === 'up' ? (
                    <>
                      <span className={styles.insightIcon}>🎉</span>
                      <div>
                        <h4>You're improving!</h4>
                        <p>
                          Your recent average score ({trends.recentAvg}) is {trends.value} points higher 
                          than before. Keep up the excellent work!
                        </p>
                      </div>
                    </>
                  ) : trends.direction === 'down' ? (
                    <>
                      <span className={styles.insightIcon}>📚</span>
                      <div>
                        <h4>Room for growth</h4>
                        <p>
                          Your recent scores are slightly lower. Try revisiting easier exercises 
                          to rebuild confidence, then challenge yourself with harder ones.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className={styles.insightIcon}>➡️</span>
                      <div>
                        <h4>Steady progress</h4>
                        <p>
                          You're maintaining consistent performance. Consider trying more challenging 
                          exercises to push your limits!
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {Object.keys(stats.categoryStats).length < 5 && (
                  <div className={styles.insightCard}>
                    <span className={styles.insightIcon}>🎨</span>
                    <div>
                      <h4>Explore new categories</h4>
                      <p>
                        You've tried {Object.keys(stats.categoryStats).length} out of 5 categories. 
                        Exploring different types of exercises provides balanced cognitive development.
                      </p>
                    </div>
                  </div>
                )}

                {stats.totalSessions >= 10 && stats.totalSessions < 25 && (
                  <div className={styles.insightCard}>
                    <span className={styles.insightIcon}>🔥</span>
                    <div>
                      <h4>Building momentum</h4>
                      <p>
                        You're making great progress! Try to exercise daily for even better results. 
                        Consistency is key to cognitive improvement.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default NeurobicProgress;

