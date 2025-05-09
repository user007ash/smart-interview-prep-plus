
// Role-specific interview questions
import { QUESTION_CATEGORIES } from './categories';

/**
 * Returns role-specific interview questions
 * @returns {Object} Object containing role-specific questions
 */
export const getRoleSpecificQuestions = () => {
  return {
    // Software engineering questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER]: [
      {
        id: 'tech-1',
        text: 'Explain the concept of closures in JavaScript.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER
      },
      {
        id: 'tech-2',
        text: 'What is the difference between REST and GraphQL?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER
      },
      {
        id: 'tech-3',
        text: 'Describe your approach to testing your code.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER
      },
      {
        id: 'tech-4',
        text: 'How do you stay updated with the latest technologies?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER
      },
      {
        id: 'tech-5',
        text: 'Explain the concept of microservices architecture.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER
      }
    ],
    
    // Marketing questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.MARKETING]: [
      {
        id: 'marketing-1',
        text: 'How do you measure the success of a marketing campaign?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.MARKETING
      },
      {
        id: 'marketing-2',
        text: 'Describe your experience with digital marketing tools.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.MARKETING
      },
      {
        id: 'marketing-3',
        text: 'How do you adapt your marketing strategy for different audience segments?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.MARKETING
      }
    ],
    
    // Data Science questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.DATA_SCIENCE]: [
      {
        id: 'data-1',
        text: 'Explain the difference between supervised and unsupervised learning.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DATA_SCIENCE
      },
      {
        id: 'data-2',
        text: 'How do you handle missing data in a dataset?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DATA_SCIENCE
      },
      {
        id: 'data-3',
        text: 'Describe a data project where you found unexpected insights.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DATA_SCIENCE
      }
    ],
    
    // Product Management questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.PRODUCT_MANAGER]: [
      {
        id: 'pm-1',
        text: 'How do you prioritize product features?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.PRODUCT_MANAGER
      },
      {
        id: 'pm-2',
        text: 'Describe how you gather user feedback and incorporate it into your product.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.PRODUCT_MANAGER
      },
      {
        id: 'pm-3',
        text: 'How do you measure product success?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.PRODUCT_MANAGER
      }
    ],
    
    // Design questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.DESIGN]: [
      {
        id: 'design-1',
        text: 'Walk me through your design process from concept to delivery.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DESIGN
      },
      {
        id: 'design-2',
        text: 'How do you incorporate user feedback into your designs?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DESIGN
      },
      {
        id: 'design-3',
        text: 'Describe a challenging design problem and how you solved it.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DESIGN
      }
    ],
    
    // Sales questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.SALES]: [
      {
        id: 'sales-1',
        text: 'Describe your sales process from lead to close.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SALES
      },
      {
        id: 'sales-2',
        text: 'How do you handle objections during a sales conversation?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SALES
      },
      {
        id: 'sales-3',
        text: 'What metrics do you use to track your sales performance?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SALES
      }
    ]
  };
};
