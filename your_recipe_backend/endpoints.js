const db = require('./queries')
const auth = require('./authentication')


module.exports = function (app) {
    app.post('/user', db.createUser)
    app.post('/login', db.login)
    app.post('/recipe',auth.userAuth, db.postRecipe)
    app.patch('/updateRecipe/recipeid',auth.userAuth, db.updateRecipe)
    app.patch('/updateUser/userid',auth.userAuth, db.updateUser)
    app.get('/user/id', auth.userAuth, db.getUserById)
    app.get('/account', auth.userAuth, db.getMyAccount)
    app.get('/get/users',auth.adminAuth, db.getUsers)
    app.delete('/delete/user',auth.adminAuth, db.deleteUser)
    app.get('/get/recipes',auth.adminAuth, db.getRecipes)
    app.get('/get/explore/recipe', db.getExploreRecipe)
    app.get('/recipe/id', db.getRecipeById)
    app.get('/recipes/userid',auth.userAuth, db.getMyRecipes)
    app.get('/recipes/saved',auth.userAuth, db.getMySavedRecipes)
    app.delete('/delete/recipe',auth.userAuth, db.deleteRecipe)
    app.post('/search/recipe', db.searchRecipe)

    
};

