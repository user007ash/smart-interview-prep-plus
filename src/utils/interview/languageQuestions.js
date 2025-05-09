
// Language-specific interview questions
import { QUESTION_CATEGORIES } from './categories';

/**
 * Returns language-specific technical questions
 * @returns {Object} Object containing language-specific questions
 */
export const getLanguageSpecificQuestions = () => {
  return {
    // Java questions
    [QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVA]: [
      {
        id: 'java-1',
        text: 'How would you implement a linked list in Java?',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVA,
        topic: 'DSA',
        language: 'Java'
      },
      {
        id: 'java-2',
        text: 'What is the difference between `==` and `.equals()` in Java?',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVA,
        topic: 'Syntax',
        language: 'Java'
      },
      {
        id: 'java-3',
        text: 'How do you handle exceptions using `try-catch-finally` in Java?',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVA,
        topic: 'Error Handling',
        language: 'Java'
      },
      {
        id: 'java-4',
        text: 'Explain Java\'s memory management and garbage collection.',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVA,
        topic: 'Memory Management',
        language: 'Java'
      },
      {
        id: 'java-5',
        text: 'What are the differences between abstract classes and interfaces in Java?',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVA,
        topic: 'OOP',
        language: 'Java'
      }
    ],
    
    // JavaScript questions
    [QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVASCRIPT]: [
      {
        id: 'js-1',
        text: 'How would you reverse a string in JavaScript without using built-in methods?',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVASCRIPT,
        topic: 'DSA',
        language: 'JavaScript'
      },
      {
        id: 'js-2',
        text: 'Explain how JavaScript handles asynchronous errors.',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVASCRIPT,
        topic: 'Error Handling',
        language: 'JavaScript'
      },
      {
        id: 'js-3',
        text: 'What\'s the difference between `var`, `let`, and `const`?',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVASCRIPT,
        topic: 'Syntax',
        language: 'JavaScript'
      },
      {
        id: 'js-4',
        text: 'Explain closures in JavaScript and provide an example.',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVASCRIPT,
        topic: 'Advanced Concepts',
        language: 'JavaScript'
      },
      {
        id: 'js-5',
        text: 'How does prototypal inheritance work in JavaScript?',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVASCRIPT,
        topic: 'OOP',
        language: 'JavaScript'
      }
    ],
    
    // Python questions
    [QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.PYTHON]: [
      {
        id: 'python-1',
        text: 'Write a function in Python to check if a string is a palindrome.',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.PYTHON,
        topic: 'DSA',
        language: 'Python'
      },
      {
        id: 'python-2',
        text: 'How does Python handle exceptions? Give an example.',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.PYTHON,
        topic: 'Error Handling',
        language: 'Python'
      },
      {
        id: 'python-3',
        text: 'What is the time complexity of list append and pop operations in Python?',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.PYTHON,
        topic: 'DSA',
        language: 'Python'
      },
      {
        id: 'python-4',
        text: 'Explain the difference between lists and tuples in Python.',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.PYTHON,
        topic: 'Data Structures',
        language: 'Python'
      },
      {
        id: 'python-5',
        text: 'What are decorators in Python and how do you use them?',
        type: QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.PYTHON,
        topic: 'Advanced Concepts',
        language: 'Python'
      }
    ]
  };
};
