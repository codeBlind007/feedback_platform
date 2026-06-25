import validator from "validator";

const allowedCategories = [
  "bug_report",
  "feature_request",
  "general_feedback",
  "complaint",
  "suggestion"
];

export const validateCreateFeedbackData = (data) => {
    try{
        const errors = {};
        let {category, comments} = data;

        category = category?.toLowerCase().trim();

        if (!category || !allowedCategories.includes(category)) {
            errors.category = 'Please provide a valid category.';
        }

        if (!comments) {
            errors.comments = 'Comments are required.';
        }

        if(comments && !validator.isLength(comments, { min: 10, max: 500 })) {
            errors.comments = 'Comments must be between 10 and 500 characters long.';
        }
       
        return { errors, isValid: Object.keys(errors).length === 0 };
    }catch(error){
        console.error('Error validating feedback data:', error);
        return { general: 'An error occurred while validating the feedback data.' };
    }
}

