# DTC GROUP 6 - INVSONA

## 1. Project Description
Invsona is an AI-powered persona creation web application, to help artists, developers, and other creative individuals overcome creative blocks by generating customized personas tailored to individual user's needs and preferences through user input.

## 2. Names of Contributors
Fiona Wong
Maddelin Maddelin
Mika Manaligod


## 3. Technologies and Resources Used
* EJS Templating, Bootstrap
* Node.js, Express.js
* MongoDB
* OpenAI API 

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* Open terminal and enter "npm install" to install all necessary dependencies
* Enter necessary inputs into own env file
* Run the application by entering "nodemon app.js". app.js is the entry point.

## 5. Known Bugs and Limitations
Here are some known bugs:
* Some images may not load correctly

## 6. Features for Future
What we'd like to build in the future:
* Character Image Generator - using AI to create visual characters

## 7. Contents of Folder
Content of the project folder:

```
Top level of project folder: 
├── .gitignore               # Git ignore file
├── models                   # contains the database schemas
└── public                   # contains all images and icons
└── routes                   # contains routes
└── src                      # database, session & middleware connections
└── views                    # all ejs templates

It has the following subfolders and files:
├── public                   # Folder for images, styles and theme scripts
├── views                    # Folder for authorization, dialogue, error, partials, persona,
                             # profile and saved ejs files

Within subfolders, there is more subfolders
├── public                   # Folder for images, styles and theme scripts
└── images                   # Folder for images
└── src                      # Folder for scripts
└── styles                   # Folder for styles
├── views                    # Folder for authorization, dialogue, error, partials, persona,
|                            # profile and saved ejs files
└── authorization            # Folder for authorization contains templates for authorization
└── dialogue                 # Folder for dialogue
└── error                    # Folder for error
└── fromSavedPersona         # Folder for Persona to Dialogue templates 
└── partials                 # Folder for Basic standard starter for creating web pages
└── persona                  # Folder for Persona related templates
└── saved                    # Folder for Saved

With images subfolder there is another subfolder
├── images                   # Folder for images 
└── background               # Folder for background images used
└── cats                     # Folder for cat related images used as placeholders and secrets
└── invsona                  # Folder for invsona related logo and header


```


