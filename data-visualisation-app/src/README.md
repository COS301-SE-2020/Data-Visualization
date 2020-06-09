# Data Visualization Generator Development 


## File Organization

The following shows the file structure of the complete react application:

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

## Naming Conventions

All standard React conventions are in place. E.g. all components start with a capital letter hook functions start with `use` prefix.
Only single quotes are used.