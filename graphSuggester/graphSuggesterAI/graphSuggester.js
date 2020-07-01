/**
 * @file graphSuggester.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date         Author              Changes
 * -----------------------------------------------------------
 * 30/06/2020    Marco Lombaard     Original
 * 1/07/2020     Marco Lombaard     Added setMetadata function
 *
 * Test Cases: none
 *
 * Functional Description: This file implements the graph suggestion functionality of the app. It generates the
 * suggestions via a genetic algorithm, where the best-fitness is decided by the user's preferences. It will
 * then return these suggestions as a JSON object.
 *
 * Error Messages: "Error"
 * Assumptions: Input values are assumed to be in JSON format when requesting suggestions.
 * Constraints: Input values must be in JSON format when requesting suggestions.
 */

/**
 * Purpose: This class is responsible for suggestion generation when graph suggestions are generated.
 * Usage Instructions: Use the corresponding getters and setters to modify/retrieve class variables.
 *                     Class functionality should be accessed through graphSuggestionController.js.
 * @author Marco Lombaard
 */
class graphSuggester {
    /**
     * The default constructor for the object - initialises class variables
     */
    constructor() {
        this.graphTypes = [];
        this.graphWeights = [];
        this.terminals = [];
        this.nonTerminals = [];
        this.nodeWeights = [];
        //initialise maybe
    }

    /**
     * This function sets the available types of graphs so that graph suggestion knows which graphs it can
     * suggest.
     * @param newTypes the new graph types that can be selected(such as bar/pie charts) in array format
     */
    setGraphTypes ( newTypes ) {
        this.graphTypes = [];
        for ( let i = 0; i < newTypes.length; i++ ) {
            this.graphTypes[i] = newTypes[i];
        }

        //TODO maybe add some way to carry over/reset weights?
    }

    /**
     * This function sets the nodes that can be selected for graph suggestions.
     * @param items the 'terminal' nodes, these don't lead to other tables for data.
     * @param associations the 'non-terminal' nodes, these lead to other tables for data.
     */
    setMetadata( items, associations ) {
        let count = 0;              //used to set weights for all nodes(option pool)
        let defaultWeight = 10;     //just a default weight for IGA

        for ( let i = 0; i < items.length; i++ ) {
            this.terminals[i] = items[i];
            this.nodeWeights [ count ] = defaultWeight;
            count++;
        }

        for ( let i = 0; i < associations.length; i++ ) {
            this.nonTerminals[i] = associations[i];
            this.nodeWeights [ count ] = defaultWeight;
            count++;
        }

        //TODO maybe keep original weights - probably fine like this though
    }

    /**
     * This function returns the graph suggestions in JSON format.
     * @param jsonData the data to be used in suggestion generation, in JSON format.
     * @return suggestions the suggested graphs in JSON format
     */
    getSuggestions ( jsonData ) {
        //generate graphSuggestions
    }

    /**
     * This function sets the target graph as the fittest individual, so the genetic algorithm tries to
     * achieve more generations of that type.
     * @param target the target graph type
     */
    changeFitnessTarget ( target ) {
        //change target with best fitness
        let targetPosition = this.graphTypes.findIndex ( target );
        let worstWeight = 10;   //this doesn't have to be hardcoded and can be decided by an algorithm/formula

        for ( let i = 0; i < this.graphWeights.length; i++ ) {
            this.graphWeights[i] = worstWeight;     //reset weights so that fittest individual is the target
        }

        this.graphWeights [ targetPosition ] = 0;   //set target to fittest individual

        /*
                something along the lines of:
                graphWeights[target] = bestWeight
                graphWeights[originalTarget] = lesserWeight or worstWeight
                or whatever
         */
    }
}