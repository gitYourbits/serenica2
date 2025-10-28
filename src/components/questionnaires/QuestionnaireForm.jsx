import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/appContext';
import {
  QUESTIONNAIRES,
  scorePHQ9,
  scoreGAD7,
  scoreDASS21,
  scoreThoughtRecord,
  getChatbotRecommendation
} from '../../services/questionnaireService';
import styles from '../../assets/styles/questionnaires.module.css';
import { toast } from 'react-toastify';

function QuestionnaireForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, saveQuestionnaireResponse } = useApp();
  
  const [questionnaire, setQuestionnaire] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const foundQuestionnaire = QUESTIONNAIRES.find(q => q.id === id);
    if (foundQuestionnaire) {
      setQuestionnaire(foundQuestionnaire);
    } else {
      toast.error('Questionnaire not found');
      navigate('/profile/questionnaires');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (questionnaire) {
      const progressPercentage = (Object.keys(responses).length / questionnaire.questions.length) * 100;
      setProgress(progressPercentage);
    }
  }, [responses, questionnaire]);

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultiSelect = (questionId, optionValue) => {
    const current = responses[questionId] || [];
    const newValue = current.includes(optionValue)
      ? current.filter(v => v !== optionValue)
      : [...current, optionValue];
    
    handleResponse(questionId, newValue);
  };

  const goToNext = () => {
    if (currentQuestionIndex < questionnaire.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questionnaire.questions[currentQuestionIndex];
    const response = responses[currentQuestion.id];
    
    if (currentQuestion.type === 'multiselect') {
      return response && response.length > 0;
    }
    
    return response !== undefined && response !== '' && response !== null;
  };

  const areAllQuestionsAnswered = () => {
    return questionnaire.questions.every(q => {
      const response = responses[q.id];
      if (q.type === 'multiselect') {
        return response && response.length > 0;
      }
      return response !== undefined && response !== '' && response !== null;
    });
  };

  const handleSubmit = async () => {
    if (!areAllQuestionsAnswered()) {
      toast.warning('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate score based on questionnaire type
      let score;
      switch (questionnaire.id) {
        case 'phq9':
          score = scorePHQ9(responses);
          break;
        case 'gad7':
          score = scoreGAD7(responses);
          break;
        case 'dass21':
          score = scoreDASS21(responses);
          break;
        case 'thought_record':
          score = scoreThoughtRecord(responses);
          break;
        default:
          score = { message: 'Questionnaire completed' };
      }

      // Get chatbot recommendation
      const recommendation = getChatbotRecommendation(questionnaire.id, score);

      // Save to Firestore
      const responseData = {
        questionnaireId: questionnaire.id,
        questionnaireTitle: questionnaire.title,
        responses,
        score,
        recommendation
      };

      const docRef = await saveQuestionnaireResponse(user.uid, responseData);
      
      toast.success('Assessment completed successfully!');
      
      // Navigate to results page
      navigate(`/profile/questionnaires/results/${docRef.id}`);
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      toast.error('Failed to save your responses. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!questionnaire) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading questionnaire...</p>
      </div>
    );
  }

  const currentQuestion = questionnaire.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionnaire.questions.length - 1;

  return (
    <div className={styles.questionnaireFormContainer}>
      {/* Header */}
      <div className={styles.formHeader}>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
              navigate('/profile/questionnaires');
            }
          }}
          className={styles.exitButton}
        >
          ✕ Exit
        </button>
        <h2>{questionnaire.title}</h2>
        <p className={styles.questionCount}>
          Question {currentQuestionIndex + 1} of {questionnaire.questions.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className={styles.questionContainer}>
        <h3 className={styles.questionText}>{currentQuestion.text}</h3>

        {/* Render based on question type */}
        <div className={styles.optionsContainer}>
          {currentQuestion.type === 'scale' && (
            <div className={styles.scaleOptions}>
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  className={`${styles.optionButton} ${
                    responses[currentQuestion.id] === option.value ? styles.selected : ''
                  }`}
                  onClick={() => handleResponse(currentQuestion.id, option.value)}
                >
                  <span className={styles.optionValue}>{option.value}</span>
                  <span className={styles.optionLabel}>{option.label}</span>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'textarea' && (
            <textarea
              className={styles.textarea}
              placeholder={currentQuestion.placeholder}
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
              rows={6}
            />
          )}

          {currentQuestion.type === 'multiselect' && (
            <div className={styles.multiselectOptions}>
              {currentQuestion.options.map((option) => {
                const isSelected = (responses[currentQuestion.id] || []).includes(option.value);
                return (
                  <button
                    key={option.value}
                    className={`${styles.multiselectButton} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handleMultiSelect(currentQuestion.id, option.value)}
                  >
                    <span className={styles.checkbox}>
                      {isSelected ? '✓' : ''}
                    </span>
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'slider' && (
            <div className={styles.sliderContainer}>
              <input
                type="range"
                className={styles.slider}
                min={currentQuestion.min}
                max={currentQuestion.max}
                step={currentQuestion.step}
                value={responses[currentQuestion.id] || currentQuestion.min}
                onChange={(e) => handleResponse(currentQuestion.id, parseInt(e.target.value))}
              />
              <div className={styles.sliderValue}>
                {responses[currentQuestion.id] || currentQuestion.min} / {currentQuestion.max}
              </div>
              <div className={styles.sliderLabels}>
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigationButtons}>
        <button
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
          className={styles.navButton}
        >
          ← Previous
        </button>

        {!isLastQuestion ? (
          <button
            onClick={goToNext}
            disabled={!isCurrentQuestionAnswered()}
            className={`${styles.navButton} ${styles.primaryButton}`}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!areAllQuestionsAnswered() || isSubmitting}
            className={`${styles.navButton} ${styles.submitButton}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        )}
      </div>

      {/* Helper text */}
      {currentQuestion.type === 'scale' && (
        <p className={styles.helperText}>
          Over the last 2 weeks, how often have you been bothered by this?
        </p>
      )}
      
      {currentQuestion.type === 'multiselect' && (
        <p className={styles.helperText}>
          Select all that apply
        </p>
      )}
    </div>
  );
}

export default QuestionnaireForm;

