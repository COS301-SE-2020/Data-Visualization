# Data Visualisation Generator

## Description

Big Data is an ever-growing source of information, with governments and corporations generating more Big Data than ever.
It proves to be extremely valuable for companies and governments to be able to extract trends and patterns from this data and use this information to better prepare and/or optimize any services they offer.

This repository represents the visualisation of Big Data. However, the catch comes in where, instead of manually creating these visualisations of Big Data, an Interactive Genetic Algorithm (IGA) will be implemented and let the user be able to select/choose the best visualisation of the given data, be it a graph/chart/scatter plot etc.

Developmet-Staging App: https://data-visualisation-dev.herokuapp.com/ <br />
Production App: https://data-visualisation-prod.herokuapp.com/

<details>
  <summary><b>Documentation</b></summary> <br>
   <a href="#">SRS Document</a><br>
</details>

<details>
  <summary><b>Details</b></summary> <br>
  
  [Project Management Tool](https://github.com/COS301-SE-2020/Data-Visualisation#workspaces/data-visualization-5ed11ab3600f3c0e9851753e/board?repos=266792939) ![ZenHub](https://i.imgur.com/Qqg8JhO.png)
  
</details>

<details>
  <summary><b>Installation Instructions</b></summary> <br>
   The React-App that can be found in the <b>data-visualisation-app/</b> directory.<br/>
   The Node.js server that serves the React-App and can be found in the <b>root (/)</b> directory.<br/>
  <br/>
 
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

</details>
  
<details>
  <summary><b>Testing Instructions</b></summary> <br>
  The React-App that can be found in the <b>data-visualisation-app/</b> directory.<br/>
  The Node.js server that serves the React-App and can be found in the <b>root (/)</b> directory.<br/>
<br/>

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

</details>

<details>
  <summary><b>Collaborators</b></summary> <br>
  
> <b> Elna Pistorius</b>
* <a href="https://elnapistorius.github.io/my-website/index.html"> Individual github.io profile </a>
* <details>
   <summary><b>What I Did </b></summary>
   <br>
   </details>
> <b> Byron Tomkinson </b>
* <a href="https://byrongt12.github.io/profile/"> Individual github.io profile </a>
* <details>
   <summary><b>What I Did </b></summary>
   <br>
   </details>
> <b> Marco Lombaard </b>
* <a href="https://FlameReynard.github.io"> Individual github.io profile </a>
* <details>
   <summary><b>What I Did </b></summary>
   <br>
   </details>
> <b> Phillip Shulze </b>
* <a href="https://phillipstemmlar.github.io"> Individual github.io profile </a>
* <details>
   <summary><b>What I Did </b></summary>
   <br>
   </details>
> <b> Gian Uys </b>
 * <a href="https://mruys.github.io"> Individual github.io profile </a>
  * <details>
     <summary><b>What I Did </b></summary>
     <br>
</details>

</details>

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

