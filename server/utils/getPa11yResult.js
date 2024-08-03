/**
 *  getPa11yResult.js
 *  Utility to evaluate and group the pa11y result
 *  
 */
import pa11y from "pa11y";

async function getPa11yResult(url, options) {
    // Get the result of the automated evaluation
    const result = await pa11y(decodeURIComponent(url), options);

    // Rearrange the result as errors, warnings and notices
    const data = {};
    const errors = result.issues.filter(element => element.typeCode === 1);
    const warnings = result.issues.filter(element => element.typeCode === 2);
    const notices = result.issues.filter(element => element.typeCode === 3);
    data.groupedErrors = Object.groupBy(errors, ({ code }) => code);
    data.groupedWarnings = Object.groupBy(warnings, ({ code }) => code);
    data.groupedNotices = Object.groupBy(notices, ({ code }) => code);

    // Return the group result
    return data;
}

export default getPa11yResult;