/**
 * 
 *  manualEvaluation.js
 * 
 *  API for manualEvaluation
 * 
 */
import db from "../config/databaseConfig.js";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const router = express.Router();
import pgFormat from "pg-format";


// PolyFill
function groupBy(array, keyGetter) {
    const map = new Map();
    array.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return Object.fromEntries(map);
}

router.get("/evalFormDetails", async (req, res) => {
    try {
        // Run the query as a single transaction (Combined Table Expression)
        const manualFormQuery = `
                SELECT * FROM principles;
                SELECT * FROM guidelines;
                SELECT * FROM manual_questions;`

        const result = await db.query(manualFormQuery);

        const principles = result[0];
        const guidelines = result[1];
        const questions = result[2];

        // Group the questions based on guidelines and principle and send to front end

        // Group the questions based on guidelines
        let questionsObj = questions.rows;
        let groupedQuestions = {};
        if (typeof Object.groupBy === "function") {
            groupedQuestions = Object.groupBy(questionsObj, (question) => question.guideline_name);
        } else {
            groupedQuestions = groupBy(questionsObj, (question) => question.guideline_name);
        }

        let guidelineObj = guidelines.rows;
        // Add the questions to the guideline object;
        guidelineObj.forEach((item) => {
            item.questions = groupedQuestions[item.title];
        });

        // Group the guidelines by principles
        let groupedGuidelines = {};

        if (typeof Object.groupBy === "function") {
            groupedGuidelines = Object.groupBy(guidelineObj, (guideline) => guideline.principle_name);
        } else {
            groupedGuidelines = groupBy(guidelineObj, (guideline) => guideline.principle_name);
        }
        // Send response to the front-end
        res.status(200).json({
            "success": true,
            "principles": principles.rows,
            "groupedGuidelines": groupedGuidelines,
            "groupedQuestions": groupedQuestions
        });
    } catch (error) {
        // Send response to the front-end
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
});

router.post("/results", async (req, res) => {
    try {
        // Get the site id, url from the request
        const { site_id, evalFormData } = req.body;

        // If the user is authenticated, user information will be available in req.user
        if (!site_id) {
            res.status(403).json("Site ID is required to add the information");
        } else {
            // Check if a evaluated result exist
            const evaluator = await db.query(`
                SELECT evaluator_id FROM evaluators 
                WHERE site_id=$1`,
                [site_id]);

            if (evaluator.rows.length > 0) {
                // Arrange the result in array format for insertion
                const data = Object.entries(evalFormData).map(([key, value]) => {
                    return [key, value.resultOption, value.observation, evaluator.rows[0].evaluator_id];
                });

                // Run query to either insert or update the result and time stamp
                const combinedQuery = `
                    WITH manual_result_cte AS (
                        INSERT INTO manual_results (q_id, result, observation, evaluator_id)
                        VALUES ${pgFormat('%L', data)}
                        ON CONFLICT (q_id, evaluator_id) 
                        DO UPDATE SET result = EXCLUDED.result, observation = EXCLUDED.observation
                        RETURNING *
                    ),
                    update_result_time_cte AS (
                        INSERT INTO result_time (site_id, manual_time)
                        VALUES ($1, CURRENT_TIMESTAMP)
                        ON CONFLICT (site_id)
                        DO UPDATE SET manual_time = EXCLUDED.manual_time
                        RETURNING *
                    )
                    SELECT
                        (SELECT json_agg(row_to_json(manual_result_cte)) FROM manual_result_cte) AS manual_results,
                        (SELECT row_to_json(update_result_time_cte) FROM update_result_time_cte) AS result_time;`

                // Get the updated result
                const result = await db.query(combinedQuery, [site_id]);

                // Send response to the front-end
                res.status(200).json({ success: true, result: result.rows[0] });
            } else {
                // Send response to the front-end
                res.status(500).json({
                    success: false,
                    message: "Server Error"
                });
            }
        }
    } catch (error) {
        // Send response to the front-end
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get manual result by site id
router.get("/results/:siteid", async (req, res) => {
    try {
        // Get the site id, url from the request
        const siteid = req.params.siteid;

        // If the user is authenticated, user information will be available in req.user
        if (!siteid) {
            res.status(403).json("Site ID is required.");
        } else {
            const query = `
                    SELECT 
                        mq.q_id,
                        mq.guideline_name,
                        mq.title,
                        mr.observation,
                        mr.result,
                        g.principle_name
                    FROM manual_results mr
                    JOIN manual_questions mq ON mr.q_id = mq.q_id
                    JOIN success_criteria sc ON mq.sc_id = sc.sc_id
                    JOIN guidelines g ON sc.guideline_id = g.guideline_id
                    WHERE mr.evaluator_id IN (
                        SELECT evaluator_id 
                        FROM evaluators 
                        WHERE site_id=$1
                    );
                `;

            const result = await db.query(query, [siteid]);

            // Group the result by guidelines and principles
            if (result.rows.length > 0) {

                const groupedData = result.rows.reduce((acc, item) => {
                    const { principle_name, guideline_name } = item;

                    // Check if the principle already exists
                    if (!acc[principle_name]) {
                        acc[principle_name] = {};
                    }

                    // Check if the guideline already exists under the principle
                    if (!acc[principle_name][guideline_name]) {
                        acc[principle_name][guideline_name] = [];
                    }

                    // Add the item to the corresponding guideline array
                    acc[principle_name][guideline_name].push(item);

                    return acc;
                }, {});

                // Send response to the front-end
                res.status(200).json({
                    success: true,
                    result: groupedData,
                    message: "Result received"
                })
            } else {
                // Send response to the front-end
                res.status(200).json({
                    success: false,
                    message: "Site does not exit"
                });
            }
        }
    } catch (error) {
        // Send response to the front-end
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export default router;