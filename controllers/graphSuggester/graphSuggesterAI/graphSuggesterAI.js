/**
 * @file graphSuggesterAI.js
 * Project: Data Visualisation Generator
 * Copyright: Open Source
 * Organisation: Doofenshmirtz Evil Incorporated
 * Modules: None
 * Related Documents: SRS Document - www.example.com
 * Update History:
 * Date          Author             Changes
 * -----------------------------------------------------------------------------------------------------------
 * 30/06/2020    Marco Lombaard     Original
 * 01/07/2020    Marco Lombaard     Added setMetadata function
 * 02/07/2020    Marco Lombaard     Added constructOption function
 * 09/07/2020    Marco Lombaard     Fixed getSuggestions and setMetaData functions
 * 15/07/2020    Marco Lombaard     Added more graph types to suggestion generation
 * 05/08/2020	 Marco Lombaard		Converted suggesterAI to singleton
 * 05/08/2020	 Marco Lombaard		Added excludeFields and notInExcluded functions
 * 05/08/2020	 Marco Lombaard		Updated changeFitness to accept eChart and deduce fittest characteristics
 * 06/08/2020	 Marco Lombaard		Added geneticAlgorithm, calculateFitness, crossover, mutation functions
 * 07/08/2020	 Marco Lombaard		Updated setMetadata function to accept graph types as a parameter
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
 * This function returns a function to create a graphSuggesterAI object, which is used for suggestion generation.
 * @returns getInstance, a function to create a singleton instance of the graphSuggesterAI object.
 */
let graphSuggesterMaker = (function () {
	let instance = null;

	/**
	 * Purpose: This class is responsible for suggestion generation when graph suggestions are generated.
	 * Usage Instructions: Use the corresponding getters and setters to modify/retrieve class variables.
	 * Class functionality should be accessed only by graphSuggestionController.js.
	 * @author Marco Lombaard
	 */
	class graphSuggesterAI {
		/**
		 * The default constructor for the object - initialises class variables
		 */
		constructor() {
			this.graphTypes = []; //types of graphs to select when generating suggestions
			this.terminals = []; //immediate data fields
			this.nonTerminals = []; //associations with other tables - will require more requests
			this.fieldTypes = []; //types of each field - used in chromosome representation

			this.fieldExclusions = []; //fields to exclude during suggestion generation
			this.fittestGraphType = null; //the target graph type(will have the lowest fitness value, i.e. best fitness)
			this.fittestFieldType = null; //the target field type(will have the lowest fitness value, i.e. best fitness)
			this.mutationRate = 0.3; //the rate at which the population should mutate
			//should we initialise these?

			this.setGraphTypes(['line', 'bar', 'pie', 'scatter', 'effectScatter', 'parallel', 'candlestick', 'map', 'funnel', 'custom']);
		}

		/**
		 * This function sets the available types of graphs so that graph suggestion knows which graphs it can
		 * suggest.
		 * @param newTypes the new graph types that can be selected(such as bar/pie charts) in array format
		 */
		setGraphTypes(newTypes) {
			this.graphTypes = [];
			for (let i = 0; i < newTypes.length; i++) {
				this.graphTypes[i] = newTypes[i];
			}

			//TODO maybe add some way to carry over/reset weights?
		}

		/**
		 * This function sets the nodes that can be selected for graph suggestions.
		 * @param items the 'terminal' nodes, these don't lead to other tables for data.
		 * @param associations the 'non-terminal' nodes, these lead to other tables for data.
		 * @param types the types of each field for each item
		 */
		setMetadata(items, associations, types = null) {
			this.terminals = []; //reset values so that old ones don't interfere
			this.nonTerminals = [];

			if (items != null) {
				//eslint-disable-line
				let itemsKeys = Object.keys(items); //get the named keys for the set
				for (let i = 0; i < itemsKeys.length; i++) {
					this.terminals[itemsKeys[i]] = items[itemsKeys[i]];
				}
			}

			if (associations != null) {
				//eslint-disable-line
				let associationKeys = Object.keys(associations); //get the named keys for the set
				for (let i = 0; i < associationKeys.length; i++) {
					this.nonTerminals[associationKeys[i]] = associations[associationKeys[i]];
				}
			}

			if (types != null) {
				//eslint-disable-line
				let typeKeys = Object.keys(types); //get the named keys for the set
				for (let i = 0; i < typeKeys.length; i++) {
					this.fieldTypes[typeKeys[i]] = types[typeKeys[i]];
				}
			}

			// console.log(this.terminals);
		}

		/**
		 * This function is the Genetic Algorithm itself, generating new populations at each iteration
		 * @param options the options to choose from when creating a population
		 * @param results the data that was passed in - used to determine field types
		 */
		geneticAlgorithm(options, results) {	//TODO deprecate results, data processing will be moved to dataSourceController
			if (options == null || options.length === 0 || results == null || results.length === 0) {//eslint-disable-line
				return null;
			}
			//TODO might be able to optimise with pre-processing of types, so that 'results' isn't passed
			let chromosomes = []; //Our population
			let populationSize = 10; //amount of chromosomes to generate
			let title; //the title of the graph - used for data retrieval
			let graphType; //the type of graph
			let fieldType; //the category/type of field(date, currency, boolean, string, etc.)

			//initialise population
			for (let i=0; i<populationSize; i++) {
				title =  Math.trunc(Math.random() * options.length);	//select a random title
				graphType = this.graphTypes[Math.trunc(Math.random() * 5)];	//select a random graph type
				fieldType = typeof results[0][title];	//TODO will need extra processing to determine date/time etc.
				//fieldType = this.fieldTypes[title];	//TODO replace the above line with this
				chromosomes[i] = [ title, graphType, fieldType ];	//set up the chromosome properties
			}

			let mutate = 0; //value must be below mutation rate for mutation to take place
			let fitness = []; //all the fitness values - use to select parents
			let bestFitness = 1000; //this is set to a large value at first
			let secondBestFitness = 1000; //this is set to a large value at first
			let globalBestFitness = 1000; //this is the best fitness out of the entire population
			let bestCandidate = 0; //the best candidate so far
			let secondBestCandidate = 0; //the second best candidate so far
			let globalBestCandidate = 0; //the best candidate globally
			let tournament = []; //the tournament pool
			let tournamentSize = 5; //the size of the tournament pool
			let offspring1 = []; //used to reproduce the best candidate
			let offspring2 = []; //used to reproduce the second best candidate
			let count = 0; //tracks the amount of epochs
			let maxEpochs = 10; //the maximum amount of epochs that may be generated

			for (let i = 0; i < populationSize; i++) {
				//calculate the fitness for each chromosome
				fitness[i] = this.calculateFitness(chromosomes[i]);
				if (fitness[i] < globalBestFitness) {
					//if it has better fitness than the global fitness
					globalBestFitness = fitness[i];
					globalBestCandidate = i;
				}
			}

			while (globalBestFitness !== 0 && count < maxEpochs) {
				//while we have not yet reached the best suggestion nor timed out
				count++;

				for (let i = 0; i < tournamentSize; i++) {
					tournament[i] = Math.floor(Math.random() * populationSize);
					if (fitness[tournament[i]] < bestFitness) {
						//if it has better fitness than the best candidate
						secondBestCandidate = bestCandidate;
						secondBestFitness = bestFitness;
						bestCandidate = tournament[i];
						bestFitness = fitness[tournament[i]];
					} else if (fitness[tournament[i]] < secondBestFitness) {
						//else if it has better fitness than the second best candidate
						secondBestFitness = fitness[tournament[i]];
						secondBestCandidate = tournament[i];
					}
				}

				for (let i = 0; i < chromosomes[bestCandidate].length; i++) {
					//reproduce the best parents
					offspring1[i] = chromosomes[bestCandidate][i];
					offspring2[i] = chromosomes[secondBestCandidate][i];
				}

				this.crossover(chromosomes[bestCandidate], chromosomes[secondBestCandidate]); //crossover the best parents

				for (let i = 0; i < populationSize; i++) {
					//mutate all but the best parents
					if (i !== bestCandidate && i !== secondBestCandidate) {
						if (offspring1.length !== 0) {
							for (let j = 0; j < offspring1.length; j++) {
								chromosomes[i][j] = offspring1[j];
							}
							offspring1 = []; //reset for next iteration
						} else if (offspring2.length !== 0) {
							for (let j = 0; j < offspring2.length; j++) {
								chromosomes[i][j] = offspring2[j];
							}
							offspring2 = []; //reset for next iteration
						} else {
							mutate = Math.random();

							if (mutate <= this.mutationRate) {	//check if it may mutate
								this.mutation(chromosomes[i], options, results);	//mutate the chromosome
								//this.mutation(chromosomes[i], options);	//TODO replace the above line with this
							}
						}
					}
				}

				globalBestFitness = bestFitness; //assume this is the best, then check
				globalBestCandidate = bestCandidate; //assume this is the best, then check
				for (let i = 0; i < populationSize; i++) {
					//calculate the fitness for each chromosome
					fitness[i] = this.calculateFitness(chromosomes[i]);
					if (fitness[i] < globalBestFitness) {
						//if better than the global best
						globalBestFitness = fitness[i];
						globalBestCandidate = i;
					}
				}
			}

			return chromosomes[globalBestCandidate]; //return our best suggestion
		}

		/**
		 * The function to calculate chromosome fitness.
		 * @param chromosome the chromosome being evaluated
		 * @return {number} the fitness value(lower = better)
		 */
		calculateFitness(chromosome) {
			//TODO consider adding something extra like scatterEffect being better than bar chart if scatter is best
			let fitness = 0;
			let penalty = 5;

			if (chromosome[1] !== this.fittestGraphType) {
				//check if graph type is the best
				fitness += penalty;
			}
			if (chromosome[2] !== this.fittestFieldType) {
				//check if field type is the best
				fitness += penalty;
			}

			return fitness;

			//TODO consider decoupling chromosome representation from evaluation(like characteristic arrays being evaluated instead of each individual attribute)
		}

		/**
		 * The function to crossover two parents
		 * @param parent1 one of the two chromosomes to crossover
		 * @param parent2 the other chromosome to crossover
		 */
		crossover(parent1, parent2) {
			let degree = Math.floor(Math.random() * 3);
			let temp; //variable used in swapping

			switch (degree) {
				case 0:
					temp = parent1[1]; //swap graph types
					parent1[1] = parent2[1];
					parent2[1] = temp;
					break;

				case 1:
					temp = parent1[2]; //swap fields(and therefore their types)
					parent1[2] = parent2[2];
					parent2[2] = temp;
					temp = parent1[0];
					parent1[0] = parent2[0];
					parent2[0] = temp;
					break;

				case 2:
					temp = parent1[1]; //swap all attributes(basically a reproduction)
					parent1[1] = parent2[1];
					parent2[1] = temp;
					temp = parent1[2];
					parent1[2] = parent2[2];
					parent2[2] = temp;
					temp = parent1[0];
					parent1[0] = parent2[0];
					parent2[0] = temp;
					break;

				default:
					break; //should never reach this, default to reproduction
			}
		}

		/**
		 * The mutation operator in the GA
		 * @param chromosome the chromosome being mutated
		 * @param options the options for fields
		 * @param results the results - used to determine field types
		 */
		mutation(chromosome, options, results) {
			let title = Math.trunc(Math.random() * options.length); //select a random title
			let graphType = this.graphTypes[Math.trunc(Math.random() * 5)]; //select a random graph type
			let fieldType = typeof results[0][title]; //TODO will need extra processing to determine date/time etc.

			chromosome[0] = title;
			chromosome[1] = graphType;
			chromosome[2] = fieldType;
		}

		/**
		 * This function returns the graph suggestions in JSON format.
		 * @param jsonData the data to be used in suggestion generation, in JSON format.
		 * @return suggestions the suggested graphs in JSON format.
		 */
		getSuggestions(jsonData) {
			// let object = JSON.parse(jsonData);
			let object = jsonData;
			if (object == null || (this.terminals == null && this.nonTerminals == null)) {
				//eslint-disable-line
				return null;
			}
			// object = object [ 'd' ];            //OData always starts with 'd' as the main key
			let results = object['results']; //OData follows up with 'results' key

			if (results == null) {
				//eslint-disable-line
				results = object;
			}
			if (results == null || results.length === 0) {
				//eslint-disable-line
				console.log('RESULTS array has length of 0.');
				return null;
			}

			if (results == null) {
				//eslint-disable-line
				//Didn't follow with 'results' key, will have to go to a deeper layer
				console.log('Need to go a layer deeper');
				return null;
				//request deeper layer based on 'redirect' field
			} else {
				//generate suggestions
				let type = results[0]['__metadata']['type']; //get the table type(Customers, Products, etc.)

				type = type.substr(type.indexOf('.') + 1); //they all start with 'Northwind.' so trim that out
				// NOTE: only true for Odata right now, other sources may differ
				//TODO make it adapt to different sources

				//   console.log(this.terminals);
				//   console.log(type);

				let keys = this.terminals[type]; //check the available attributes in the metadata
				if (keys == null) {
					//eslint-disable-line
					return null;
				}
				let options = []; //the available key options(processed later) for suggestion generation
				let count = 0; //the index for options
				let nameKey = null;

				//   console.log(keys);

				for (let key = 0; key < keys.length; key++) {
					//go through all the keys and get rid of IDs and such
					//those keys are not graph data, just identifiers
					//TODO change it so some of this data can be processed(like string data)
					let name = keys[key]; //the key

					if (
						!(
							name.includes('ID') ||
							name.includes('Name') ||
							name.includes('Picture') ||
							name.includes('Description') ||
							name.includes('Date')
						) && this.notInExclusions(name)	//check that field is not excluded from suggestions
					) {
						//trim out the "useless" keys
						options[count++] = keys[key]; //add the key if it is meaningful data and is not an excluded field
					} else if ((name.includes('Name') || name.includes('ID')) && nameKey == null) {
						//eslint-disable-line
						//store the name key for later access
						nameKey = name;
					}
				}

				let hasData = false; //check variable used to see if data exists or if a deeper thread is followed

				for (let i = 0; i < options.length; i++) {
					if (results[0][options[i]]['__deferred'] == null) {
						//eslint-disable-line
						//if this isn't a link then we have data
						hasData = true;
						break;
					}
				}

				if (!hasData) {
					//if we don't have data then request the deeper layer(s)
					//TODO request the (deeper layer) data from dataSource and add them to the options
					console.log('Need to go deeper for more info');
					return null;
				}

				let choice = Math.trunc(Math.random() * options.length); //select random index - TODO let the GA do selection
				let data = []; //2D array containing item names and attributes
				let params = [nameKey, 'value']; //the labels for column values
				let graph = this.graphTypes[Math.trunc(Math.random() * 5)]; //select a random graph type - TODO replace '5' with graphTypes.length

				for (let i = 0; i < results.length; i++) {
					//Store name of field and values of its chosen attribute in data
					data[i] = [ results[i][nameKey], results[i][options[choice]] ];
				}

				//TODO replace most of the above code with this - data processing is being moved to dataSourceController
				/*let geneticSuggestion = this.geneticAlgorithm(options, results);

				for (let i = 0; i < results.length; i++) {
					//Store name of field and its chosen attribute in data
					data[i] = [ results[i][nameKey], results[i][geneticSuggestion[0]];	//geneticSuggestion[0] is the chosen field
				}
				let option = this.constructOption(data, geneticSuggestion[1], params[0], params[1], type+': '+geneticSuggestion[0]);
				 */

				let option = this.constructOption(data, graph, params, params[0], params[1], type + ': ' + options[choice]);

				return option;
			}
		}

		/**
		 * This function sets the target graph characteristics as the fittest characteristics, so the genetic algorithm \
		 * tries to achieve more generations with those characteristics.
		 * @param graphType the type of graph(ex. pie, bar, scatter)
		 * @param fieldType the type of field(ex. string, int, bool)
		 */
		changeFitnessTarget(graphType, fieldType) {
			this.fittestGraphType = graphType;
			this.fittestFieldType = fieldType;
		}

		/**
		 * This function stores the fields that are excluded from suggestion generation
		 * @param fields the fields that need to be excluded, in array format
		 */
		excludeFields(fields) {
			this.fieldExclusions = fields;
		}

		/**
		 * This function checks if the parameter is listed in excluded fields, returning false if it is, true if it isn't
		 * @param name the name of the field that needs to be checked
		 * @return {boolean} true if the field is not in exclusions, false if it is listed as an exclusion
		 */
		notInExclusions(name) {
			for (let i = 0; i < this.fieldExclusions.length; i++) {
				//check all exclusions
				if (name === this.fieldExclusions[i]) {
					//if it is in exclusions
					return false; //exclude it from options
				}
			}

			return true;
		}

		/**
		 * This function constructs and returns the graph parameters for eChart graph generation in frontend.
		 * @param data an array containing data arrays, which contain data for graphs.
		 * @param graph the type of graph to be used.
		 * @param params the labels for data, used to select which entries go on the x and y-axis.
		 * @param xEntries the entry/entries used on the x-axis.
		 * @param yEntries the entry/entries used on the y-axis.
		 * @param graphName the suggested name of the graph
		 * @return option the data used to generate the graph.
		 */
		constructOption(data, graph, params, xEntries, yEntries, graphName) {
			let src = [];
			src[0] = params;

			for (let i = 0; i < data.length; i++) {
				src[i + 1] = data[i];
			}

			//this constructs the options sent to the Apache eCharts API - this will have to be changed if
			//a different API is used
			let option = {
				title: {
					text: graphName,
				},
				dataset: {
					source: src,
				},
				xAxis: { type: 'category' }, //TODO change this so the type(s) gets decided by frontend or by the AI
				yAxis: {},
				series: [
					//construct the series of graphs, this could be one or more graphs
					{
						type: graph,
						encode: {
							x: xEntries, //TODO check if multiple values are allowed - might be useful
							y: yEntries,
						},
					},
				],
			};
			//the current options array works for line, bar, scatter, effectScatter charts
			//it is also the default options array

			if (graph.includes('pie')) {
				//for pie charts
				option.series = [
					{
						type: graph,
						radius: '60%',
						label: {
							formatter: '{b}: {@' + yEntries + '} ({d}%)',
						},
						encode: {
							itemName: xEntries,
							value: yEntries,
						},
					},
				];
			} else if (graph.includes('parallel')) {
				//for parallel charts - TODO to be added
			} else if (graph.includes('candlestick')) {
				//for candlestick charts - TODO to be added
			} else if (graph.includes('map')) {
				//for map charts - TODO to be added
			} else if (graph.includes('funnel')) {
				//for funnel charts - TODO to be added
			}

			return option;
		}
	}

	return {
		/**
		 * A function that returns a singleton object of the graphSuggesterAI type.
		 * @return {graphSuggesterAI} the AI that generates suggestions.
		 */
		getInstance: function () {
			if (instance === null) {
				instance = new graphSuggesterAI();
				instance.constructor = null;
			}
			return instance;
		},
	};
})();
module.exports = graphSuggesterMaker;
