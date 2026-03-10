# Your Recipe 

Your Recipe(Bet Yaferaw, in Amharic) is a mobile application aiming to make cooking convenient by enabling users easily discover recipes. It targets individuals who lead a wellness-oriented lifestyle with healthy eating habits that involve eating freshly cooked home meals. The app lets users scan ingredients at hand and helps them discover the top ranking user generated recipes. The search functionality provides another way of finding recipes simply by entering ingredients through text. It also lets users engage with posted recipes and have top rated content by default. Overall, our project eases the process of preparing meals at home by providing users with the recipes based on ingredients at hand.


## App Features

- Everyone who has the system can explore recipes.
- Users can add their own recipes, view and edit their own recipes.
- Users can give comments and rate other people's recipes.
- Users can share recipes on different messaging platforms.
- Users can search recipes
- Users can create a profile,view,edit and delete their profile information.
- Recipe library


## Tech Stack & Architecture

This project follows a modular architecture to separate concerns between the UI, data management, and image processing:

* **Frontend ([your_recipe](https://github.com/12red/recipe_project/your_recipe)):** Built with **Flutter**, providing a cross-platform mobile experience. It handles the user interface, recipe discovery, and camera integration.
* **Backend ([your_recipe_backend](https://github.com/12red/recipe_project)):** A **Node.js** server that manages the RESTful API, database operations, user authentication, and social features like ratings and comments.
* **Recipe Scanner ([your_recipe_scanner](https://github.com/12red/recipe_project)):** A specialized **Python** service utilizing **Image Recognition** and transformation to identify ingredients from user-uploaded photos.

## Contributors 

- Rediet Ayele 
- Samra Kahsay
- Zewetir Ayele


