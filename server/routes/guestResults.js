/**
 * 
 *  guestResults.js
 *  
 *  API to access results for guest users 
 * 
 */

import captureWebsite from "capture-website";
import getPa11yResult from "../utils/getPa11yResult.js";
import express from "express";
const router = express.Router();

/**
 *  GET Request
 *  Get the image given the url and the element to take snapshot
 * 
 */
router.get("/getDOMElementImage", async (req, res) => {

    try {
        // <TO DO> Add error checks url and css not available

        // Get the url
        const url = decodeURIComponent(req.query.url)
        const selector = req.query.css;

        // Use capture-website to get image of the element from the given url
        const img = await captureWebsite.base64(url, {
            // Highlight the element before taking screenshot
            beforeScreenshot: async (page, browser) => {
                await page.evaluate((element) => {
                    const elem = document.querySelector(`${element}`);
                    if (!elem) {
                        console.log('Element not found.');
                        return;
                    };
                    elem.style.outline = '6px solid red'; elem.style['outline-offset'] = '12px';
                    elem.scrollIntoView({ block: 'center' });
                }, selector)
            },
            // Element to capture 
            element: selector,
            // Inset around the element
            inset: -50,
        })

        // Send the base-64 image to the front-end
        res.status(200).json(img);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot capture the screenshot of the image" });
    }

})

/**
 *  GET Request 
 *  Get the automated evaluation result 
 * 
 */
router.get("/:url", async (req, res) => {

    try {
        // URL provided by the guest user
        const url = req.params.url;

        const options = {
            includeNotices: false,
            includeWarnings: false,
            runners: ["axe"]
        }
        console.log("pa11y analysing the webpage");
        // Use the util to pre-process the result in the form the front-end need
        const data = await getPa11yResult(url, options);

        // Send the result to the front-end
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: "Cannot evaluate the given page" });
    }
})

export default router;