/**
 * @file graphSuggesterController.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date         Author              Changes
 * ------------------------------------------------------------------
 * 30/06/2020    Marco Lombaard     Original
 * 1/07/2020     Marco Lombaard     Added parseODataMetadata function
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

        /**
         * This function parses the metadata which is received in XML format and passes it to the suggester
         * so it knows what it can suggest. It passes the properties(treated as terminal nodes) and the
         * navigation properties(so it can go to deeper layers) via the setMetadata function.
         * @param xmlData the metadata in XML format.
         */
        parseODataMetadata ( xmlData ) {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString ( xmlData,"text/xml" );
            let entities = xmlDoc.getElementsByTagName ( 'EntityType' ); //all "tables" that are available
            //let entities = xmlDoc.getElementsByTagName ( 'EntitySet' );

            let items = [];             //each "table" has its own items
            let index;                  //used to index items for JSON parsing
            let children;               //children of each entity(basically elements/attributes)
            let links;                  //links to other "tables" associated with this one
            let associations = [];      //associated tables - used in suggestion generation

            for ( let i = 0; i < entities.length; i++ ) {   //step through each table and find their items
                index = entities[i].Name;                   //The idea is to use strings as indices for JSON parsing
                items [ index ] = [];

                children = entities[i].getElementsByTagName ( 'Property' );

                for ( let j = 0; j < children.length; j++ ) { items [ index ][j] = children[j].Name; }

                links = entities[i].getElementsByTagName ( 'NavigationProperty' );

                for ( let j=0; j < links.length; j++ ) { associations[j] = links[j].Name; }
            }

            this.suggester.setMetadata( items, associations );
            //TODO remove these console.log statements - they are for testing purposes
            console.log("Items: "+items);
            console.log("Associations: "+associations);
        }

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