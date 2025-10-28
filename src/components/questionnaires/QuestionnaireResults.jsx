import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/appContext';
import styles from '../../assets/styles/questionnaires.module.css';
import { toast } from 'react-toastify';

function QuestionnaireResults() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { user, getQuestionnaireResponse, deleteQuestionnaireResponse } = useApp();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  async function fetchResult() {
    try {
      setLoading(true);
      const response = await getQuestionnaireResponse(user.uid, resultId);
      if (response.exists()) {
        setResult({ id: response.id, ...response.data() });
      } else {
        toast.error('Result not found');
        navigate('/profile/questionnaires');
      }
    } catch (error) {
      console.error('Error fetching result:', error);
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteQuestionnaireResponse(user.uid, resultId);
      toast.success('Assessment deleted successfully');
      navigate('/profile/questionnaires/history');
    } catch (error) {
      console.error('Error deleting result:', error);
      toast.error('Failed to delete assessment');
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    if (!severity) return '#6366F1';
    
    const severityLower = severity.toLowerCase();
    if (severityLower.includes('minimal') || severityLower.includes('normal')) {
      return '#10B981'; // Green
    } else if (severityLower.includes('mild')) {
      return '#F59E0B'; // Yellow
    } else if (severityLower.includes('moderate')) {
      return '#F97316'; // Orange
    } else if (severityLower.includes('severe')) {
      return '#EF4444'; // Red
    }
    return '#6366F1'; // Default blue
  };

  const getChatbotRoute = (chatbotType) => {
    switch (chatbotType) {
      case 'cbt':
        return '/cbtchat';
      case 'mindfulness':
        return '/mindchat';
      case 'career':
        return '/careerchat';
      default:
        return '/cbtchat';
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading results...</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const { score, questionnaireTitle, timestamp, recommendation } = result;

  return (
    <div className={styles.resultsContainer}>
      {/* Header */}
      <div className={styles.resultsHeader}>
        <button onClick={() => navigate('/profile/questionnaires')} className={styles.backButton}>
          ← Back to Assessments
        </button>
        <h2>{questionnaireTitle}</h2>
        <p className={styles.resultDate}>Completed on {formatDate(timestamp)}</p>
      </div>

      {/* Main Results */}
      <div className={styles.resultsContent}>
        {/* PHQ-9 Results */}
        {score.totalScore !== undefined && score.severity && (
          <div className={styles.scoreCard}>
            <div className={styles.scoreHeader}>
              <h3>Your Score</h3>
              <div
                className={styles.scoreBadge}
                style={{ backgroundColor: getSeverityColor(score.severity) }}
              >
                {score.totalScore} / {result.questionnaireId === 'phq9' ? 27 : 21}
              </div>
            </div>
            
            <div className={styles.severityLevel} style={{ borderLeftColor: getSeverityColor(score.severity) }}>
              <span className={styles.severityLabel}>Severity:</span>
              <span className={styles.severityValue}>{score.severity}</span>
            </div>

            <div className={styles.interpretation}>
              <h4>What This Means</h4>
              <p>{score.interpretation}</p>
            </div>

            {score.crisisFlag && (
              <div className={styles.crisisAlert}>
                <span className={styles.crisisIcon}>⚠️</span>
                <div>
                  <h4>Immediate Support Available</h4>
                  <p>
                    If you're experiencing thoughts of self-harm, please reach out for help immediately:
                  </p>
                  <ul>
                    <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                    <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                    <li><strong>Emergency Services:</strong> 911</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DASS-21 Results */}
        {score.depressionScore !== undefined && (
          <div className={styles.scoreCard}>
            <h3>Your Scores</h3>
            
            <div className={styles.subscaleResults}>
              <div className={styles.subscaleItem}>
                <div className={styles.subscaleHeader}>
                  <span className={styles.subscaleName}>Depression</span>
                  <span
                    className={styles.subscaleScore}
                    style={{ backgroundColor: getSeverityColor(score.depressionSeverity) }}
                  >
                    {score.depressionScore}
                  </span>
                </div>
                <div className={styles.subscaleSeverity}>{score.depressionSeverity}</div>
              </div>

              <div className={styles.subscaleItem}>
                <div className={styles.subscaleHeader}>
                  <span className={styles.subscaleName}>Anxiety</span>
                  <span
                    className={styles.subscaleScore}
                    style={{ backgroundColor: getSeverityColor(score.anxietySeverity) }}
                  >
                    {score.anxietyScore}
                  </span>
                </div>
                <div className={styles.subscaleSeverity}>{score.anxietySeverity}</div>
              </div>

              <div className={styles.subscaleItem}>
                <div className={styles.subscaleHeader}>
                  <span className={styles.subscaleName}>Stress</span>
                  <span
                    className={styles.subscaleScore}
                    style={{ backgroundColor: getSeverityColor(score.stressSeverity) }}
                  >
                    {score.stressScore}
                  </span>
                </div>
                <div className={styles.subscaleSeverity}>{score.stressSeverity}</div>
              </div>
            </div>
          </div>
        )}

        {/* Thought Record Results */}
        {score.improvementPercentage !== undefined && (
          <div className={styles.scoreCard}>
            <h3>Thought Record Summary</h3>
            
            <div className={styles.thoughtRecordSummary}>
              <div className={styles.intensityComparison}>
                <div className={styles.intensityItem}>
                  <span className={styles.intensityLabel}>Initial Intensity</span>
                  <div className={styles.intensityBar}>
                    <div
                      className={styles.intensityFill}
                      style={{ width: `${score.initialIntensity}%`, backgroundColor: '#EF4444' }}
                    />
                  </div>
                  <span className={styles.intensityValue}>{score.initialIntensity}%</span>
                </div>

                <div className={styles.intensityItem}>
                  <span className={styles.intensityLabel}>Final Intensity</span>
                  <div className={styles.intensityBar}>
                    <div
                      className={styles.intensityFill}
                      style={{ width: `${score.finalIntensity}%`, backgroundColor: '#10B981' }}
                    />
                  </div>
                  <span className={styles.intensityValue}>{score.finalIntensity}%</span>
                </div>
              </div>

              <div className={styles.improvement}>
                <h4>
                  {score.improvement > 0 ? '📈' : '📊'} 
                  {score.improvementPercentage}% {score.improvement > 0 ? 'Improvement' : 'Change'}
                </h4>
                <p>{score.interpretation}</p>
              </div>

              {score.emotions && score.emotions.length > 0 && (
                <div className={styles.emotionsList}>
                  <h5>Emotions Identified:</h5>
                  <div className={styles.emotionTags}>
                    {score.emotions.map((emotion) => (
                      <span key={emotion} className={styles.emotionTag}>
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {score.cognitiveDistortions && score.cognitiveDistortions.length > 0 && (
                <div className={styles.distortionsList}>
                  <h5>Cognitive Patterns Identified:</h5>
                  <ul>
                    {score.cognitiveDistortions.map((distortion) => (
                      <li key={distortion}>
                        {distortion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {score.recommendations && score.recommendations.length > 0 && (
          <div className={styles.recommendationsCard}>
            <h3>💡 Personalized Recommendations</h3>
            <ul className={styles.recommendationsList}>
              {score.recommendations.map((rec, index) => (
                <li key={index} className={rec.includes('⚠️') ? styles.urgentRecommendation : ''}>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chatbot Recommendation */}
        {recommendation && recommendation.chatbot && (
          <div className={styles.chatbotRecommendation}>
            <h3>🤖 Suggested Support</h3>
            <p>{recommendation.message}</p>
            <Link
              to={getChatbotRoute(recommendation.chatbot)}
              className={styles.chatbotButton}
            >
              Talk to AI Therapist
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className={styles.resultActions}>
          <Link to="/profile/questionnaires" className={styles.actionButton}>
            Take Another Assessment
          </Link>
          <Link to="/profile/questionnaires/history" className={styles.actionButton}>
            View History
          </Link>
          <Link to="/booking" className={styles.actionButton}>
            Book Appointment
          </Link>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`${styles.actionButton} ${styles.deleteButton}`}
          >
            Delete This Result
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Delete Assessment?</h3>
            <p>Are you sure you want to delete this assessment? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.modalButton}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`${styles.modalButton} ${styles.modalDeleteButton}`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionnaireResults;

