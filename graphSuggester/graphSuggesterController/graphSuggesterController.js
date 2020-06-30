/**
 * @file graphSuggesterController.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date         Author              Changes
 * -------------------------------------------------------
 * 30/06/2020    Marco Lombaard     Original
 *
 * Test Cases: none
 *
 * Functional Description: This file creates the graph suggester controller for the graph suggester
 * contained in graphSuggester.js.
 * This controller handles all suggestion requests and queries the suggester as required.
 *
 * Error Messages: "Error"
 * Assumptions: Input values are assumed to be in JSON format when requesting suggestions.
 * Constraints: Input values must be passed to the suggester in JSON format when requesting suggestions.
 */

/**
 * This function returns a function to create a graphSuggesterController object, which is used to manage
 * requests for suggestion generation.
 * @returns getInstance, a function to create a singleton instance of the graphSuggesterController object.
 */
let graphSuggesterControllerMaker = ( function () {
    let instance;

    /**
     * This class handles all requests for graph suggestion generation.
     * Usage Instructions: This class requires a JSON object containing the data that suggestions
     * must be generated for so it can pass it to the graph suggester.
     * @author Marco Lombaard
     */
    class graphSuggesterController {
        suggester = new graphSuggester();

        /**
         * This function passes the data that suggestions need to be generated for, to the graph
         * suggester in graphSuggester.js.
         * @param jsonData the data that suggestions need to be generated for, passed in JSON format
         * @returns the suggestions that were generated, in JSON format.
         */
        getSuggestions ( jsonData ) { this.suggester.getSuggestions( jsonData ); }

        /**
         * This function passes the target graph that must become the fittest graph to the graph
         * suggester in graphSuggester.js.
         * @param target the target graph.
         */
        changeFitnessTarget ( target ) { this.suggester.changeFitnessTarget ( target ); }

    }

    return {
        /**
         * A function that returns a singleton object of the graphSuggesterController type.
         * @return {graphSuggesterController} a controller that handles all graph suggestion requests.
         */
        getInstance: function () {
            if ( instance == null ) {
                instance = new graphSuggesterController();
                instance.constructor = null;
            }
            return instance;
        }
    }

} )();