/**
 * 
 *  automatedResults.js
 * 
 *  API for automatedResults
 * 
 */
import db from "../config/databaseConfig.js";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const router = express.Router();
import getPa11yResult from "../utils/getPa11yResult.js";

router.post("/results", async (req, res) => {

    try {
        // Get the site id and url from the request
        const { site_id, url } = req.body;

        // If the user is authenticated, user information will be available in req.user
        if (!req.user) {
            res.status(403).json({
                success: false,
                message: "User session expired login and try again"
            });
        } else {

            const data = await getPa11yResult(decodeURIComponent(url), {
                includeNotices: true,
                includeWarnings: true,
                runners: ["axe"]
            });

            // Run the query as a single transaction (Combined Table Expression)
            // Updates the evaluator's automated result and
            // sets the timestamp for the automated evaluation
            const combinedQuery = `
                    -- Step 1: Fetch the evaluator_id
                    WITH evaluator_cte AS (
                        SELECT evaluator_id 
                        FROM evaluators 
                        WHERE site_id = $1
                    ),
    
                    -- Step 2: Insert or update into automated_results
                    auto_result_cte AS (
                        INSERT INTO automated_results(result, evaluator_id)
                        VALUES ($2, (SELECT evaluator_id FROM evaluator_cte))
                        ON CONFLICT (evaluator_id) 
                        DO UPDATE SET result = EXCLUDED.result
                        RETURNING *
                    ),

                    -- Step 3: Insert or update into result_time
                    update_result_time_cte AS (
                        INSERT INTO result_time(site_id, auto_time)
                        VALUES ($1, CURRENT_TIMESTAMP)
                        ON CONFLICT (site_id)
                        DO UPDATE SET auto_time = EXCLUDED.auto_time
                        RETURNING *
                    )
                    -- Return the result
                    SELECT
                    (SELECT row_to_json(auto_result_cte) FROM auto_result_cte) AS automated_result,
                    (SELECT row_to_json(update_result_time_cte) FROM update_result_time_cte) AS result_time;`

            const result = await db.query(combinedQuery, [site_id, data]);

            // Send response to the front-end
            res.status(200).json({ success: true, result: result.rows[0] });
        }
    } catch (error) {
        // Send response to the front-end
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Get automated Result by site id
router.get("/results/:siteid", async (req, res) => {
    try {
        // Get the site id, url from the request
        const siteid = req.params.siteid;

        // If the user is authenticated, user information will be available in req.user
        if (!req.user) {
            res.status(403).json({
                success: false,
                message: "User session expired login and try again"
            });
        } else {
            // Check if a evaluated result exist
            const automatedResult = await db.query(`
                SELECT * FROM automated_results 
                WHERE evaluator_id IN 
                (SELECT evaluator_id FROM evaluators 
                WHERE site_id=$1)`, [siteid]);

            // Send response to the front-end
            if (automatedResult.rows.length > 0) {
                res.status(200).json({ result: automatedResult.rows[0].result, message: "Result received" })
            } else {
                res.status(200).json({ message: "Site does not exit" }); // Need this for result button enabling
            }
        }
    } catch (error) {
        // Send response to the front-end
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;