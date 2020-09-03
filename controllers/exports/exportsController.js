/**
 * @file dataSourceController.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author              Changes
 * -------------------------------------------------------------------------------
 * 02/08/2020    Elna Pistorius      Original
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a exports controller.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */

class Exports{
    /**
     * This function generates exportable json of a chart
     * @param config the config of the whole chart
     */
    static json(config){
        let fs = require('fs');
        let jsonData = JSON.stringify(config);
        fs.writeFile("input.json", jsonData, function(err) {
            if (err) {
                console.log(err);
            }
        });
        return "input.json"
    }
    /**
     * This function generates exportable csv of a chart
     * @param config the types of graphs that needs to be updated
     */
    static csv(config) {
        return "Bob Smith,bob@example.com,123-456-7890,123 Fake Street";
    }
}
module.exports = Exports;