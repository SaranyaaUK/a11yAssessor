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

            // Add TimeStamp
            const addTimestampQuery = `INSERT INTO result_time(site_id)
                                  VALUES ($1) 
                                  RETURNING *`;
            await db.query(addTimestampQuery, [newSite.rows[0].site_id]);

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
        // Send response to the front-end
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

/**
 * 
 * Get site by ID
 * 
 */
router.get("/:id", async (req, res) => {
    try {
        // If the user is authenticated the information will be available in
        // the request
        if (!req.user) {
            res.status(403).json({
                success: false,
                message: "User session expired login and try again"
            });
        } else {
            const id = req.params.id;

            // Get the site info and timestamp info
            const combinedQuery = `SELECT s.*, rt.*
                                    FROM sites s
                                    JOIN result_time rt ON s.site_id = rt.site_id
                                    WHERE s.site_id = $1`;
            const result = await db.query(combinedQuery, [id]);

            // Send response to the front-end
            res.status(200).json({
                success: true,
                site: {
                    site_id: result.rows[0].site_id,
                    name: result.rows[0].name,
                    url: result.rows[0].url
                },
                timeStamp: {
                    auto_time: result.rows[0].auto_time,
                    manual_time: result.rows[0].manual_time
                }
            });
        }
    }
    catch (error) {
        // Send response to the front-end
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

/**
 * 
 *  Delete site
 * 
 */
router.delete("/:id", async (req, res) => {

    try {
        // Get the site name and url from the request
        const site_id = req.params.id;

        // If the user is authenticated the information will be available in
        // the request
        if (!req.user) {
            res.status(403).json({
                success: false,
                message: "User session expired login and try again"
            });
        } else {

            // Delete site by id
            await db.query(`DELETE FROM sites WHERE site_id=$1`, [site_id]);

            // Send response to the front-end
            res.status(200).json({ success: true, message: "Site Deleted" });
        }
    }
    catch (error) {
        // Send response to the front-end
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;