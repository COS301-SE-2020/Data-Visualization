# Data Visualization Generator

![Data Visualization Generator](https://raw.githubusercontent.com/COS301-SE-2020/Data-Visualisation/master/img/com.png)

## Description

Big Data is an ever-growing source of information, with governments and corporations generating more Big Data than ever.
It proves to be extremely valuable for companies and governments to be able to extract trends and patterns from this data and use this information to better prepare and/or optimize any services they offer.

This repository represents the visualisation of Big Data. However, the catch comes in where, instead of manually creating these visualisations of Big Data, an Interactive Genetic Algorithm (IGA) will be implemented and let the user be able to select/choose the best visualisation of the given data, be it a graph/chart/scatter plot etc. 

####Links
* [Production Application](https://data-visualisation-prod.herokuapp.com)

* [Development Stage](https://data-visualisation-dev.herokuapp.com)

## Project Management

* Project Management tool can be found [here](https://github.com/COS301-SE-2020/Data-Visualisation#workspaces/data-visualization-5ed11ab3600f3c0e9851753e/board?repos=266792939). ![ZenHub](https://i.imgur.com/EQ663Fn.png)

* Sprint Planning can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/develop/documentation/Data_Visualization_Generator_SRS.pdf).

<details> 
<summary><b>Demo 1</b></summary>

* [Demo 1 Video Link](https://drive.google.com/drive/folders/1lFnGthxIPIuZHPTG4wG-Ffy6VKT2yWHK?usp=sharing)

##### Documentation

* SRS Document can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/develop/documentation/Data_Visualization_Generator_SRS.pdf).

</details>

<details> 
<summary><b>Demo 2</b></summary>

* [Demo 2 Video Link](https://drive.google.com/drive/folders/1lFnGthxIPIuZHPTG4wG-Ffy6VKT2yWHK?usp=sharing)

##### Documentation

* SRS Document can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/develop/documentation/Data_Visualization_Generator_SRS.pdf).

* Coding Standards Document can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/develop/documentation/Data_Visualization_Generator_SRS.pdf).

* User Manual can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/develop/documentation/Data_Visualization_Generator_SRS.pdf).

* API Manual can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/develop/documentation/Data_Visualization_Generator_SRS.pdf).

</details>

## Installation Instruction

The React-App that can be found in the *data-visualisation-app/* directory.
The Node.js server that serves the React-App and can be found in the *root/* directory.
 
To install dependecies:
  1.  Install the Node.js server dependencies: 
```
npm install
```
  2.  Change directory to data-visualisation-app: 
```
cd data-visualisation-app
```
  3.  Install the React-App dependencies: 
```
npm install
```

To run the React-App:

1.  Change directory to data-visualisation-app: 
```
cd data-visualisation-app
```
2.  View the React-App in development mode with live reloading: 
```
npm start
```

To run the Node.js server:

1.  Build React-App into production mode, and start the Node.js server: 
```
npm start
```

## Testing Instructions

The React-App that can be found in the *data-visualisation-app/* directory.
The Node.js server that serves the React-App and can be found in the *root/* directory.

To test the React-App: (currently no tests for the react-app)

1.  Change directory to data-visualisation-app: 
```
cd data-visualisation-app
```
2.  View the React-App in development mode with live reloading: 
```
npm test
```

To test the Node.js server: (Currently no tests for the server)

1.  Build React-App into production mode, and start the Node.js server: 
```
npm test
```

## Collaborators

### Phillip Shulze

[Profile Page](https://phillipstemmlar.github.io)

> I was born in Dundee, KwaZulu Natal, where I lived for 15 years.​ In 2014 I moved to Brits, North‑West.​ I graduated matric in 2017 from Brits Hoërskool with 6 distinctions. In 2018 I started studying BSc Computer Science at the University of Pretoria and I am currently (2020) in my final year. I am also a resident of the Republic of Kollegetehuis, where I have been elected to the Executive Council for the 2019/2020 term.

#### What I Did 
* Integration of react page-components and state management.
* Edit Dashboard functionality. 
* Client-Side requests to REST-endpoint 
* Database Setup
* Heroku Setup.

### Elna Pistorius

[Profile Page](https://elnapistorius.github.io/my-website/index.html)

> I am an adaptive software engineer in the making, I like to learn new things. I am interested in Artificial Intelligence, in particular Genetic Algorithms.

#### What I Did 
* SRS documentations.
* The edit suggestions page.
* The express node server to set up our endpoints.
* Application styling.

### Byron Tomkinson

[Profile Page](https://byrongt12.github.io/profile/)

 > I am student at the University of Pretoria, currently studying in my final year of Computer Science. Some of my skills include conflict resolution, problem solving, rapport building and reliability. I am open minded when it comes to different ideas that are shared and helpful wherever I can be. I have a passion for learning new things, especially in the field of human anatomy and physiology. I am crazy about Jesus and my hobbies include running, gymming and football.

#### What I Did 
* Add dashboard functionality.
* Add dashboard unit testing.
* Assist in the writing of the SRS such as the traceability matrix. 

### Marco Lombaard

[Profile Page](https://FlameReynard.github.io)


> I am currently studying third year Computer Science at the University of Pretoria. Our work provided many challenges, requiring us to come up with effective and efficient solutions to different problems - developing our critical thinking and problem-solving abilities. We have also been exposed to a variety of programming languages which we were expected to code in fluently, which allowed me to build a collection of programming languages.

#### What I Did 
* Display dashboard functionality and a bit of EditDashboard + unit tests for both and a unit test for DisplayGraph.
* CircleCI setup.

### Gian Uys

[Profile Page](https://mruys.github.io)

> Confident and ambitious third-year student from the University of Pretoria. I align myself with positive, exuberant people that can challenge my way of thought. I, however, enjoy all different types of people from different backgrounds, religion and culture. I believe human interaction is the most effective way to enrich one’s personality. My duties are done with extreme care and attention to detail. I thrive for perfection, orderliness and quality. Alongside my candid attributes, I am also a very good-humored person and kind heart. Very open minded and supportive of social issues.

#### What I Did 
* Select dashboard functionality as well as the unit testing.
* Assist in the writting of the readme.
* Assist in the writting of the SRS such as the use cases. 
* Compiling the video and the creation of graphics such as the logo.

# Development Specifics

## File Organization

The following shows the file structure of the complete React application:

```
├── public
└── src
   ├── assets
   ├── components
   │   ├── App
   │   ├── Dashboard
   │   └── Panel
   ├── globals
   ├── helpers
   └── tests
```

The purpose of each folder is listed below:

| Folder       | Content & Purpose                                                                                     |
|--------------|-------------------------------------------------------------------------------------------------------|
| `public`     | Public output files that contains the build application and is not of any concern during development. |
| `src`        | Source files which contains the succeeding folders.                                                   |
| `assets`     | Non-source code related items.                                                                        |
| `components` | React components. See below for further details.                                                      |
| `globals`    | Resources that can be applied globally throughout the web application.                                |
| `helpers`    | Files accompanying other classes or components.                                                       |
| `tests`      | All unit testing files are placed in this folder.                                                     |


## Filename Conventions

### React Components

Each reach components is contained within its own folder. The name of the folder and main JavaScript file is the name of the component and starts with a capital letter. Each component folder contains a package.json file that indicates the entry point of each component.

### CSS Files

CSS that pertains to all components of the system is placed in globals/globals.css If not, then the .css file should be placed within the component folder with the name of the component.

### Test Files

All test files should have the name of the file on which tests are conducted along with a ".test." extension.

## Coding Standards

All coding standards are enforced with ESLint. These standards are listed here for completeness.

### Naming Conventions

All standard React conventions are in place. E.g. all components start with a capital letter and custom hook functions start with a `use` prefix.
Only single quotes are used.

## GitHub Workflow

Gitflow workflow is employed to the fullest extent. Therefore, our master branch will only ever contain working code and every commit to the master branch contains the version number of the application. The master branch is accompanied with a develop branch that is used during development. A feature is added by branching from the develop branch which is then merged back to develop. Hotfixes can branch from master and merge back to master.

### Naming Conventions

All branch names have each word separated with a dash ("-") character.

