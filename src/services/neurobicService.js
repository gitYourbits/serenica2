// Neurobic Exercise Service
// Brain exercises to enhance cognitive resilience and wellbeing

// Exercise Categories
export const EXERCISE_CATEGORIES = {
  MEMORY: 'memory',
  ATTENTION: 'attention',
  PROBLEM_SOLVING: 'problem_solving',
  CREATIVITY: 'creativity',
  SENSORY: 'sensory'
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// Complete Exercise Library
export const NEUROBIC_EXERCISES = [
  // MEMORY EXERCISES
  {
    id: 'memory_sequence',
    title: 'Number Sequence Memory',
    description: 'Remember and recall sequences of numbers to enhance short-term memory',
    category: EXERCISE_CATEGORIES.MEMORY,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    duration: 3,
    instructions: 'You will see a sequence of numbers for a few seconds. Memorize them and type them back in the correct order.',
    benefits: ['Improves working memory', 'Enhances concentration', 'Boosts attention span'],
    type: 'interactive',
    settings: {
      initialLength: 4,
      maxLength: 10,
      displayTime: 3000,
      progressionRate: 1
    }
  },
  {
    id: 'memory_pairs',
    title: 'Memory Pairs',
    description: 'Match pairs of cards to improve visual memory and pattern recognition',
    category: EXERCISE_CATEGORIES.MEMORY,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    duration: 5,
    instructions: 'Click on cards to reveal them. Find all matching pairs. Try to complete in minimum moves.',
    benefits: ['Strengthens visual memory', 'Improves pattern recognition', 'Enhances focus'],
    type: 'game',
    settings: {
      gridSize: 4, // 4x4 = 16 cards
      cardTypes: 8,
      timeLimit: 180 // 3 minutes
    }
  },
  {
    id: 'story_recall',
    title: 'Story Recall',
    description: 'Read a short story and answer questions to test comprehension and memory',
    category: EXERCISE_CATEGORIES.MEMORY,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    duration: 8,
    instructions: 'Read the story carefully. Then answer questions about it without looking back.',
    benefits: ['Improves verbal memory', 'Enhances comprehension', 'Boosts retention'],
    type: 'quiz'
  },
  {
    id: 'spatial_memory',
    title: 'Spatial Memory Grid',
    description: 'Remember positions of objects on a grid to enhance spatial memory',
    category: EXERCISE_CATEGORIES.MEMORY,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    duration: 5,
    instructions: 'Observe the positions of highlighted squares. Then click on the same squares from memory.',
    benefits: ['Develops spatial memory', 'Improves visual processing', 'Enhances attention to detail'],
    type: 'interactive',
    settings: {
      gridSize: 5,
      itemsToRemember: 5,
      displayTime: 4000
    }
  },

  // ATTENTION EXERCISES
  {
    id: 'stroop_test',
    title: 'Color-Word Challenge',
    description: 'Test your attention control by identifying colors while ignoring word meanings',
    category: EXERCISE_CATEGORIES.ATTENTION,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    duration: 4,
    instructions: 'Select the COLOR of the word shown, not what the word says. Be quick and accurate!',
    benefits: ['Improves selective attention', 'Enhances cognitive flexibility', 'Boosts processing speed'],
    type: 'game',
    settings: {
      rounds: 20,
      timePerRound: 3000
    }
  },
  {
    id: 'visual_search',
    title: 'Visual Search Task',
    description: 'Find specific items among distractors to improve visual attention',
    category: EXERCISE_CATEGORIES.ATTENTION,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    duration: 5,
    instructions: 'Find all instances of the target item as quickly as possible.',
    benefits: ['Sharpens visual attention', 'Improves scanning ability', 'Enhances focus'],
    type: 'interactive',
    settings: {
      itemCount: 50,
      targetCount: 5,
      timeLimit: 60
    }
  },
  {
    id: 'divided_attention',
    title: 'Dual Task Challenge',
    description: 'Perform two tasks simultaneously to enhance divided attention',
    category: EXERCISE_CATEGORIES.ATTENTION,
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    duration: 6,
    instructions: 'Listen to numbers and sort shapes simultaneously. Respond to both tasks correctly.',
    benefits: ['Improves multitasking', 'Enhances cognitive control', 'Boosts mental flexibility'],
    type: 'interactive'
  },
  {
    id: 'sustained_attention',
    title: 'Vigilance Test',
    description: 'Maintain focus over time by detecting rare events',
    category: EXERCISE_CATEGORIES.ATTENTION,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    duration: 7,
    instructions: 'Watch for a specific pattern among many similar items. Stay alert!',
    benefits: ['Builds sustained attention', 'Improves concentration endurance', 'Enhances vigilance'],
    type: 'game',
    settings: {
      duration: 420, // 7 minutes
      eventFrequency: 15 // seconds
    }
  },

  // PROBLEM-SOLVING EXERCISES
  {
    id: 'pattern_completion',
    title: 'Pattern Completion',
    description: 'Complete visual patterns to enhance logical reasoning',
    category: EXERCISE_CATEGORIES.PROBLEM_SOLVING,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    duration: 6,
    instructions: 'Study the pattern and select the missing piece that completes it logically.',
    benefits: ['Enhances logical reasoning', 'Improves pattern recognition', 'Boosts abstract thinking'],
    type: 'quiz',
    settings: {
      questionCount: 10,
      difficulty: 'adaptive'
    }
  },
  {
    id: 'riddle_solver',
    title: 'Logic Riddles',
    description: 'Solve riddles and brain teasers to stimulate creative problem-solving',
    category: EXERCISE_CATEGORIES.PROBLEM_SOLVING,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    duration: 5,
    instructions: 'Read each riddle carefully and think creatively to find the solution.',
    benefits: ['Stimulates creative thinking', 'Improves lateral thinking', 'Enhances problem-solving'],
    type: 'quiz'
  },
  {
    id: 'number_puzzles',
    title: 'Mathematical Reasoning',
    description: 'Solve number sequences and mathematical puzzles',
    category: EXERCISE_CATEGORIES.PROBLEM_SOLVING,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    duration: 8,
    instructions: 'Find the pattern in number sequences and solve mathematical challenges.',
    benefits: ['Sharpens mathematical thinking', 'Improves logical reasoning', 'Enhances analytical skills'],
    type: 'quiz',
    settings: {
      questionCount: 12,
      includesOperations: true
    }
  },
  {
    id: 'tower_puzzle',
    title: 'Tower of Hanoi',
    description: 'Move disks between pegs following specific rules to solve the puzzle',
    category: EXERCISE_CATEGORIES.PROBLEM_SOLVING,
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    duration: 10,
    instructions: 'Move all disks to the target peg. Only smaller disks can go on larger ones.',
    benefits: ['Develops strategic thinking', 'Enhances planning skills', 'Improves problem-solving'],
    type: 'game',
    settings: {
      diskCount: 4,
      showOptimalMoves: true
    }
  },

  // CREATIVITY EXERCISES
  {
    id: 'word_association',
    title: 'Creative Word Association',
    description: 'Generate creative associations between seemingly unrelated words',
    category: EXERCISE_CATEGORIES.CREATIVITY,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    duration: 5,
    instructions: 'Think of creative connections between given words. The more unique, the better!',
    benefits: ['Boosts creative thinking', 'Enhances divergent thinking', 'Improves mental flexibility'],
    type: 'interactive'
  },
  {
    id: 'drawing_prompt',
    title: 'Visual Creativity Challenge',
    description: 'Complete drawings from simple prompts to stimulate visual creativity',
    category: EXERCISE_CATEGORIES.CREATIVITY,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    duration: 7,
    instructions: 'You\'ll see a simple shape. Turn it into a creative drawing. Let your imagination flow!',
    benefits: ['Stimulates visual creativity', 'Enhances imagination', 'Improves artistic expression'],
    type: 'interactive'
  },
  {
    id: 'alternative_uses',
    title: 'Alternative Uses Test',
    description: 'Think of creative uses for common objects',
    category: EXERCISE_CATEGORIES.CREATIVITY,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    duration: 5,
    instructions: 'List as many creative and unusual uses as you can for the given object.',
    benefits: ['Enhances creative thinking', 'Improves flexibility', 'Boosts innovation'],
    type: 'interactive',
    settings: {
      timeLimit: 120,
      minimumResponses: 5
    }
  },
  {
    id: 'story_builder',
    title: 'Collaborative Story Building',
    description: 'Create stories from random word prompts to enhance narrative creativity',
    category: EXERCISE_CATEGORIES.CREATIVITY,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    duration: 10,
    instructions: 'Create a coherent story using all the given words. Be creative and imaginative!',
    benefits: ['Develops narrative skills', 'Enhances creative writing', 'Improves verbal fluency'],
    type: 'interactive'
  },

  // SENSORY EXERCISES
  {
    id: 'color_distinction',
    title: 'Color Discrimination',
    description: 'Identify subtle differences in colors to enhance visual perception',
    category: EXERCISE_CATEGORIES.SENSORY,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    duration: 4,
    instructions: 'Find the square that is slightly different in color from the others.',
    benefits: ['Sharpens visual perception', 'Improves color discrimination', 'Enhances attention to detail'],
    type: 'game',
    settings: {
      rounds: 15,
      colorDifferenceIncreases: true
    }
  },
  {
    id: 'rhythm_pattern',
    title: 'Rhythm Reproduction',
    description: 'Listen to and reproduce rhythmic patterns to enhance auditory processing',
    category: EXERCISE_CATEGORIES.SENSORY,
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    duration: 6,
    instructions: 'Listen carefully to the rhythm pattern, then reproduce it by tapping.',
    benefits: ['Improves auditory processing', 'Enhances rhythmic perception', 'Boosts timing skills'],
    type: 'interactive',
    settings: {
      patternLength: 6,
      complexity: 'progressive'
    }
  },
  {
    id: 'sensory_integration',
    title: 'Multi-Sensory Matching',
    description: 'Match information across different senses to improve sensory integration',
    category: EXERCISE_CATEGORIES.SENSORY,
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    duration: 8,
    instructions: 'Match visual, auditory, and tactile descriptions to the correct object.',
    benefits: ['Enhances sensory integration', 'Improves cross-modal processing', 'Boosts cognitive flexibility'],
    type: 'interactive'
  },
  {
    id: 'mindfulness_breathing',
    title: 'Mindful Breathing Exercise',
    description: 'Focus on your breath to enhance body awareness and reduce stress',
    category: EXERCISE_CATEGORIES.SENSORY,
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    duration: 5,
    instructions: 'Follow the guided breathing pattern. Focus on the sensation of breathing.',
    benefits: ['Reduces stress', 'Improves focus', 'Enhances body awareness', 'Promotes relaxation'],
    type: 'guided',
    settings: {
      breathCycles: 10,
      inhaleTime: 4,
      holdTime: 4,
      exhaleTime: 6
    }
  }
];

// Get exercises by category
export function getExercisesByCategory(category) {
  return NEUROBIC_EXERCISES.filter(ex => ex.category === category);
}

// Get exercises by difficulty
export function getExercisesByDifficulty(difficulty) {
  return NEUROBIC_EXERCISES.filter(ex => ex.difficulty === difficulty);
}

// Get recommended exercises based on time available
export function getExercisesByDuration(maxDuration) {
  return NEUROBIC_EXERCISES.filter(ex => ex.duration <= maxDuration);
}

// Get a random daily exercise
export function getDailyExercise() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const index = dayOfYear % NEUROBIC_EXERCISES.length;
  return NEUROBIC_EXERCISES[index];
}

// Generate number sequence for memory exercise
export function generateNumberSequence(length) {
  const sequence = [];
  for (let i = 0; i < length; i++) {
    sequence.push(Math.floor(Math.random() * 10));
  }
  return sequence;
}

// Generate memory pairs cards
export function generateMemoryPairs(cardTypes) {
  const symbols = ['🌟', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎹', '🎺', '🎻', '🎮', '🎯', '🌈', '🌺', '🌻', '🌸'];
  const selectedSymbols = symbols.slice(0, cardTypes);
  const pairs = [...selectedSymbols, ...selectedSymbols];
  
  // Shuffle array
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  
  return pairs.map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false
  }));
}

// Generate spatial memory grid
export function generateSpatialPattern(gridSize, itemsToRemember) {
  const positions = [];
  while (positions.length < itemsToRemember) {
    const pos = Math.floor(Math.random() * (gridSize * gridSize));
    if (!positions.includes(pos)) {
      positions.push(pos);
    }
  }
  return positions;
}

// Stroop test color-word generator
export function generateStroopItem() {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const word = colors[Math.floor(Math.random() * colors.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    word,
    color,
    isCongruent: word === color
  };
}

// Generate visual search grid
export function generateVisualSearchGrid(itemCount, targetCount) {
  const distractors = ['○', '□', '△', '◇', '☆'];
  const target = '●';
  const grid = [];
  
  // Add targets
  for (let i = 0; i < targetCount; i++) {
    grid.push({ type: 'target', symbol: target, id: i });
  }
  
  // Add distractors
  for (let i = targetCount; i < itemCount; i++) {
    const distractor = distractors[Math.floor(Math.random() * distractors.length)];
    grid.push({ type: 'distractor', symbol: distractor, id: i });
  }
  
  // Shuffle
  for (let i = grid.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [grid[i], grid[j]] = [grid[j], grid[i]];
  }
  
  return grid;
}

// Pattern completion patterns
export const PATTERN_PUZZLES = [
  {
    pattern: [1, 2, 4, 7, 11, '?'],
    answer: 16,
    options: [14, 15, 16, 17],
    explanation: 'Add increasing numbers: +1, +2, +3, +4, +5'
  },
  {
    pattern: [2, 4, 8, 16, '?'],
    answer: 32,
    options: [24, 28, 32, 36],
    explanation: 'Each number is multiplied by 2'
  },
  {
    pattern: [1, 1, 2, 3, 5, 8, '?'],
    answer: 13,
    options: [11, 12, 13, 14],
    explanation: 'Fibonacci sequence: each number is the sum of the previous two'
  },
  {
    pattern: [100, 95, 85, 70, 50, '?'],
    answer: 25,
    options: [20, 25, 30, 35],
    explanation: 'Subtract increasing values: -5, -10, -15, -20, -25'
  },
  {
    pattern: [3, 9, 27, 81, '?'],
    answer: 243,
    options: [162, 216, 243, 324],
    explanation: 'Each number is multiplied by 3'
  }
];

// Logic riddles
export const LOGIC_RIDDLES = [
  {
    question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    answer: 'echo',
    hints: ['Think about sound', 'It needs empty space', 'Caves and mountains have this'],
    category: 'nature'
  },
  {
    question: 'The more you take, the more you leave behind. What am I?',
    answer: 'footsteps',
    hints: ['Think about walking', 'It\'s something physical', 'You can see them in sand'],
    category: 'physical'
  },
  {
    question: 'What has keys but no locks, space but no room, and you can enter but can\'t go inside?',
    answer: 'keyboard',
    hints: ['It\'s something you use daily', 'Related to technology', 'You\'re probably using one now'],
    category: 'technology'
  },
  {
    question: 'I am not alive, but I grow; I don\'t have lungs, but I need air; I don\'t have a mouth, but water kills me. What am I?',
    answer: 'fire',
    hints: ['Think about elements', 'It\'s hot', 'Used for cooking and warmth'],
    category: 'nature'
  },
  {
    question: 'What comes once in a minute, twice in a moment, but never in a thousand years?',
    answer: 'm',
    hints: ['Think about the words themselves', 'It\'s not about time', 'Look at the letters'],
    category: 'wordplay'
  }
];

// Alternative uses prompts
export const ALTERNATIVE_USES_OBJECTS = [
  {
    object: 'paperclip',
    commonUses: ['Hold papers together', 'Bookmark'],
    exampleCreativeUses: ['Make jewelry', 'Unlock simple locks', 'Create sculptures', 'Use as a zipper pull']
  },
  {
    object: 'brick',
    commonUses: ['Building material', 'Doorstop'],
    exampleCreativeUses: ['Paperweight', 'Garden edging', 'Art canvas', 'Exercise weight']
  },
  {
    object: 'rubber band',
    commonUses: ['Bundle items', 'Hair tie'],
    exampleCreativeUses: ['Make a ball', 'Create grip on jars', 'Mini slingshot', 'Mark book pages']
  },
  {
    object: 'newspaper',
    commonUses: ['Read news', 'Wrap items'],
    exampleCreativeUses: ['Plant pots', 'Insulation', 'Papier-mâché', 'Clean windows', 'Compost material']
  },
  {
    object: 'shoe',
    commonUses: ['Wear on feet', 'Protection'],
    exampleCreativeUses: ['Plant holder', 'Door stop', 'Hammer substitute', 'Art piece', 'Dog toy']
  }
];

// Story builder word prompts
export function generateStoryPrompts() {
  const nouns = ['castle', 'robot', 'ocean', 'forest', 'dragon', 'scientist', 'astronaut', 'wizard', 'mountain', 'city'];
  const adjectives = ['mysterious', 'ancient', 'glowing', 'invisible', 'tiny', 'giant', 'magical', 'frozen', 'golden', 'hidden'];
  const verbs = ['discovered', 'transformed', 'vanished', 'created', 'protected', 'explored', 'awakened', 'shattered', 'united', 'escaped'];
  
  const selectedNouns = [];
  const selectedAdjectives = [];
  const selectedVerbs = [];
  
  // Select 3 random from each
  for (let i = 0; i < 3; i++) {
    selectedNouns.push(nouns[Math.floor(Math.random() * nouns.length)]);
    selectedAdjectives.push(adjectives[Math.floor(Math.random() * adjectives.length)]);
    selectedVerbs.push(verbs[Math.floor(Math.random() * verbs.length)]);
  }
  
  return {
    nouns: selectedNouns,
    adjectives: selectedAdjectives,
    verbs: selectedVerbs
  };
}

// Calculate exercise score
export function calculateExerciseScore(exerciseId, performance) {
  let score = 0;
  let feedback = '';
  
  switch (exerciseId) {
    case 'memory_sequence':
      score = Math.round((performance.correct / performance.total) * 100);
      feedback = score >= 80 ? 'Excellent memory!' : score >= 60 ? 'Good effort!' : 'Keep practicing!';
      break;
      
    case 'memory_pairs':
      const efficiency = (performance.pairs / performance.moves) * 100;
      score = Math.min(100, Math.round(efficiency * 1.5));
      feedback = score >= 80 ? 'Outstanding!' : score >= 60 ? 'Well done!' : 'Try to remember card positions!';
      break;
      
    case 'stroop_test':
      const accuracy = (performance.correct / performance.total) * 100;
      const speedBonus = performance.avgTime < 2000 ? 10 : 0;
      score = Math.min(100, Math.round(accuracy + speedBonus));
      feedback = score >= 90 ? 'Lightning fast!' : score >= 70 ? 'Great focus!' : 'Take your time to be accurate!';
      break;
      
    default:
      score = Math.round((performance.correct / performance.total) * 100);
      feedback = score >= 80 ? 'Excellent!' : score >= 60 ? 'Good job!' : 'Keep practicing!';
  }
  
  return { score, feedback };
}

// Track progress and suggest difficulty adjustment
export function suggestDifficultyAdjustment(exerciseHistory) {
  if (exerciseHistory.length < 3) {
    return { shouldAdjust: false, suggestion: null };
  }
  
  const recentScores = exerciseHistory.slice(-3).map(h => h.score);
  const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  
  if (avgScore >= 90) {
    return {
      shouldAdjust: true,
      suggestion: 'increase',
      message: 'You\'re doing great! Try a harder level for more challenge.'
    };
  } else if (avgScore < 50) {
    return {
      shouldAdjust: true,
      suggestion: 'decrease',
      message: 'Let\'s try an easier level to build your confidence.'
    };
  }
  
  return { shouldAdjust: false, suggestion: null };
}

// Get exercise recommendations based on user performance
export function getPersonalizedRecommendations(userProgress) {
  const recommendations = [];
  
  // Analyze weak areas
  const categoryScores = {};
  Object.values(EXERCISE_CATEGORIES).forEach(cat => {
    const exercises = userProgress.filter(p => 
      NEUROBIC_EXERCISES.find(e => e.id === p.exerciseId)?.category === cat
    );
    if (exercises.length > 0) {
      categoryScores[cat] = exercises.reduce((sum, ex) => sum + ex.score, 0) / exercises.length;
    }
  });
  
  // Recommend based on weak areas
  const weakestCategory = Object.entries(categoryScores)
    .sort(([, a], [, b]) => a - b)[0];
  
  if (weakestCategory && weakestCategory[1] < 70) {
    const exercises = getExercisesByCategory(weakestCategory[0])
      .filter(ex => ex.difficulty === DIFFICULTY_LEVELS.BEGINNER);
    recommendations.push({
      type: 'improvement',
      category: weakestCategory[0],
      exercises: exercises.slice(0, 2),
      message: `Focus on ${weakestCategory[0]} exercises to improve this cognitive area.`
    });
  }
  
  // Recommend variety if too focused
  const categoriesExercised = new Set(userProgress.map(p => 
    NEUROBIC_EXERCISES.find(e => e.id === p.exerciseId)?.category
  ));
  
  if (categoriesExercised.size < 3) {
    const unexploredCategories = Object.values(EXERCISE_CATEGORIES)
      .filter(cat => !categoriesExercised.has(cat));
    if (unexploredCategories.length > 0) {
      const category = unexploredCategories[0];
      recommendations.push({
        type: 'variety',
        category,
        exercises: getExercisesByCategory(category).slice(0, 2),
        message: 'Try exercises from different categories for balanced cognitive development.'
      });
    }
  }
  
  return recommendations;
}

