/**
 *  getPa11yResult.js
 *  Utility to evaluate and group the pa11y result
 *  
 */
import chrome from "@sparticuz/chromium";
import dotenv from "dotenv";
dotenv.config()
import pa11y from "pa11y";

async function getPa11yResult(url, options) {
    // If in production environment get the chromium
    if (process.env.NODE_ENV === "production") {
        options.chromeLaunchConfig = {
            args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath(),
            headless: "new",
            ignoreHTTPSErrors: true,
        }
    }
    // Get the result of the automated evaluation
    const result = await pa11y(decodeURIComponent(url), options);

    return result;
}

export default getPa11yResult;