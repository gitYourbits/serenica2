// CBT-Based Questionnaire Service
// Includes PHQ-9, GAD-7, DASS-21, and CBT Thought Records

// PHQ-9: Patient Health Questionnaire for Depression
export const PHQ9_QUESTIONNAIRE = {
  id: 'phq9',
  title: 'PHQ-9 Depression Screening',
  description: 'A 9-item questionnaire to screen for depression severity',
  category: 'depression',
  duration: '5 minutes',
  questions: [
    {
      id: 'phq9_q1',
      text: 'Little interest or pleasure in doing things',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_q2',
      text: 'Feeling down, depressed, or hopeless',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_q3',
      text: 'Trouble falling or staying asleep, or sleeping too much',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_q4',
      text: 'Feeling tired or having little energy',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_q5',
      text: 'Poor appetite or overeating',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_q6',
      text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_q7',
      text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_q8',
      text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_q9',
      text: 'Thoughts that you would be better off dead, or of hurting yourself',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    }
  ]
};

// GAD-7: Generalized Anxiety Disorder Scale
export const GAD7_QUESTIONNAIRE = {
  id: 'gad7',
  title: 'GAD-7 Anxiety Screening',
  description: 'A 7-item questionnaire to screen for generalized anxiety disorder',
  category: 'anxiety',
  duration: '3 minutes',
  questions: [
    {
      id: 'gad7_q1',
      text: 'Feeling nervous, anxious, or on edge',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'gad7_q2',
      text: 'Not being able to stop or control worrying',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'gad7_q3',
      text: 'Worrying too much about different things',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'gad7_q4',
      text: 'Trouble relaxing',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'gad7_q5',
      text: 'Being so restless that it is hard to sit still',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'gad7_q6',
      text: 'Becoming easily annoyed or irritable',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'gad7_q7',
      text: 'Feeling afraid, as if something awful might happen',
      type: 'scale',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    }
  ]
};

// DASS-21: Depression, Anxiety and Stress Scale
export const DASS21_QUESTIONNAIRE = {
  id: 'dass21',
  title: 'DASS-21 Assessment',
  description: 'A 21-item scale measuring depression, anxiety, and stress',
  category: 'comprehensive',
  duration: '10 minutes',
  questions: [
    // Depression subscale
    { id: 'dass21_q3', text: 'I couldn\'t seem to experience any positive feeling at all', type: 'scale', subscale: 'depression',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q5', text: 'I found it difficult to work up the initiative to do things', type: 'scale', subscale: 'depression',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q10', text: 'I felt that I had nothing to look forward to', type: 'scale', subscale: 'depression',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q13', text: 'I felt down-hearted and blue', type: 'scale', subscale: 'depression',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q16', text: 'I was unable to become enthusiastic about anything', type: 'scale', subscale: 'depression',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q17', text: 'I felt I wasn\'t worth much as a person', type: 'scale', subscale: 'depression',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q21', text: 'I felt that life was meaningless', type: 'scale', subscale: 'depression',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    
    // Anxiety subscale
    { id: 'dass21_q2', text: 'I was aware of dryness of my mouth', type: 'scale', subscale: 'anxiety',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q4', text: 'I experienced breathing difficulty (e.g., rapid breathing, breathlessness)', type: 'scale', subscale: 'anxiety',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q7', text: 'I experienced trembling (e.g., in the hands)', type: 'scale', subscale: 'anxiety',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q9', text: 'I found myself in situations that made me so anxious I was relieved when they ended', type: 'scale', subscale: 'anxiety',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q15', text: 'I felt I was close to panic', type: 'scale', subscale: 'anxiety',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q19', text: 'I was aware of the action of my heart without physical exertion', type: 'scale', subscale: 'anxiety',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q20', text: 'I felt scared without any good reason', type: 'scale', subscale: 'anxiety',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    
    // Stress subscale
    { id: 'dass21_q1', text: 'I found it hard to wind down', type: 'scale', subscale: 'stress',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q6', text: 'I tended to over-react to situations', type: 'scale', subscale: 'stress',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q8', text: 'I felt that I was using a lot of nervous energy', type: 'scale', subscale: 'stress',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q11', text: 'I found myself getting agitated', type: 'scale', subscale: 'stress',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q12', text: 'I found it difficult to relax', type: 'scale', subscale: 'stress',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q14', text: 'I was intolerant of anything that kept me from getting on with what I was doing', type: 'scale', subscale: 'stress',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    },
    { id: 'dass21_q18', text: 'I felt that I was rather touchy', type: 'scale', subscale: 'stress',
      options: [
        { value: 0, label: 'Did not apply to me at all' },
        { value: 1, label: 'Applied to me to some degree' },
        { value: 2, label: 'Applied to me a considerable degree' },
        { value: 3, label: 'Applied to me very much' }
      ]
    }
  ]
};

// CBT Thought Record Template
export const THOUGHT_RECORD_TEMPLATE = {
  id: 'thought_record',
  title: 'CBT Thought Record',
  description: 'Record and challenge negative automatic thoughts',
  category: 'cbt',
  duration: '10-15 minutes',
  questions: [
    {
      id: 'tr_situation',
      text: 'Describe the situation that triggered your distress',
      type: 'textarea',
      placeholder: 'What happened? Where were you? Who was involved?'
    },
    {
      id: 'tr_emotions',
      text: 'What emotions did you feel?',
      type: 'multiselect',
      options: [
        { value: 'anxious', label: 'Anxious' },
        { value: 'sad', label: 'Sad' },
        { value: 'angry', label: 'Angry' },
        { value: 'guilty', label: 'Guilty' },
        { value: 'ashamed', label: 'Ashamed' },
        { value: 'frustrated', label: 'Frustrated' },
        { value: 'disappointed', label: 'Disappointed' },
        { value: 'hopeless', label: 'Hopeless' }
      ]
    },
    {
      id: 'tr_emotion_intensity',
      text: 'Rate the intensity of your emotions (0-100)',
      type: 'slider',
      min: 0,
      max: 100,
      step: 10
    },
    {
      id: 'tr_automatic_thoughts',
      text: 'What automatic thoughts went through your mind?',
      type: 'textarea',
      placeholder: 'What were you thinking at that moment?'
    },
    {
      id: 'tr_evidence_for',
      text: 'What evidence supports this thought?',
      type: 'textarea',
      placeholder: 'Facts that support the thought...'
    },
    {
      id: 'tr_evidence_against',
      text: 'What evidence contradicts this thought?',
      type: 'textarea',
      placeholder: 'Facts that contradict the thought...'
    },
    {
      id: 'tr_cognitive_distortions',
      text: 'What thinking patterns might be at play?',
      type: 'multiselect',
      options: [
        { value: 'all_or_nothing', label: 'All-or-Nothing Thinking' },
        { value: 'overgeneralization', label: 'Overgeneralization' },
        { value: 'mental_filter', label: 'Mental Filter' },
        { value: 'disqualifying_positive', label: 'Disqualifying the Positive' },
        { value: 'jumping_conclusions', label: 'Jumping to Conclusions' },
        { value: 'magnification', label: 'Magnification/Minimization' },
        { value: 'emotional_reasoning', label: 'Emotional Reasoning' },
        { value: 'should_statements', label: '"Should" Statements' },
        { value: 'labeling', label: 'Labeling' },
        { value: 'personalization', label: 'Personalization' }
      ]
    },
    {
      id: 'tr_alternative_thought',
      text: 'What is a more balanced alternative thought?',
      type: 'textarea',
      placeholder: 'A more realistic and helpful way to think about this...'
    },
    {
      id: 'tr_new_emotion_intensity',
      text: 'Re-rate the intensity of your emotions now (0-100)',
      type: 'slider',
      min: 0,
      max: 100,
      step: 10
    }
  ]
};

// All available questionnaires
export const QUESTIONNAIRES = [
  PHQ9_QUESTIONNAIRE,
  GAD7_QUESTIONNAIRE,
  DASS21_QUESTIONNAIRE,
  THOUGHT_RECORD_TEMPLATE
];

// Scoring Functions
export function scorePHQ9(responses) {
  const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0);
  
  let severity, interpretation, recommendations;
  
  if (totalScore <= 4) {
    severity = 'Minimal';
    interpretation = 'Your responses suggest minimal or no depression symptoms.';
    recommendations = [
      'Continue with healthy lifestyle habits',
      'Practice regular self-care',
      'Stay connected with friends and family'
    ];
  } else if (totalScore <= 9) {
    severity = 'Mild';
    interpretation = 'Your responses suggest mild depression symptoms.';
    recommendations = [
      'Consider talking to someone you trust',
      'Engage in activities you enjoy',
      'Monitor your symptoms',
      'Try our CBT chatbot for support'
    ];
  } else if (totalScore <= 14) {
    severity = 'Moderate';
    interpretation = 'Your responses suggest moderate depression symptoms.';
    recommendations = [
      'Consider consulting with a mental health professional',
      'Use our CBT chatbot for guided support',
      'Practice self-care strategies regularly',
      'Book an appointment with a therapist through our platform'
    ];
  } else if (totalScore <= 19) {
    severity = 'Moderately Severe';
    interpretation = 'Your responses suggest moderately severe depression symptoms.';
    recommendations = [
      'We strongly recommend speaking with a mental health professional',
      'Book an appointment through our platform',
      'Use our crisis resources if needed',
      'Reach out to trusted friends or family'
    ];
  } else {
    severity = 'Severe';
    interpretation = 'Your responses suggest severe depression symptoms.';
    recommendations = [
      'Please seek professional help immediately',
      'Contact a mental health professional',
      'Use crisis hotlines if you\'re in immediate distress',
      'You\'re not alone - help is available'
    ];
  }
  
  // Check for suicidal ideation (question 9)
  const suicidalThoughts = responses['phq9_q9'] > 0;
  if (suicidalThoughts) {
    recommendations.unshift(
      '⚠️ IMPORTANT: You indicated thoughts of self-harm. Please contact a crisis hotline immediately: National Suicide Prevention Lifeline 988'
    );
  }
  
  return {
    totalScore,
    severity,
    interpretation,
    recommendations,
    requiresAttention: totalScore >= 10 || suicidalThoughts,
    crisisFlag: suicidalThoughts
  };
}

export function scoreGAD7(responses) {
  const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0);
  
  let severity, interpretation, recommendations;
  
  if (totalScore <= 4) {
    severity = 'Minimal';
    interpretation = 'Your responses suggest minimal anxiety symptoms.';
    recommendations = [
      'Continue with stress management practices',
      'Practice mindfulness exercises',
      'Maintain healthy sleep and exercise habits'
    ];
  } else if (totalScore <= 9) {
    severity = 'Mild';
    interpretation = 'Your responses suggest mild anxiety symptoms.';
    recommendations = [
      'Try relaxation techniques like deep breathing',
      'Use our Mindfulness chatbot for guided exercises',
      'Consider journaling your worries',
      'Maintain a regular routine'
    ];
  } else if (totalScore <= 14) {
    severity = 'Moderate';
    interpretation = 'Your responses suggest moderate anxiety symptoms.';
    recommendations = [
      'Consider professional support',
      'Practice CBT techniques through our chatbot',
      'Try our neurobic exercises for stress relief',
      'Book an appointment with a therapist'
    ];
  } else {
    severity = 'Severe';
    interpretation = 'Your responses suggest severe anxiety symptoms.';
    recommendations = [
      'We recommend consulting with a mental health professional',
      'Book an appointment through our platform',
      'Use grounding techniques during high anxiety',
      'Consider medication evaluation with a psychiatrist'
    ];
  }
  
  return {
    totalScore,
    severity,
    interpretation,
    recommendations,
    requiresAttention: totalScore >= 10
  };
}

export function scoreDASS21(responses) {
  // Calculate subscale scores
  const depressionQuestions = ['dass21_q3', 'dass21_q5', 'dass21_q10', 'dass21_q13', 'dass21_q16', 'dass21_q17', 'dass21_q21'];
  const anxietyQuestions = ['dass21_q2', 'dass21_q4', 'dass21_q7', 'dass21_q9', 'dass21_q15', 'dass21_q19', 'dass21_q20'];
  const stressQuestions = ['dass21_q1', 'dass21_q6', 'dass21_q8', 'dass21_q11', 'dass21_q12', 'dass21_q14', 'dass21_q18'];
  
  const depressionScore = depressionQuestions.reduce((sum, q) => sum + (responses[q] || 0), 0) * 2;
  const anxietyScore = anxietyQuestions.reduce((sum, q) => sum + (responses[q] || 0), 0) * 2;
  const stressScore = stressQuestions.reduce((sum, q) => sum + (responses[q] || 0), 0) * 2;
  
  // Interpret depression
  let depressionSeverity;
  if (depressionScore <= 9) depressionSeverity = 'Normal';
  else if (depressionScore <= 13) depressionSeverity = 'Mild';
  else if (depressionScore <= 20) depressionSeverity = 'Moderate';
  else if (depressionScore <= 27) depressionSeverity = 'Severe';
  else depressionSeverity = 'Extremely Severe';
  
  // Interpret anxiety
  let anxietySeverity;
  if (anxietyScore <= 7) anxietySeverity = 'Normal';
  else if (anxietyScore <= 9) anxietySeverity = 'Mild';
  else if (anxietyScore <= 14) anxietySeverity = 'Moderate';
  else if (anxietyScore <= 19) anxietySeverity = 'Severe';
  else anxietySeverity = 'Extremely Severe';
  
  // Interpret stress
  let stressSeverity;
  if (stressScore <= 14) stressSeverity = 'Normal';
  else if (stressScore <= 18) stressSeverity = 'Mild';
  else if (stressScore <= 25) stressSeverity = 'Moderate';
  else if (stressScore <= 33) stressSeverity = 'Severe';
  else stressSeverity = 'Extremely Severe';
  
  const recommendations = [];
  
  if (depressionScore > 13) {
    recommendations.push('Consider CBT therapy for depression management');
  }
  if (anxietyScore > 9) {
    recommendations.push('Try mindfulness exercises for anxiety relief');
  }
  if (stressScore > 18) {
    recommendations.push('Practice stress management techniques');
  }
  if (depressionScore <= 9 && anxietyScore <= 7 && stressScore <= 14) {
    recommendations.push('Your scores are in the normal range - keep up your self-care practices');
  } else {
    recommendations.push('Consider booking an appointment with one of our therapists');
    recommendations.push('Use our AI chatbots for daily support');
  }
  
  return {
    depressionScore,
    anxietyScore,
    stressScore,
    depressionSeverity,
    anxietySeverity,
    stressSeverity,
    recommendations,
    requiresAttention: depressionScore > 13 || anxietyScore > 9 || stressScore > 18
  };
}

export function scoreThoughtRecord(responses) {
  const initialIntensity = responses['tr_emotion_intensity'] || 0;
  const finalIntensity = responses['tr_new_emotion_intensity'] || 0;
  const improvement = initialIntensity - finalIntensity;
  const improvementPercentage = initialIntensity > 0 ? (improvement / initialIntensity) * 100 : 0;
  
  const interpretation = improvementPercentage > 25
    ? 'Great work! You\'ve successfully reduced the intensity of your distressing emotions through cognitive restructuring.'
    : improvementPercentage > 0
    ? 'You\'ve made some progress in reframing your thoughts. Keep practicing!'
    : 'Sometimes it takes time to shift our thinking patterns. Don\'t give up - keep practicing.';
  
  return {
    initialIntensity,
    finalIntensity,
    improvement,
    improvementPercentage: Math.round(improvementPercentage),
    interpretation,
    cognitiveDistortions: responses['tr_cognitive_distortions'] || [],
    emotions: responses['tr_emotions'] || []
  };
}

// Get appropriate chatbot recommendation based on questionnaire results
export function getChatbotRecommendation(questionnaireId, score) {
  if (questionnaireId === 'phq9') {
    if (score.totalScore >= 10) {
      return {
        chatbot: 'cbt',
        message: 'Our Cognitive Behavioral Therapy chatbot can help you work through depressive thoughts and develop coping strategies.'
      };
    }
  } else if (questionnaireId === 'gad7') {
    if (score.totalScore >= 10) {
      return {
        chatbot: 'mindfulness',
        message: 'Our Mindfulness chatbot can guide you through anxiety-reducing exercises and help you stay grounded in the present.'
      };
    }
  } else if (questionnaireId === 'dass21') {
    if (score.depressionScore > score.anxietyScore && score.depressionScore > score.stressScore) {
      return {
        chatbot: 'cbt',
        message: 'Based on your results, our CBT chatbot may be most helpful for addressing depressive symptoms.'
      };
    } else if (score.anxietyScore > score.depressionScore && score.anxietyScore > score.stressScore) {
      return {
        chatbot: 'mindfulness',
        message: 'Based on your results, our Mindfulness chatbot may be most helpful for managing anxiety.'
      };
    }
  }
  
  return {
    chatbot: 'cbt',
    message: 'Our AI chatbots are here to support you. Choose the one that best fits your needs.'
  };
}

