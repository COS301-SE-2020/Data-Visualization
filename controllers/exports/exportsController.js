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
 * 03/08/2020    Elna Pistorius      Updated JSON exporting function
 *
 * Test Cases: none
 *
 * Functional Description: This file implements a exports controller.
 *
 * Error Messages: "Error"
 * Assumptions: None
 * Constraints: None
 */
let fs = require('fs');
class Exports{
    /**
     * This function generates exportable json of a chart
     * @param fileName the name of the file that needs to be exported to JSON
     * @param config the config file of the whole chart that needs to be exported
     */
    static json(fileName, config){
        return JSON.stringify(config);
    }
    /**
     * This function generates exportable csv of a chart
     * @param fileName the name of the file that needs to be exported to JSON
     * @param config the config file of the whole chart that needs to be exported
     */
    static csv(fileName, config) {
        return JSON.stringify(config);
    }
}
module.exports = Exports;