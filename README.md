## 1. DTC GROUP 6 - INVSONA

## 1. Project Description
Invsona is an AI-powered persona creation web application, to help artists, developers, and other creative individuals overcome creative blocks by generating customized personas tailored to individual user's needs and preferences through user input.

## 3. Technologies and Resources Used
* CSS 3
* JavaScript ES6
* EJS Templating 3.1.9
* Bootswatch 5.0.0
* Bootstrap JS 5.3.0
* jQuery 3.5.1
* Node.js 20.1.0
* Express.js 4.18.2
* MongoDB 5.5
* Google Material Symbols 
* Google Material Icons
* Font Awesome 6.0.0
* OpenAI API - GPT-3.5 (text-davinci-003)

## 4. Contents of Folder
Content of the project folder:
Top level of project folder: 
├── .gitignore               # Git ignore file
├── app.js                   # Main file of the application
├── package.json             # NPM package file
├── Procfile                 # Qoddi deployment file
├── README.md                # Readme file
├── models                   # Folder that contains the database schemas
├── public                   # Folder that contains all images and icons
├── routes                   # Folder that contains routes
├── src                      # Folder that contains database, session & middleware connections
└── views                    # Folder that contains all ejs templates

It has the following subfolders and files:
├── models                   # Folder for database schemas
    ├── dialogue.js              # Schema for dialogue
    ├── persona.js               # Schema for persona
    └── user.js                  # Schema for user
├── public                   # Folder for static assets, such as images, styles, and theme scripts
    ├── images                   # Folder for images
    ├── src                      # Folder for client side js scripts
        ├── darkmode.js             # Script for dark mode
        └── secrets.js              # Script for secrets
    └── styles                   # Folder for styles
        ├── home.css                # Styles for home page
        ├── index.css               # Styles for index page
        ├── navbar.css              # Styles for navbar
        ├── profile.css             # Styles for profile page
        └── style.css               # Styles for all other pages
├── routes                    # Folder for routes
    ├── authorization.js         # Routes for authorization
    ├── dialogue.js              # Routes for dialogue
    ├── info.js                  # Routes for information pages (about, FAQ, etc.)
    ├── persona.js               # Routes for persona
    ├── profile.js               # Routes for profile
    └── saved.js                 # Routes for saved
├── src                      # Folder for database, session & middleware connections
    ├── database.js              # Database connection
    ├── middleware.js            # Middleware connection
    └── session.js               # Session connection
├── views                    # Folder for authorization, dialogue, error, partials, persona, profile and saved ejs files
    ├── authorization            # Folder for authorization contains templates for authorization
        ├── login.ejs               # Template for login page
        ├── logout.ejs              # Template for logout page
        ├── resetPassword.ejs       # Template for reset password page
        └── signup.ejs              # Template for signup page
    ├── dialogue                 # Folder for dialogue
        ├── dialogueFilters.ejs     # Template for dialogue filters
        ├── dialogueHome.ejs        # Template for dialogue home page
        ├── innerDialogueChat.ejs   # Template for inner dialogue chat
        ├── innerDialogueHome.ejs   # Template for inner dialogue home page
        ├── personaToPersonaChat.ejs # Template for persona to persona chat
        ├── personaToPersonaHome.ejs # Template for persona to persona home page
        ├── userPersonaChat.ejs     # Template for user persona chat
        └── userPersonaHome.ejs     # Template for user persona home page
    ├── error                    # Folder for error
        ├── 400-1.ejs               # Template for 400-1 page
        ├── 400.ejs                 # Template for 400 page
        ├── 401.ejs                 # Template for 401 page
        ├── 404.ejs                 # Template for 404 page
        └── 500.ejs                 # Template for 500 page
    ├── fromSavedPersona         # Folder for Persona to Dialogue templates 
        ├── dialogueFilters.ejs     # Template for dialogue filters from saved persona
        ├── dialogueHome.ejs        # Template for dialogue home page from saved persona
        ├── innerDialogueChat.ejs   # Template for inner dialogue chat from saved persona
        ├── innerDialogueHome.ejs   # Template for inner dialogue home page from saved persona
        ├── personaToPersonaChat.ejs # Template for persona to persona chat from saved persona
        ├── personaToPersonaHome.ejs # Template for persona to persona home page from saved persona
        ├── userPersonaChat.ejs     # Template for user persona chat from saved persona
        └── userPersonaHome.ejs     # Template for user persona home page from saved persona
    ├── partials                 # Folder for Basic standard starter for creating web pages
        ├── animated-bg-logo.ejs    # Template for animated background logo
        ├── emptybackbar.ejs        # Template for empty back bar
        ├── footer.ejs              # Template for footer
        ├── header-dialogue.ejs     # Template for header dialogue
        ├── header-internal.ejs     # Template for header internal
        ├── header-persona.ejs      # Template for header persona
        ├── header-start.ejs        # Template for header start containing imported modules and libraries
        ├── header.ejs              # Template for header containing css links
        └── navbar.ejs              # Template for navbar
    ├── persona                  # Folder for Persona related templates
        ├── generalPrompt.ejs       # Template for general prompt
        ├── newPrompt.ejs           # Template for new prompt
        ├── persona.ejs             # Template for persona home
        └── savedPrompt.ejs         # Template for saved prompt
    ├── profile                  # Folder for Profile related templates
        ├── aboutUs.ejs              # Template for about us page
        ├── accountSettings.ejs     # Template for account settings
        ├── faq.ejs                 # Template for FAQ page
        └── profile.ejs          # Template for profile
    └── saved                    # Folder for Saved
        ├── filters.ejs             # Template for saved filters
        ├── saved-dialogue.ejs      # Template for saved dialogues
        ├── saved-persona.ejs       # Template for saved personas
        └── saved.ejs               # Template for saved home
    ├── chat.ejs                 # Template for general chat
    ├── home.ejs                 # Template for home page
    └── index.ejs                # Template for index page

Within images subfolder there is another subfolder
├── images                   # Folder for images 
    ├── background               # Folder for background images used
        ├── bg-dark.jpg             # Background image for dark theme
        ├── bg.jpg                  # Background image for light theme
        ├── dialogue_bg_dark.jpg    # Background image for dark theme
        ├── dialogue_bg.jpg         # Background image for light theme
        ├── persona_bg_dark.jpg     # Background image for dark theme
        └── persona_bg.jpg          # Background image for light theme
    ├── cats                     # Folder for cat related images used as placeholders and secrets
        ├── cat_placeholder.png     # Placeholder image for cat
        ├── meow.mp3                # Secret sound
        ├── meow.mp4                # Secret video
        └── nyancat.png             # Secret image
    ├── invsona                     # Folder for invsona related logo and header
        ├── home.png                # Logo for home page - designed by Fiona
        ├── invsona-banner-white.png # Logo banner for dark theme - designed by Fiona
        ├── invsona-banner.png      # Logo banner - designed by Fiona
        └── invsona.png             # Logo for all other pages - designed by Fiona
    └── blue_bg.mp4                 # Background video for light theme

## 5. How to run the project:
Here are the steps ...
* Open terminal and enter "npm install" to install all necessary dependencies
* Enter necessary inputs into own env file
* Run the application by entering "nodemon app.js". app.js is the entry point.

##6: How to use the product:
* To use the persona feature: Open the Persona page from Home and view the various persona generator options. Enter the necessary input, press send and watch as the AI generates you a persona!

* To use the dialogue feature: Open the Dialogue page from Home and select "Create a new dialogue", which will lead to the Dialogue Filters page. The dialogue filters page displays the various types of dialogue you can choose from -- inner dialogue, user persona conversation and persona to persona converation. Select one, input the necessary values and watch as the AI creates you your own custom dialogue!

##7: Credits:
We would like to credit OpenAI for providing easy to read documentation so that we could implement AI in the core features of our application

##8: How did you use AI?
**We used AI to help create our app by testing out various inputs to produce our desired outputs. We used Chat-GPT to create our personas and dialogues so we could get an idea of what kind of outcome we could produce.

**We did not use any data sets, as the AI model we are using does not enable fine-tuning. It does, however, contain a vast amount of data that dates to June 2021

**We used the OpenAI API to create a Persona and Dialogue Generator. We used the OpenAI API - GPT-3.5 (text-davinci-003) model for chat completions. We prompted the AI by creating our own optimized prompts.

**We encountered limitations in how much text we can prompt into the API, so we had to create optimized prompts within a limited character count.

## 9. Known Bugs and Limitations
Here are some known bugs:
* Some logo images may not load correctly
* Filter function is currently not active
* Profile picture upload may produce errors


## 10. Features for Future
What we'd like to build in the future:
* Character Image Generator - using AI to create illustrations of the generated personas
* Filters - to filter out certain traits
* Clear chatlog button - to clear the chatlog
* Alert messages to notify users of errors, successful actions, confirmations, etc.


## 11. Contact Information
Fiona
school email : fwong98@my.bcit.ca
personal email : fwwong01@gmail.com
github: fwwong


Maddy
school email : mmaddelin@my.bcit.ca
personal email : maddelintan@gmail.com
github: maddelin


Mika
school email : mmanaligod3@mybcit.ca
personal email : mkmanaligod@gmail.com
github: mika-em

## 5. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* Open terminal and enter "npm install" to install all necessary dependencies
* Enter necessary inputs into own env file: OpenAI API key, Monogo
* Enter necessary inputs into own env file: OpenAI API key, MonogoB account
* Run the application by entering "nodemon app.js". app.js is the entry point.


## 5.1 Known Bugs and Limitations
Here are some known bugs:
* Some logo images may not load correctly
* Filter function is currently not active
* Profile picture upload may produce errors


## 5.2. Features for Future
What we'd like to build in the future:
* Character Image Generator - using AI to create illustrations of the generated personas
* Filters - to filter out certain traits
* Clear chatlog button - to clear the chatlog
* Alert messages to notify users of errors, successful actions, confirmations, etc.



## 7. Credits, References, Licenses
We would like to credit OpenAI for providing easy to read documentation so that we could implement AI in the core features of our application

## 8. Usage of AI
We used AI to help create our app by testing out various inputs to produce our desired outputs. We used Chat-GPT to create our personas and dialogues so we could get an idea of what kind of outcome we could produce.

We did not use any data sets, as the AI model we are using does not enable fine-tuning. It does, however, contain a vast amount of data that dates to June 2021

We used the OpenAI API to create a Persona and Dialogue Generator. We used the OpenAI API - GPT-3.5 (text-davinci-003) model for chat completions. We prompted the AI by creating our own optimized prompts.

We encountered limitations in how much text we can prompt into the API, so we had to create optimized prompts within a limited character count.

## 9. Contact Information
* Fiona Wong
* School email: fwong98@my.bcit.ca
* Personal email:  fwwong01@gmail.com
* githu: fwwong

* Maddelin Maddelin
* School email : mmaddelin@my.bcit.ca
* Personal email : maddelintan@gmail.com
* Github: maddelin

* Mika Manaligod
* School email : mmanaligod3@mybcit.ca
* Personal email : mkmanaligod@gmail.com
* Github: mika-em