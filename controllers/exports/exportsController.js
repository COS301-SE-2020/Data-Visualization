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
 * 04/08/2020    Elna Pistorius      Updated CSV exporting function
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
     * @param config the config file of the whole chart that needs to be exported
     */
    static csv(config) {
        let csv = this.convertArrayOfObjectsToCSV({
            data: config
        });
        if (csv == null){
            throw "CSV empty !"
        }
        else{
            return csv;
        }
    }
    static convertArrayOfObjectsToCSV(args) {

        let result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    }
}
module.exports = Exports;