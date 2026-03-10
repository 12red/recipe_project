
const { response, request } = require('express');
const { Pool } = require('pg')
const helper = require('./helper')
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
});


const createUser = async (request, response) => {

        const { firstname, lastname, password, email, imageid, roles = 'UUOOBET'} = request.body
            try{
                const res =  await pool.query('INSERT INTO bet_yaferaw_production.users (firstname, lastname, password, email, imageid, roles) VALUES ($1, $2, $3, $4, $5, $6) returning id', [firstname, lastname, helper.hashPassword(password)
                    ,email, imageid, roles]);

                await response.status(200).json(res.rows[0]);

            }
            catch(error){
                console.log(error);

            }
    
}

const getMyAccount = async (request, response) => {

    try{
        const res = await pool.query('SELECT * FROM bet_yaferaw_production.users WHERE id = $1', [request.user.id]);
        response.status(200).json(res.rows[0]);
    }

    catch(error){
        console.log(error);
    }

}


const getUserById = async (request, response) => {
    const userid  = request.param("userid");
    try{
   const res = await pool.query('SELECT * FROM bet_yaferaw_production.users WHERE id = $1', [userid]);
    response.status(200).json(res.rows[0]);

    }
    catch(error){
        await response.send(500).error(SocketException);
        await response.send(503).error(UniqueEmail);
    }
  
}


const getUsers = async (request, response) => {
    try{
    const res = await pool.query('SELECT * FROM bet_yaferaw_production.users');
        response.status(200).json(res.rows);
    }
    catch(error){
        await response.send(500).error(SocketException);
        await response.send(503).error(UniqueEmail);
    }
    
}



const updateUser = async (request, response) =>{
    const { firstname, lastname, imageid, totallikes, recipescreated, savedrecipes} = request.body
// getExplorer(request.user.intid);
    try{
        const res = await pool.query('UPDATE bet_yaferaw_production.users SET firstname= $1, lastname= $2, imageid= $3, totallikes= $4, recipescreated= $5, savedrecipes= $6 WHERE id = $7', [firstname, lastname,imageid, totallikes, recipescreated, savedrecipes, request.user.id]);
        console.log(res); 
        // response.status(200).json(res.rows[0]);
        await response.status(200).json(res.rows[0]);
    }
        catch(error){
            console.log(error);
            // await response.send(500).error(SocketException);
            // await response.send(503).error(UniqueEmail);
    
        }
}

const login = (request, response) =>{
    const {email, password} = request.body
         pool.query('Select * From bet_yaferaw_production.users WHERE email = $1',[email],(error,results)=>{
             if(!helper.comparePassword(results.rows[0].password, password)) {
                response.status(400).send({msg: "enter correct password"});
                response.sendStatus(error.status);              
            }
            else if(error){
                // response.sendStatus(error.status);
response.sendStatus(error.status);              
            }
            console.log(results.rows);

            const token = helper.generateToken(results.rows[0].id, results.rows[0].roles, results.rows[0].intid);
            return response.status(200).send({token});
         });
        
    }


const deleteUser = async (request, response) => {
        const userid = request.param("userid");
        try{
            const res = await pool.query('Delete from bet_yaferaw_production.users where id = $1', [userid]);
            await response.status(200).send({msg: "deleted user successfully"});
        }
        catch(e){
            console.log(e);
        }
}
//Recipe Requests
const postRecipe = async (request, response) =>{
    //const userid  = request.param("userid");
    const { categories , recipename, directions, ingredients, serves, cookingtime, imageid} = request.body

    try{
  const res = await   pool.query('INSERT INTO bet_yaferaw_production.recipe (categories, recipename, directions, ingredients, serves, cookingtime, userid, imageid ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning id', 
  [categories, recipename, directions, ingredients, serves, cookingtime, request.user.id, imageid]);
      
  await response.status(200).json(res.rows[0].id);
}
    catch(error){
        await response.send(500).error(SocketException);
        await response.send(503).error(UniqueEmail);

    }
}

const updateRecipe = async (request, response) =>{


    const recipeid = request.param("recipeid");
    console.log("noo recipe", recipeid);
    const {usersliked} = request.body
    try{
    const resp = await pool.query('SELECT intid from bet_yaferaw_production.recipe WHERE id = $1', [recipeid]);
    console.log(`here is resp ${resp.rows[0].intid}`);
    if(resp.rows[0].intid != null){
    // await saveEvents(request.user.intid, resp.rows[0].intid);
    const res = await pool.query('UPDATE bet_yaferaw_production.recipe SET usersliked= $1 WHERE id = $2', [usersliked, recipeid]);
    console.log(res); 
    await response.status(200).json(res.rows[0]);
    }
    else{
        console.log(resp);
    }
    // response.status(200).json(res.rows[0]);
}
    catch(error){
        console.log(error);
        response.status(500).send();

    }
}

const getRecipes = (request, response) =>{
    const recipeid = request.param("recipeid");
    console.log("noo", recipeid);

    

    pool.query('SELECT * FROM bet_yaferaw_production.recipe', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows);
    });
}

const getRecipeById = async (request, response) => {
    const recipeid = request.param("recipeid");
    console.log("noo", recipeid);
    pool.query('SELECT * FROM bet_yaferaw_production.recipe WHERE id = $1', [recipeid], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows[0]);
    });
}

const getMyRecipes = async(request, response) => {
    try{
  const res =  await pool.query('SELECT * FROM bet_yaferaw_production.recipe WHERE userid = $1', [request.user.id]); 
        await response.status(200).json(res.rows);
        console.log(res)
    }
    catch(e){
        console.log(e);
    }

}


const getMySavedRecipes = async (request, response) => {
    try{
        const res = await pool.query("SELECT r.id , categories, recipename, directions, ingredients, serves, cookingtime, userid, usersliked, r.imageid FROM bet_yaferaw_production.users u INNER JOIN bet_yaferaw_production.recipe r ON u.id = $1 AND r.id = ANY(u.savedrecipes)", [request.user.id]);
        await response.status(200).json(res.rows);
        console.log(res)
    }

    catch(error){
        console.log(error)
    }
}

// const adminDeleteView = async (request, response) => {
//     try{
//         const res = await pool.query('SELECT roles,  r.id , categories, recipename, directions, ingredients, serves, cookingtime, userid, usersliked, r.imageid FROM bet_yaferaw_production.users u INNER JOIN bet_yaferaw_production.recipe r ON u.id = $1', [request.user.id]);
//         await response.status(200).send(deleteRes.rowCount, {msg: "deleted user successfully"});
//         }
    
//     catch(e){
//         console.log(e);
//     }
// }

const deleteRecipe = async (request, response) => {
    const recipeid = request.param("recipeid");

    try{
        const res = await pool.query('Delete from bet_yaferaw_production.recipe WHERE id= $1 AND userid = $2', [recipeid, request.user.id]);
        await response.status(200).send({msg: "deleted recipe successfully"});
    }
    catch(e){
        console.log(e);
    }
}

const searchRecipe =  async (request, response) =>{
const {keywords} = request.body; 
console.log("list", keywords);
try{
  const res = await pool.query(
        'Select *,  array_length (usersliked, 1) len from bet_yaferaw_production.recipe WHERE ingredients @> $1 ORDER BY len ASC LIMIT 10 ', [keywords]);
        console.log(res);
        response.status(200).json(res.rows);
  }
  catch(error){
      console.log(error)
  }
}

const getExploreRecipe =  async (request, response) =>{
    try{
      const res = await pool.query(
            'Select *,  array_length (usersliked, 1) len from bet_yaferaw_production.recipe ORDER BY len DESC LIMIT 20');
            console.log(res);
            response.status(200).json(res.rows);
      }
      catch(error){
          console.log(error)
      }
    }
    


module.exports = {
    // createUserImage,
    createUser, 
    getUsers,
    getUserById,
    getMyAccount,
    updateUser,
    login,
    postRecipe,
    updateRecipe,
    getRecipes,
    getRecipeById,
    getMyRecipes,
    searchRecipe,
    getMySavedRecipes,
    getExploreRecipe,
    deleteUser,
    deleteRecipe, 
    
    // createRecipeImage,

}
