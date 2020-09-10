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
 * 11/08/2020	 Marco Lombaard		Adapted getSuggestions to new data format
 * 14/08/2020	 Marco Lombaard		Suggestions now generate from metadata and do not require sample data
 * 14/08/2020	 Marco Lombaard		Renamed limitFields to setFields, notInExclusions to accepted
 * 14/08/2020	 Marco Lombaard		Moved constructOption to graphSuggesterController.js
 * 01/09/2020	 Marco Lombaard		Added scaleFitnessTarget and a way to scale fitness for multiple characteristics
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

			this.acceptedFields = []; //fields to use during suggestion generation

			this.fittestGraphType = null; //the target graph type(will have the lowest fitness value, i.e. best fitness)
			this.fittestFieldType = null; //the target field type(will have the lowest fitness value, i.e. best fitness)
			this.mutationRate = 0.3; //the rate at which the population should mutate

			this.graphTypeWeights = []; //the weights for each of the graph types
			this.fieldTypeWeights = []; //the weights for each of the field types

			this.defaultWeight = 10;

			this.setGraphTypes(['line', 'bar', 'pie', 'scatter', 'effectScatter']);
			//TODO 'parallel', 'candlestick', 'map', 'funnel', 'custom'
		}

		/**
		 * This function sets the available types of graphs so that graph suggestion knows which graphs it can
		 * suggest.
		 * @param newTypes the new graph types that can be selected(such as bar/pie charts) in array format
		 */
		setGraphTypes(newTypes) {
			this.graphTypes = [];
			this.graphTypeWeights = [];
			for (let i = 0; i < newTypes.length; i++) {
				this.graphTypes[i] = newTypes[i];
				this.graphTypeWeights[newTypes[i]] = this.defaultWeight;
			}
		}

		/**
		 * This function sets the nodes that can be selected for graph suggestions.
		 * @param items the 'terminal' nodes, these don't lead to other tables for data.
		 * @param associations the 'non-terminal' nodes, these lead to other tables for data.
		 * @param types the types of each field for each item
		 */
		setMetadata(items, associations, types = null) {
			this.terminals = {}; //reset values so that old ones don't interfere
			this.nonTerminals = {};
			this.fieldTypes = {};

			//eslint-disable-next-line eqeqeq
			if (items != null) {
				let itemsKeys = Object.keys(items); //get the named keys for the set
				for (let i = 0; i < itemsKeys.length; i++) {
					this.terminals[itemsKeys[i]] = items[itemsKeys[i]];
				}
			}

			//eslint-disable-next-line eqeqeq
			if (associations != null) {
				let associationKeys = Object.keys(associations); //get the named keys for the set
				for (let i = 0; i < associationKeys.length; i++) {
					this.nonTerminals[associationKeys[i]] = associations[associationKeys[i]];
				}
			}

			//eslint-disable-next-line eqeqeq
			if (types != null) {
				let typeKeys = Object.keys(types); //get the named keys for the set
				//it is important to note that types is an object with key-value pairs, where keys are entities
				//and values are arrays, therefore type[typeKeys[i]] gives an array of values
				for (let i = 0; i < typeKeys.length; i++) {
					this.fieldTypes[typeKeys[i]] = [];
					for (let j = 0; j < types[typeKeys[i]].length; j++) {
						this.fieldTypes[typeKeys[i]][j] = types[typeKeys[i]][j]; //make a deep copy
						if (!this.fieldTypeWeights[types[typeKeys[i]][j]]) {
							this.fieldTypeWeights[types[typeKeys[i]][j]] = this.defaultWeight;
						}
					}
				}
			}

			//console.log('Terminals: ', this.terminals);
		}

		/**
		 * This function is the Genetic Algorithm itself, generating new populations at each iteration
		 * @param options the options to choose from when creating a population
		 * @param types the types of the options
		 */
		geneticAlgorithm(options, types) {
			//TODO maybe we can make it so the GA selects entities? will require restructuring other functionality - leave for later
			//eslint-disable-next-line eqeqeq
			if (options == null || options.length === 0 || types == null || types.length === 0) {
				return null;
			}
			let chromosomes = []; //Our population
			let populationSize = 10; //amount of chromosomes to generate
			let titleIndex; //the index in 'options' for the title of the graph - used for data retrieval
			let graphType; //the type of graph
			let fieldType; //the category/type of field(date, currency, boolean, string, etc.)

			//initialise population
			for (let i = 0; i < populationSize; i++) {
				titleIndex = Math.floor(Math.random() * options.length); //select a random field title index
				let index = Math.floor(Math.random() * this.graphTypes.length); //select a random graph type index

				graphType = this.graphTypes[index]; //select a random graph type
				fieldType = types[titleIndex]; //obtain the type of the selected field
				chromosomes[i] = [titleIndex, graphType, fieldType]; //set up the chromosome properties
				//console.log(i+': ', chromosomes[i]);

			}
			//console.log('Options: ', options);
			//console.log('Types: ', types);

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

							if (mutate <= this.mutationRate) {
								//check if it may mutate
								this.mutation(chromosomes[i], options, types); //mutate the chromosome
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
			/*
			When to use what chart type:
			Line => Float,Decimal, Date
			Bar => Float, Int, Decimal, String
			Pie => Boolean, Float, Int, Decimal, String
			Scatter => Float, Decimal, Int
			*/
			if((chromosome[1].toLowerCase()).includes("line") && !((chromosome[2].toLowerCase()).includes("float") ||
				(chromosome[2].toLowerCase()).includes("datetime") || (chromosome[2].toLowerCase()).includes("decimal"))){
				console.log("Line => Float, Decimal, Date");
				fitness = fitness +2;
			}
			if((chromosome[1].toLowerCase()).includes("bar") && !((chromosome[2].toLowerCase()).includes("float") ||
				(chromosome[2].toLowerCase()).includes("int") || (chromosome[2].toLowerCase()).includes("decimal")||
				(chromosome[2].toLowerCase()).includes("string"))){
				console.log("Bar => Float, Int, Decimal, String");
				fitness = fitness +2
			}
			if((chromosome[1].toLowerCase()).includes("pie") && !((chromosome[2].toLowerCase()).includes("float") ||
				(chromosome[2].toLowerCase()).includes("int") || (chromosome[2].toLowerCase()).includes("string") ||
				(chromosome[2].toLowerCase()).includes("decimal"))){
				console.log("Pie => Boolean, Float, Int, Decimal, String");
				fitness = fitness +2
			}
			if((chromosome[1].toLowerCase()).includes("scatter") && !((chromosome[2].toLowerCase()).includes("float") ||
				!(chromosome[2].toLowerCase()).includes("int") || !(chromosome[2].toLowerCase()).includes("decimal"))){
				console.log("Scatter => Float, Decimal, Int");
				fitness = fitness +2
			}
			if((chromosome[1].toLowerCase()).includes("effectScatter") && !((chromosome[2].toLowerCase()).includes("float") ||
				(chromosome[2].toLowerCase()).includes("int") || (chromosome[2].toLowerCase()).includes("decimal"))){
				console.log("Scatter => Float, Decimal, Int");
				fitness = fitness +2
			}

			if (this.fieldTypeWeights[chromosome[2]]) {	//if the field type has a weight
				fitness+=this.fieldTypeWeights[chromosome[2]]; //add the weight
			} else {
				fitness += this.defaultWeight; //add a default weight
			}

			if (this.graphTypeWeights[chromosome[1]]) {
				//if the graph type has a weight
				fitness += this.graphTypeWeights[chromosome[1]]; //add the weight
			} else {
				fitness += this.defaultWeight; //add a default weight
			}

			return fitness;

			//TODO consider decoupling chromosome representation from evaluation(like characteristic arrays being evaluated instead of each individual attribute)
			//TODO This way we don't have to care how many characteristics there are, we just run through the array and check if they match
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

			//TODO consider decoupling representation from crossover, as suggested in calculateFitness
		}

		/**
		 * The mutation operator in the GA
		 * @param chromosome the chromosome being mutated
		 * @param options the options for fields
		 * @param types the list of field types
		 */
		mutation(chromosome, options, types) {
			let titleIndex = Math.trunc(Math.random() * options.length); //select a random title index
			let graphType = this.graphTypes[Math.trunc(Math.random() * this.graphTypes.length)]; //select a random graph type
			let fieldType = types[titleIndex]; //obtain the field type

			chromosome[0] = titleIndex;
			chromosome[1] = graphType;
			chromosome[2] = fieldType;

		}

		/**
		 * This function returns the graph suggestions as an array.
		 * @return suggestions the suggested graphs as an array.
		 * @param entity the entity to select fields from
		 */
		getSuggestions(entity) {
			// console.log('AI: ', entity, this.terminals);

			//eslint-disable-next-line eqeqeq
			if (this.terminals == null && this.nonTerminals == null) {
				console.log('No metadata available, returning...');
				return null;
			}

			let keys = this.terminals[entity];
			// eslint-disable-next-line eqeqeq
			if (keys == null) {
				console.log('No keys found in metadata to match', entity);
				return null;
			}
			//console.log(keys);

			let options = []; //the available key options(processed later) for suggestion generation
			let types = [];
			let count = 0; //the index for options
			let nameKey = null; //The item name - TODO can probably be replaced by passing the individual entity names as well

			for (let key = 0; key < keys.length; key++) {
				//go through all the keys and get rid of IDs and such
				//those keys are not graph data, just identifiers
				//TODO change it so some of this data can be processed(like string data)
				let name = keys[key]; //the key
				let upper = name.toUpperCase();
				if (
					!(
						(upper.includes('ID') || upper.includes('NAME') || upper.includes('PICTURE') || upper.includes('DESCRIPTION') || upper.includes('DATE')) //TODO periodic data - pretty useful
					) &&
					this.accepted(name) //check that field is in accepted fields
				) {
					//trim out the "useless" keys
					types[count] = this.fieldTypes[entity][key];
					options[count++] = keys[key]; //add the key if it is meaningful data and is not an excluded field
					//eslint-disable-next-line eqeqeq
				} else if ((upper.includes('NAME') || upper.includes('ID')) && nameKey == null) {
					//store the name key for later access
					nameKey = name;
				}
			}

			let hasData = false; //check variable used to see if data exists or if a deeper thread is followed
			// eslint-disable-next-line eqeqeq
			if (this.nonTerminals == null) {
				if (options.length !== 0) {
					//no links to other tables, what remains must be data
					hasData = true;
				} else {
					console.log('Unable to generate options');
					return null;
				}
			} else {
				for (let i = 0; i < options.length; i++) {
					// eslint-disable-next-line eqeqeq
					if (this.nonTerminals[options[i]] == null) {
						//if this isn't a link then we have data
						hasData = true;
						break;
					}
				}
			}

			if (!hasData) {
				//if we don't have data then request the deeper layer(s)
				//TODO request the (deeper layer) data from dataSource and add them to the options
				console.log('Need to go deeper for more info');
				return null;
			}

			let suggestion = this.geneticAlgorithm(options, types);
			let processed = [];
			processed[0] = options[suggestion[0]];
			for (let i = 1; i < suggestion.length; i++) {
				processed[i] = suggestion[i];
			}
			processed[suggestion.length] = nameKey;
			return processed;
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
			this.scaleFitnessTarget(graphType, fieldType);
		}

		/**
		 * This function scales the fitness values so that all characteristics have a fitness value
		 * @param graphType the graphType to make fitter
		 * @param fieldType the fieldType to make fitter
		 */
		scaleFitnessTarget(graphType, fieldType) {
			this.graphTypeWeights[graphType]--; //better fitness
			if (this.graphTypeWeights[graphType] === -1) {
				//if we go below 0 then everyone has to move up
				let keys = Object.keys(this.graphTypeWeights);

				for (let i = 0; i < keys.length; i++) {
					//everyone else gets worse fitness(if >10 fitness targets are used this is necessary)
					this.graphTypeWeights[keys[i]]++; //set to worse fitness(best fitness will be 0, the rest will move down)
				}
			}

			if (!this.fieldTypeWeights[fieldType]) {
				//if we haven't encountered this type yet
				this.fieldTypeWeights[fieldType] = this.defaultWeight;
			}

			this.fieldTypeWeights[fieldType]--; //better fitness
			if (this.fieldTypeWeights[fieldType] === -1) {
				//if we go below 0 then everyone has to move up
				let keys = Object.keys(this.fieldTypeWeights);

				for (let i = 0; i < keys.length; i++) {
					//everyone else gets worse fitness(if >10 fitness targets are used this is necessary)
					this.fieldTypeWeights[keys[i]]++; //set to worse fitness(best fitness will be 0, the rest will move down)
				}
			}
		}

		/**
		 * This function stores the fields that are excluded from suggestion generation
		 * @param fields the fields that need to be excluded, in array format
		 */
		setFields(fields) {
			this.acceptedFields = fields;
		}

		/**
		 * This function checks if the parameter is listed in accepted fields, returning true if it is, false otherwise
		 * @param name the name of the field that needs to be checked
		 * @return {boolean} true if the field is in accepted fields, false otherwise
		 */
		accepted(name) {
			if (this.acceptedFields.length === 0) {
				return true;
			}
			for (let i = 0; i < this.acceptedFields.length; i++) {
				if (this.acceptedFields[i].match(name)) return true;
			}
			return false;
		}
	}

	return {
		/**
		 * A function that returns a singleton object of the graphSuggesterAI type.
		 * @return {graphSuggesterAI} the AI that generates suggestions.
		 */
		getInstance: function () {
			// eslint-disable-next-line eqeqeq
			if (instance == null) {
				instance = new graphSuggesterAI();
				instance.constructor = null;
			}
			return instance;
		},
	};
})();
module.exports = graphSuggesterMaker;
