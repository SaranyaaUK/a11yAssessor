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

    // Rearrange the result as errors, warnings and notices
    const data = {
        groupedErrors: {},
        groupedWarnings: {},
        groupedNotices: {}
    };

    result.issues.forEach(element => {
        const groupKey = element.code;

        if (element.typeCode === 1) {
            if (!data.groupedErrors[groupKey]) {
                data.groupedErrors[groupKey] = [];
            }
            data.groupedErrors[groupKey].push(element);
        } else if (element.typeCode === 2) {
            if (!data.groupedWarnings[groupKey]) {
                data.groupedWarnings[groupKey] = [];
            }
            data.groupedWarnings[groupKey].push(element);
        } else if (element.typeCode === 3) {
            if (!data.groupedNotices[groupKey]) {
                data.groupedNotices[groupKey] = [];
            }
            data.groupedNotices[groupKey].push(element);
        }
    });

    // Return the group result
    return data;
}

export default getPa11yResult;