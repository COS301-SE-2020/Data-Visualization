# Data Visualization Generator

![Data Visualization Generator](https://raw.githubusercontent.com/COS301-SE-2020/Data-Visualisation/master/img/com.png)

## Description

Big Data is an ever-growing source of information, with governments and corporations generating more Big Data than ever.
It proves to be extremely valuable for companies and governments to be able to extract trends and patterns from this data and use this information to better prepare and/or optimize any services they offer.

This repository represents the visualisation of Big Data. However, the catch comes in where, instead of manually creating these visualisations of Big Data, an Interactive Genetic Algorithm (IGA) will be implemented and let the user be able to select/choose the best visualisation of the given data, be it a graph/chart/scatter plot etc. 

## Links
* [Production Application](https://data-visualisation-prod.herokuapp.com)

* [Development Stage](https://data-visualisation-dev.herokuapp.com)

## Project Management

* Project Management tool can be found [here](https://github.com/COS301-SE-2020/Data-Visualisation#workspaces/data-visualization-5ed11ab3600f3c0e9851753e/board?repos=266792939). ![ZenHub](https://i.imgur.com/EQ663Fn.png)

## Demos

<details> 
<summary><b>Demo 1</b></summary>

##### Video Demo

* [Demo 1 Video Link](https://drive.google.com/drive/folders/1lFnGthxIPIuZHPTG4wG-Ffy6VKT2yWHK?usp=sharing)

##### Documentation

* SRS Document can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/admin/documentation/Demo1_SRS.pdf).

</details>

<details> 
<summary><b>Demo 2</b></summary>

##### Video Demo

* [Demo 2 Video Link](https://drive.google.com/drive/folders/1lFnGthxIPIuZHPTG4wG-Ffy6VKT2yWHK?usp=sharing)

##### Documentation

* SRS Document can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/admin/documentation/Demo2_SRS.pdf).

* Coding Standards Document can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/admin/documentation/Demo2_CodingStandards.pdf).

* User Manual can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/develop/documentation/Demo2_UserManual.pdf).

* API Manual can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/admin/documentation/Demo2_API_Manual.pdf).

* Sprint Planning can be found [here](https://github.com/COS301-SE-2020/Data-Visualization/blob/admin/documentation/Demo2_Sprint%20Planning.pdf).

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

#### Contribution 
###### Demo 1
* Integration of react page-components and state management.
* Edit Dashboard functionality. 
* Client-Side requests to REST-endpoint 
* Database Setup
* Heroku Setup.
###### Demo 2
* 

### Elna Pistorius

[Profile Page](https://elnapistorius.github.io/my-website/index.html)

> I am currently enrolled at the University of Pretoria, doing a BSc degree in Computer Science. 
> I have a passion for learning new things and being challenged. I love nature and spending time outside with my beagle.

#### Contribution 
###### Demo 1
* SRS documentations.
* The edit suggestions page.
* The express node server to set up our endpoints.
* Application styling.
###### Demo 2
* SRS documentation
* API Manual
* Backend: Set up and the functionality of the roots and controllers

### Byron Tomkinson

[Profile Page](https://byrongt12.github.io/profile/)

 > I am student at the University of Pretoria, currently studying in my final year of Computer Science. Some of my skills include conflict resolution, problem solving, rapport building and reliability. I am open minded when it comes to different ideas that are shared and helpful wherever I can be. I have a passion for learning new things, especially in the field of human anatomy and physiology. I am crazy about Jesus and my hobbies include running, gymming and football.

#### Contribution 
###### Demo 1
* Add dashboard functionality.
* Add dashboard unit testing.
* Assist in the writing of the SRS such as the traceability matrix. 

### Marco Lombaard

[Profile Page](https://FlameReynard.github.io)

> I am currently studying third year Computer Science at the University of Pretoria. Our work provided many challenges, requiring us to come up with effective and efficient solutions to different problems - developing our critical thinking and problem-solving abilities. We have also been exposed to a variety of programming languages which we were expected to code in fluently, which allowed me to build a collection of programming languages.

#### Contribution 
###### Demo 1
* Display dashboard functionality and a bit of EditDashboard + unit tests for both and a unit test for DisplayGraph.
* CircleCI setup.

###### Demo 2

### Gian Uys

[Profile Page](https://mruys.github.io)

> Confident and ambitious third-year student from the University of Pretoria. I align myself with positive, exuberant people that can challenge my way of thought. I, however, enjoy all different types of people from different backgrounds, religion and culture. I believe human interaction is the most effective way to enrich one’s personality. My duties are done with extreme care and attention to detail. I thrive for perfection, orderliness and quality. Alongside my candid attributes, I am also a very good-humored person and kind heart. Very open minded and supportive of social issues.

#### Contribution 
###### Demo 1
* Select dashboard functionality as well as the unit testing.
* Assist in the writting of the readme.
* Assist in the writting of the SRS such as the use cases. 
* Compiling the video and the creation of graphics such as the logo.

###### Demo 2
