import sql from "../../utils/db.js";

const createFeedback = async (userId, category, comments) => {
  try {
    const result = await sql`
            INSERT INTO feedback (user_id, category, comments)
            VALUES (${userId}, ${category}, ${comments})
        `;
    return result;
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw error;
  }
};

const userFeedback = async (userId) => {
  try {
    const result = await sql`
            SELECT * FROM feedback WHERE user_id = ${userId}
        `;
    return result;
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    throw error;
  }
};

const feedbackResponse = async (feedbackId, response) => {
  try {
    const result = await sql`
        UPDATE feedback
        SET
            admin_response = ${response},
            status = 'resolved',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${feedbackId}
        RETURNING *;`;
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error updating feedback response:", error);
    throw error;
  }
};

export const getAnalyticsService = async () => {
    const [
        totalCountResult,
        categoryDistribution,
        statusDistribution,
        recentSubmissions
    ] = await Promise.all([
        sql`
            SELECT COUNT(*) AS total
            FROM feedback
        `,
        sql`
            SELECT category, COUNT(*) AS count
            FROM feedback
            GROUP BY category
            ORDER BY count DESC
        `,
        sql`
            SELECT status, COUNT(*) AS count
            FROM feedback
            GROUP BY status
        `,
        sql`
            SELECT
                id,
                category,
                comments,
                status,
                created_at
            FROM feedback
            ORDER BY created_at DESC
            LIMIT 10
        `
    ]);

    return {
        totalFeedback: Number(totalCountResult[0].total),
        categoryDistribution,
        statusDistribution,
        recentSubmissions
    };
};


export const getFeedbacksServiceByAdmin = async ({
    category,
    status,
    search
}) => {
    let query = sql`
        SELECT
            id,
            category,
            comments,
            status,
            admin_response,
            created_at
        FROM feedback
        WHERE 1=1
    `;

    if (category) {
        query = sql`${query} AND category = ${category}`;
    }

    if (status) {
        query = sql`${query} AND status = ${status}`;
    }

    if (search) {
        query = sql`${query} AND comments ILIKE ${'%' + search + '%'}`;
    }

    query = sql`${query} ORDER BY created_at DESC`;

    const feedbacks = await query;

    return feedbacks;
};

const feedbackService = {
  createFeedback,
  userFeedback,
  feedbackResponse,
  getAnalyticsService,
  getFeedbacksServiceByAdmin
};


export default feedbackService;
