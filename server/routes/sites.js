/**
 * 
 *  sites.js
 *  
 *  API for sites
 * 
 */

import db from "../config/databaseConfig.js";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const router = express.Router();


/**
 * 
 *  Add a site
 * 
 */
router.post("/", async (req, res) => {

    try {
        // Get the site name and url from the request
        const { name, url } = req.body;

        // If the user is authenticated the information will be available in the 
        // request
        if (!req.user) {
            res.status(403).json({
                success: false,
                message: "User session expired login and try again"
            });
        } else {
            // Site add query
            const addSiteQuery = `INSERT INTO sites(name, url)
                                  VALUES ($1,$2) 
                                  RETURNING *`;
            let newSite = await db.query(addSiteQuery, [name, encodeURIComponent(url)]);

            // If the site addition is successful, 
            // Add entry into the evaluator table
            // and send data to the front-end
            if (newSite.rows.length > 0) {
                // Populate the Evaluator Table
                const addEvaluatorQuery = `INSERT INTO evaluators(site_id, user_id)
                                            VALUES ($1,$2) 
                                            RETURNING *`;
                await db.query(addEvaluatorQuery, [newSite.rows[0].site_id, req.user.user_id]);

                // Send response to the front-end
                res.status(200).json({
                    success: true,
                    site: newSite.rows[0],
                    message: "Site Added"
                });
            }
        }
    }
    catch (error) {
        console.error(error.message);
        // Send response to the front-end
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

/**
 * 
 *  Get all the site
 * 
 */
router.get("/", async (req, res) => {
    try {
        // If the user is authenticated the information will be available in 
        // the request
        if (!req.user) {
            res.status(403).json({
                success: false,
                message: "User session expired login and try again"
            });
        } else {
            const id = req.user.user_id;
            // Get all site information for the given user
            const getSitesQuery = `SELECT * FROM sites 
                                    WHERE site_id IN 
                                        (SELECT site_id 
                                        FROM evaluators 
                                        WHERE user_id=$1)`;
            const siteList = await db.query(getSitesQuery, [id]);

            // Send response to the front-end
            res.status(200).json({ success: true, sites: siteList.rows });
        }
    }
    catch (error) {
        console.error(error.message);
        // Send response to the front-end
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;