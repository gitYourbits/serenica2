import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/appContext';
import {
  NEUROBIC_EXERCISES,
  generateNumberSequence,
  generateMemoryPairs,
  generateStroopItem,
  PATTERN_PUZZLES,
  LOGIC_RIDDLES,
  ALTERNATIVE_USES_OBJECTS,
  generateStoryPrompts,
  calculateExerciseScore
} from '../../services/neurobicService';
import styles from '../../assets/styles/neurobic.module.css';
import { toast } from 'react-toastify';

function ExerciseSession() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { user, saveExerciseSession } = useApp();
  
  const [exercise, setExercise] = useState(null);
  const [phase, setPhase] = useState('instructions'); // instructions, active, complete
  const [performance, setPerformance] = useState({ correct: 0, total: 0, moves: 0 });
  const [currentData, setCurrentData] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Timer
  useEffect(() => {
    let interval;
    if (isActive && phase === 'active') {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  useEffect(() => {
    const foundExercise = NEUROBIC_EXERCISES.find(ex => ex.id === exerciseId);
    if (foundExercise) {
      setExercise(foundExercise);
    } else {
      toast.error('Exercise not found');
      navigate('/profile/neurobic');
    }
  }, [exerciseId, navigate]);

  const startExercise = () => {
    setPhase('active');
    setIsActive(true);
    initializeExercise();
  };

  const initializeExercise = () => {
    switch (exerciseId) {
      case 'memory_sequence':
        startMemorySequence();
        break;
      case 'memory_pairs':
        startMemoryPairs();
        break;
      case 'stroop_test':
        startStroopTest();
        break;
      case 'pattern_completion':
        startPatternCompletion();
        break;
      case 'riddle_solver':
        startRiddleSolver();
        break;
      case 'alternative_uses':
        startAlternativeUses();
        break;
      case 'story_builder':
        startStoryBuilder();
        break;
      default:
        setFeedback('This exercise is coming soon!');
    }
  };

  // Memory Sequence
  const startMemorySequence = () => {
    const sequence = generateNumberSequence(4);
    setCurrentData({ sequence, showSequence: true, round: 1, maxRounds: 5 });
    
    setTimeout(() => {
      setCurrentData(prev => ({ ...prev, showSequence: false }));
    }, 3000);
  };

  const checkMemorySequence = (input) => {
    const isCorrect = input === currentData.sequence.join('');
    setPerformance(prev => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
    
    setFeedback(isCorrect ? '✅ Correct!' : '❌ Incorrect');
    
    setTimeout(() => {
      if (currentData.round < currentData.maxRounds) {
        const newLength = 4 + currentData.round;
        const sequence = generateNumberSequence(newLength);
        setCurrentData({ sequence, showSequence: true, round: currentData.round + 1, maxRounds: 5 });
        setUserInput('');
        setFeedback('');
        
        setTimeout(() => {
          setCurrentData(prev => ({ ...prev, showSequence: false }));
        }, 3000);
      } else {
        completeExercise();
      }
    }, 1500);
  };

  // Memory Pairs
  const startMemoryPairs = () => {
    const cards = generateMemoryPairs(8);
    setCurrentData({ cards, flipped: [], matched: [], moves: 0 });
  };

  const handleCardClick = (index) => {
    if (currentData.flipped.length === 2 || currentData.flipped.includes(index) || currentData.matched.includes(index)) {
      return;
    }

    const newFlipped = [...currentData.flipped, index];
    const newCards = [...currentData.cards];
    newCards[index].isFlipped = true;
    
    setCurrentData({ ...currentData, flipped: newFlipped, cards: newCards });

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const isMatch = currentData.cards[first].symbol === currentData.cards[second].symbol;
      
      setTimeout(() => {
        if (isMatch) {
          const newMatched = [...currentData.matched, first, second];
          setCurrentData(prev => ({
            ...prev,
            matched: newMatched,
            flipped: [],
            moves: prev.moves + 1
          }));
          
          if (newMatched.length === currentData.cards.length) {
            setPerformance({ correct: currentData.cards.length / 2, total: currentData.cards.length / 2, moves: currentData.moves + 1 });
            setTimeout(completeExercise, 1000);
          }
        } else {
          const resetCards = [...currentData.cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCurrentData(prev => ({
            ...prev,
            cards: resetCards,
            flipped: [],
            moves: prev.moves + 1
          }));
        }
      }, 1000);
    }
  };

  // Stroop Test
  const startStroopTest = () => {
    const item = generateStroopItem();
    setCurrentData({ ...item, round: 1, maxRounds: 20, times: [] });
    setPerformance({ correct: 0, total: 0, avgTime: 0 });
  };

  const handleStroopAnswer = (answer) => {
    const startTime = currentData.startTime || Date.now();
    const timeTaken = Date.now() - startTime;
    const isCorrect = answer === currentData.color;
    
    setPerformance(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
      avgTime: prev.avgTime + timeTaken
    }));

    if (currentData.round < currentData.maxRounds) {
      const item = generateStroopItem();
      setCurrentData({
        ...item,
        round: currentData.round + 1,
        maxRounds: 20,
        startTime: Date.now()
      });
    } else {
      completeExercise();
    }
  };

  // Pattern Completion
  const startPatternCompletion = () => {
    setCurrentData({
      puzzles: [...PATTERN_PUZZLES],
      currentIndex: 0,
      showHint: false
    });
  };

  const checkPatternAnswer = (answer) => {
    const isCorrect = answer === currentData.puzzles[currentData.currentIndex].answer;
    setPerformance(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
    
    setFeedback(isCorrect ? 
      `✅ Correct! ${currentData.puzzles[currentData.currentIndex].explanation}` :
      `❌ The correct answer was ${currentData.puzzles[currentData.currentIndex].answer}. ${currentData.puzzles[currentData.currentIndex].explanation}`
    );

    setTimeout(() => {
      if (currentData.currentIndex < currentData.puzzles.length - 1) {
        setCurrentData(prev => ({
          ...prev,
          currentIndex: prev.currentIndex + 1,
          showHint: false
        }));
        setFeedback('');
      } else {
        completeExercise();
      }
    }, 3000);
  };

  // Riddle Solver
  const startRiddleSolver = () => {
    setCurrentData({
      riddles: [...LOGIC_RIDDLES],
      currentIndex: 0,
      hintsUsed: 0
    });
  };

  const checkRiddleAnswer = () => {
    const riddle = currentData.riddles[currentData.currentIndex];
    const isCorrect = userInput.toLowerCase().trim() === riddle.answer.toLowerCase();
    
    setPerformance(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
    
    setFeedback(isCorrect ? '✅ Correct!' : `❌ The answer was: ${riddle.answer}`);

    setTimeout(() => {
      if (currentData.currentIndex < currentData.riddles.length - 1) {
        setCurrentData(prev => ({
          ...prev,
          currentIndex: prev.currentIndex + 1
        }));
        setUserInput('');
        setFeedback('');
      } else {
        completeExercise();
      }
    }, 3000);
  };

  // Alternative Uses
  const startAlternativeUses = () => {
    const object = ALTERNATIVE_USES_OBJECTS[Math.floor(Math.random() * ALTERNATIVE_USES_OBJECTS.length)];
    setCurrentData({ object, uses: [], timeLimit: 120 });
  };

  const addAlternativeUse = () => {
    if (userInput.trim()) {
      setCurrentData(prev => ({
        ...prev,
        uses: [...prev.uses, userInput.trim()]
      }));
      setUserInput('');
    }
  };

  const finishAlternativeUses = () => {
    const uniqueUses = currentData.uses.length;
    setPerformance({ correct: uniqueUses, total: 10 }); // Out of 10 for creativity score
    completeExercise();
  };

  // Story Builder
  const startStoryBuilder = () => {
    const prompts = generateStoryPrompts();
    setCurrentData({ prompts, story: '' });
  };

  const finishStoryBuilder = () => {
    const usedAllPrompts = [
      ...currentData.prompts.nouns,
      ...currentData.prompts.adjectives,
      ...currentData.prompts.verbs
    ].every(word => currentData.story.toLowerCase().includes(word.toLowerCase()));
    
    setPerformance({
      correct: usedAllPrompts ? 10 : 5,
      total: 10
    });
    completeExercise();
  };

  // Breathing Exercise
  const startBreathingExercise = () => {
    setCurrentData({
      phase: 'inhale',
      cycle: 0,
      totalCycles: 10,
      inhaleTime: 4,
      holdTime: 4,
      exhaleTime: 6
    });
    runBreathingCycle();
  };

  const runBreathingCycle = () => {
    // This would be better implemented with animations
    // For now, it's a placeholder
    setTimeout(() => {
      setCurrentData(prev => ({
        ...prev,
        cycle: prev.cycle + 1
      }));
      
      if (currentData && currentData.cycle >= currentData.totalCycles) {
        setPerformance({ correct: 10, total: 10 });
        completeExercise();
      } else {
        runBreathingCycle();
      }
    }, 14000); // 4 + 4 + 6 seconds
  };

  // Complete Exercise
  const completeExercise = async () => {
    setIsActive(false);
    setPhase('complete');
    
    // Calculate final score
    const scoreData = calculateExerciseScore(exerciseId, performance);
    
    // Save to Firestore
    try {
      await saveExerciseSession(user.uid, {
        exerciseId,
        exerciseTitle: exercise.title,
        category: exercise.category,
        difficulty: exercise.difficulty,
        performance,
        score: scoreData.score,
        timeElapsed,
        completedAt: new Date()
      });
      
      setFeedback(scoreData.feedback);
      toast.success('Exercise completed!');
    } catch (error) {
      console.error('Error saving exercise session:', error);
      toast.error('Failed to save your progress');
    }
  };

  if (!exercise) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading exercise...</p>
      </div>
    );
  }

  // Render based on phase
  if (phase === 'instructions') {
    return (
      <div className={styles.sessionContainer}>
        <div className={styles.instructionsCard}>
          <h2>{exercise.title}</h2>
          <p className={styles.exerciseDescription}>{exercise.description}</p>
          
          <div className={styles.exerciseMeta}>
            <span>⏱️ {exercise.duration} minutes</span>
            <span>🎯 {exercise.difficulty}</span>
            <span>🏷️ {exercise.category.replace('_', ' ')}</span>
          </div>

          <div className={styles.instructions}>
            <h3>Instructions:</h3>
            <p>{exercise.instructions}</p>
          </div>

          <div className={styles.benefits}>
            <h3>Benefits:</h3>
            <ul>
              {exercise.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className={styles.instructionActions}>
            <button onClick={() => navigate('/profile/neurobic')} className={styles.secondaryButton}>
              Back
            </button>
            <button onClick={startExercise} className={styles.primaryButton}>
              Start Exercise
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'active') {
    return (
      <div className={styles.sessionContainer}>
        <div className={styles.activeHeader}>
          <div className={styles.progress}>
            <span>{exercise.title}</span>
            <span>⏱️ {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className={styles.exerciseArea}>
          {/* Render exercise-specific UI */}
          {exerciseId === 'memory_sequence' && currentData && (
            <div className={styles.memorySequence}>
              {currentData.showSequence ? (
                <div className={styles.sequenceDisplay}>
                  <h3>Memorize this sequence:</h3>
                  <div className={styles.sequence}>
                    {currentData.sequence.map((num, i) => (
                      <span key={i} className={styles.sequenceNumber}>{num}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.sequenceInput}>
                  <h3>Enter the sequence:</h3>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type the numbers"
                    className={styles.inputField}
                    autoFocus
                  />
                  <button
                    onClick={() => checkMemorySequence(userInput)}
                    className={styles.submitButton}
                  >
                    Submit
                  </button>
                  <p className={styles.round}>Round {currentData.round} of {currentData.maxRounds}</p>
                </div>
              )}
              {feedback && <div className={styles.feedback}>{feedback}</div>}
            </div>
          )}

          {exerciseId === 'memory_pairs' && currentData && (
            <div className={styles.memoryPairs}>
              <div className={styles.pairsGrid}>
                {currentData.cards.map((card, index) => (
                  <div
                    key={index}
                    className={`${styles.card} ${
                      card.isFlipped || currentData.matched.includes(index) ? styles.flipped : ''
                    } ${currentData.matched.includes(index) ? styles.matched : ''}`}
                    onClick={() => handleCardClick(index)}
                  >
                    <div className={styles.cardFront}>?</div>
                    <div className={styles.cardBack}>{card.symbol}</div>
                  </div>
                ))}
              </div>
              <p className={styles.moves}>Moves: {currentData.moves}</p>
            </div>
          )}

          {exerciseId === 'stroop_test' && currentData && (
            <div className={styles.stroopTest}>
              <div className={styles.stroopItem}>
                <h3>What COLOR is this word?</h3>
                <div className={styles.stroopWord} style={{ color: currentData.color }}>
                  {currentData.word.toUpperCase()}
                </div>
              </div>
              <div className={styles.stroopButtons}>
                {['red', 'blue', 'green', 'yellow', 'purple', 'orange'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleStroopAnswer(color)}
                    className={styles.colorButton}
                    style={{ backgroundColor: color, color: color === 'yellow' ? '#000' : '#fff' }}
                  >
                    {color.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className={styles.round}>Question {currentData.round} of {currentData.maxRounds}</p>
            </div>
          )}

          {exerciseId === 'pattern_completion' && currentData && (
            <div className={styles.patternCompletion}>
              <h3>Complete the pattern:</h3>
              <div className={styles.patternDisplay}>
                {currentData.puzzles[currentData.currentIndex].pattern.map((item, i) => (
                  <span key={i} className={styles.patternItem}>
                    {item === '?' ? '?' : item}
                  </span>
                ))}
              </div>
              <div className={styles.optionsGrid}>
                {currentData.puzzles[currentData.currentIndex].options.map(option => (
                  <button
                    key={option}
                    onClick={() => checkPatternAnswer(option)}
                    className={styles.optionButton}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedback && <div className={styles.feedback}>{feedback}</div>}
              <p className={styles.progress}>
                Question {currentData.currentIndex + 1} of {currentData.puzzles.length}
              </p>
            </div>
          )}

          {exerciseId === 'riddle_solver' && currentData && (
            <div className={styles.riddleSolver}>
              <h3>Solve this riddle:</h3>
              <div className={styles.riddleQuestion}>
                {currentData.riddles[currentData.currentIndex].question}
              </div>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Your answer"
                className={styles.inputField}
                autoFocus
              />
              <button onClick={checkRiddleAnswer} className={styles.submitButton}>
                Submit Answer
              </button>
              {feedback && <div className={styles.feedback}>{feedback}</div>}
              <p className={styles.progress}>
                Riddle {currentData.currentIndex + 1} of {currentData.riddles.length}
              </p>
            </div>
          )}

          {exerciseId === 'alternative_uses' && currentData && (
            <div className={styles.alternativeUses}>
              <h3>How many creative uses can you think of for a {currentData.object.object}?</h3>
              <p className={styles.timeRemaining}>
                Time remaining: {Math.max(0, currentData.timeLimit - timeElapsed)}s
              </p>
              
              <div className={styles.usesInput}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAlternativeUse()}
                  placeholder="Enter a creative use..."
                  className={styles.inputField}
                />
                <button onClick={addAlternativeUse} className={styles.addButton}>
                  Add
                </button>
              </div>

              <div className={styles.usesList}>
                <h4>Your ideas ({currentData.uses.length}):</h4>
                {currentData.uses.map((use, i) => (
                  <div key={i} className={styles.useItem}>
                    {i + 1}. {use}
                  </div>
                ))}
              </div>

              <button onClick={finishAlternativeUses} className={styles.finishButton}>
                Finish Exercise
              </button>
            </div>
          )}

          {exerciseId === 'story_builder' && currentData && (
            <div className={styles.storyBuilder}>
              <h3>Create a story using these words:</h3>
              <div className={styles.promptWords}>
                <div className={styles.wordGroup}>
                  <h5>Nouns:</h5>
                  {currentData.prompts.nouns.map((word, i) => (
                    <span key={i} className={styles.promptWord}>{word}</span>
                  ))}
                </div>
                <div className={styles.wordGroup}>
                  <h5>Adjectives:</h5>
                  {currentData.prompts.adjectives.map((word, i) => (
                    <span key={i} className={styles.promptWord}>{word}</span>
                  ))}
                </div>
                <div className={styles.wordGroup}>
                  <h5>Verbs:</h5>
                  {currentData.prompts.verbs.map((word, i) => (
                    <span key={i} className={styles.promptWord}>{word}</span>
                  ))}
                </div>
              </div>
              
              <textarea
                value={currentData.story}
                onChange={(e) => setCurrentData({ ...currentData, story: e.target.value })}
                placeholder="Write your creative story here..."
                className={styles.storyTextarea}
                rows={10}
              />
              
              <button onClick={finishStoryBuilder} className={styles.submitButton}>
                Submit Story
              </button>
            </div>
          )}

          {/* Placeholder for other exercises */}
          {!['memory_sequence', 'memory_pairs', 'stroop_test', 'pattern_completion', 'riddle_solver', 'alternative_uses', 'story_builder'].includes(exerciseId) && (
            <div className={styles.comingSoon}>
              <h3>This exercise interface is coming soon!</h3>
              <p>We're working on creating the best experience for this exercise.</p>
              <button onClick={() => navigate('/profile/neurobic')} className={styles.primaryButton}>
                Back to Exercises
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    const scoreData = calculateExerciseScore(exerciseId, performance);
    
    return (
      <div className={styles.sessionContainer}>
        <div className={styles.completeCard}>
          <div className={styles.completeIcon}>🎉</div>
          <h2>Exercise Complete!</h2>
          
          <div className={styles.scoreDisplay}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreNumber}>{scoreData.score}</span>
              <span className={styles.scoreLabel}>/ 100</span>
            </div>
          </div>

          <div className={styles.feedbackMessage}>{feedback}</div>

          <div className={styles.performanceStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Time</span>
              <span className={styles.statValue}>
                {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Accuracy</span>
              <span className={styles.statValue}>
                {Math.round((performance.correct / performance.total) * 100)}%
              </span>
            </div>
          </div>

          <div className={styles.completeActions}>
            <button
              onClick={() => window.location.reload()}
              className={styles.secondaryButton}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/profile/neurobic')}
              className={styles.primaryButton}
            >
              Back to Exercises
            </button>
            <button
              onClick={() => navigate('/profile/neurobic/progress')}
              className={styles.secondaryButton}
            >
              View Progress
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default ExerciseSession;

