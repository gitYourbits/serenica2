import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/appContext';
import { QUESTIONNAIRES } from '../../services/questionnaireService';
import styles from '../../assets/styles/questionnaires.module.css';
import { toast } from 'react-toastify';

function QuestionnaireHistory() {
  const navigate = useNavigate();
  const { user, getQuestionnaireResponses } = useApp();
  
  const [allResponses, setAllResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchAllResponses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allResponses, filterCategory, sortBy]);

  async function fetchAllResponses() {
    try {
      setLoading(true);
      const responses = await getQuestionnaireResponses(user.uid);
      const data = responses.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllResponses(data);
    } catch (error) {
      console.error('Error fetching questionnaire responses:', error);
      toast.error('Failed to load questionnaire history');
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...allResponses];

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(response => {
        const questionnaire = QUESTIONNAIRES.find(q => q.id === response.questionnaireId);
        return questionnaire?.category === filterCategory;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        if (b.timestamp && a.timestamp) {
          return b.timestamp.seconds - a.timestamp.seconds;
        }
        return 0;
      } else if (sortBy === 'oldest') {
        if (a.timestamp && b.timestamp) {
          return a.timestamp.seconds - b.timestamp.seconds;
        }
        return 0;
      } else if (sortBy === 'score') {
        const scoreA = a.score?.totalScore || a.score?.depressionScore || 0;
        const scoreB = b.score?.totalScore || b.score?.depressionScore || 0;
        return scoreB - scoreA;
      }
      return 0;
    });

    setFilteredResponses(filtered);
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'depression':
        return '😔';
      case 'anxiety':
        return '😰';
      case 'comprehensive':
        return '📊';
      case 'cbt':
        return '🧠';
      default:
        return '📝';
    }
  };

  const getSeverityColor = (severity) => {
    if (!severity) return '#6366F1';
    
    const severityLower = severity.toLowerCase();
    if (severityLower.includes('minimal') || severityLower.includes('normal')) {
      return '#10B981';
    } else if (severityLower.includes('mild')) {
      return '#F59E0B';
    } else if (severityLower.includes('moderate')) {
      return '#F97316';
    } else if (severityLower.includes('severe')) {
      return '#EF4444';
    }
    return '#6366F1';
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

  const getScoreSummary = (response) => {
    const { score } = response;
    
    if (score.totalScore !== undefined) {
      return {
        label: 'Score',
        value: score.totalScore,
        severity: score.severity
      };
    } else if (score.depressionScore !== undefined) {
      return {
        label: 'D/A/S',
        value: `${score.depressionScore}/${score.anxietyScore}/${score.stressScore}`,
        severity: score.depressionSeverity
      };
    } else if (score.improvementPercentage !== undefined) {
      return {
        label: 'Improvement',
        value: `${score.improvementPercentage}%`,
        severity: score.improvement > 0 ? 'Positive' : 'Neutral'
      };
    }
    
    return {
      label: 'Completed',
      value: '✓',
      severity: 'Normal'
    };
  };

  // Calculate statistics
  const stats = {
    total: allResponses.length,
    thisWeek: allResponses.filter(r => {
      if (!r.timestamp) return false;
      const date = r.timestamp.toDate ? r.timestamp.toDate() : new Date(r.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length,
    thisMonth: allResponses.filter(r => {
      if (!r.timestamp) return false;
      const date = r.timestamp.toDate ? r.timestamp.toDate() : new Date(r.timestamp);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return date >= monthAgo;
    }).length
  };

  return (
    <div className={styles.historyContainer}>
      {/* Header */}
      <div className={styles.historyHeader}>
        <button onClick={() => navigate('/profile/questionnaires')} className={styles.backButton}>
          ← Back to Assessments
        </button>
        <h2>Assessment History</h2>
        <p className={styles.subtitle}>Track your mental health journey over time</p>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your history...</p>
        </div>
      ) : (
        <>
          {/* Statistics */}
          {allResponses.length > 0 && (
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats.total}</div>
                <div className={styles.statLabel}>Total Assessments</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats.thisWeek}</div>
                <div className={styles.statLabel}>This Week</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats.thisMonth}</div>
                <div className={styles.statLabel}>This Month</div>
              </div>
            </div>
          )}

          {allResponses.length > 0 ? (
            <>
              {/* Filters and Sort */}
              <div className={styles.controlsBar}>
                <div className={styles.filterGroup}>
                  <label>Filter by type:</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Types</option>
                    <option value="depression">Depression</option>
                    <option value="anxiety">Anxiety</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="cbt">CBT Thought Records</option>
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                    <option value="score">Highest Score</option>
                  </select>
                </div>
              </div>

              {/* Results List */}
              <div className={styles.historyList}>
                {filteredResponses.length > 0 ? (
                  filteredResponses.map((response) => {
                    const questionnaire = QUESTIONNAIRES.find(q => q.id === response.questionnaireId);
                    const scoreSummary = getScoreSummary(response);
                    
                    return (
                      <Link
                        key={response.id}
                        to={`/profile/questionnaires/results/${response.id}`}
                        className={styles.historyItem}
                      >
                        <div className={styles.historyIcon}>
                          {getCategoryIcon(questionnaire?.category)}
                        </div>
                        
                        <div className={styles.historyContent}>
                          <h4>{response.questionnaireTitle}</h4>
                          <p className={styles.historyDate}>{formatDate(response.timestamp)}</p>
                        </div>
                        
                        <div className={styles.historyScore}>
                          <div className={styles.scoreLabel}>{scoreSummary.label}</div>
                          <div
                            className={styles.scoreValue}
                            style={{ color: getSeverityColor(scoreSummary.severity) }}
                          >
                            {scoreSummary.value}
                          </div>
                          {scoreSummary.severity && (
                            <div
                              className={styles.severityBadge}
                              style={{ backgroundColor: getSeverityColor(scoreSummary.severity) }}
                            >
                              {scoreSummary.severity}
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.historyArrow}>→</div>
                      </Link>
                    );
                  })
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <h4>No assessments match your filters</h4>
                    <p>Try adjusting your filter settings</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <h3>No assessment history yet</h3>
              <p>Your completed assessments will appear here</p>
              <Link to="/profile/questionnaires" className={styles.emptyButton}>
                Take Your First Assessment
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default QuestionnaireHistory;

