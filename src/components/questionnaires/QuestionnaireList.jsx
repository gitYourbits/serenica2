import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/appContext';
import { QUESTIONNAIRES } from '../../services/questionnaireService';
import styles from '../../assets/styles/questionnaires.module.css';
import { toast } from 'react-toastify';

function QuestionnaireList() {
  const { user, getQuestionnaireResponses } = useApp();
  const [recentResponses, setRecentResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentResponses();
  }, []);

  async function fetchRecentResponses() {
    try {
      setLoading(true);
      const responses = await getQuestionnaireResponses(user.uid);
      const data = responses.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      // Sort by timestamp, most recent first
      data.sort((a, b) => {
        if (b.timestamp && a.timestamp) {
          return b.timestamp.seconds - a.timestamp.seconds;
        }
        return 0;
      });
      
      setRecentResponses(data.slice(0, 5)); // Show last 5 responses
    } catch (error) {
      console.error('Error fetching questionnaire responses:', error);
      toast.error('Failed to load questionnaire history');
    } finally {
      setLoading(false);
    }
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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'depression':
        return '#6B7FD7';
      case 'anxiety':
        return '#F59E0B';
      case 'comprehensive':
        return '#10B981';
      case 'cbt':
        return '#8B5CF6';
      default:
        return '#6366F1';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={styles.questionnaireListContainer}>
      <div className={styles.headerSection}>
        <h2>Mental Health Assessments</h2>
        <p className={styles.subtitle}>
          Evidence-based questionnaires to help you understand your mental health. 
          All responses are private and secure.
        </p>
      </div>

      {/* Available Questionnaires */}
      <section className={styles.section}>
        <h3>Available Assessments</h3>
        <div className={styles.questionnaireGrid}>
          {QUESTIONNAIRES.map((questionnaire) => (
            <div
              key={questionnaire.id}
              className={styles.questionnaireCard}
              style={{ borderLeftColor: getCategoryColor(questionnaire.category) }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.categoryIcon}>
                  {getCategoryIcon(questionnaire.category)}
                </span>
                <span className={styles.duration}>⏱️ {questionnaire.duration}</span>
              </div>
              
              <h4>{questionnaire.title}</h4>
              <p className={styles.description}>{questionnaire.description}</p>
              
              <div className={styles.questionCount}>
                {questionnaire.questions.length} questions
              </div>
              
              <Link
                to={`/profile/questionnaires/${questionnaire.id}`}
                className={styles.startButton}
              >
                Start Assessment
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Responses */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Recent Assessments</h3>
          <Link to="/profile/questionnaires/history" className={styles.viewAllLink}>
            View All History →
          </Link>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading your history...</p>
          </div>
        ) : recentResponses.length > 0 ? (
          <div className={styles.recentList}>
            {recentResponses.map((response) => {
              const questionnaire = QUESTIONNAIRES.find(q => q.id === response.questionnaireId);
              return (
                <Link
                  key={response.id}
                  to={`/profile/questionnaires/results/${response.id}`}
                  className={styles.recentItem}
                >
                  <div className={styles.recentIcon}>
                    {questionnaire ? getCategoryIcon(questionnaire.category) : '📝'}
                  </div>
                  <div className={styles.recentContent}>
                    <h5>{questionnaire?.title || 'Assessment'}</h5>
                    <p className={styles.recentDate}>{formatDate(response.timestamp)}</p>
                  </div>
                  <div className={styles.recentArrow}>→</div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h4>No assessments yet</h4>
            <p>Start your first mental health assessment above to track your wellbeing</p>
          </div>
        )}
      </section>

      {/* Information Section */}
      <section className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h4>🔒 Your Privacy Matters</h4>
          <p>
            All your responses are encrypted and stored securely. Only you can access your 
            assessment results. We never share your data without your explicit consent.
          </p>
        </div>

        <div className={styles.infoCard}>
          <h4>💡 How to Use These Assessments</h4>
          <ul>
            <li>Find a quiet space where you can focus</li>
            <li>Answer honestly - there are no right or wrong answers</li>
            <li>Take breaks if needed</li>
            <li>Review your results and recommendations</li>
            <li>Retake assessments periodically to track progress</li>
          </ul>
        </div>

        <div className={styles.infoCard}>
          <h4>⚕️ Important Notice</h4>
          <p>
            These assessments are screening tools, not diagnostic instruments. If you're 
            experiencing severe symptoms or crisis, please seek immediate professional help 
            or contact emergency services.
          </p>
          <div className={styles.crisisInfo}>
            <strong>Crisis Support:</strong>
            <br />
            National Suicide Prevention Lifeline: 988
            <br />
            Crisis Text Line: Text HOME to 741741
          </div>
        </div>
      </section>
    </div>
  );
}

export default QuestionnaireList;

