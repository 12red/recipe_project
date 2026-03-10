const jwt = require('jsonwebtoken')
const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
});

const userAuth = async (request, response, next) => {

    try{
    const token = request.headers.authorization;
    console.log(token);
    if(!token) {
      return response.status(400).send({ 'message': 'Token is not provided' });
    }
    const bearerToken = token.split(' ')[1]
    const decoded =  jwt.verify(bearerToken, process.env.JWT_SECRET,);
    console.log(decoded.role);

  
    if(decoded.role === 'UUOOBET' || decoded.role === 'AA00BET' ) {
  
    const res = await pool.query('SELECT * FROM bet_yaferaw_production.users WHERE id = $1',[decoded.userId]);
        if(!res.rows[0]) {
            return response.status(404).send({ 'message': 'The token you provided is invalid' });
          }
          request.user = { id: decoded.userId,
        intid: decoded.intid };
          next();

}
}

catch (error) {
    console.log(error)
    return res.status(500).send({
        error: [{
            'msg': "Server Issue"
        }]
    })
}

}
const adminAuth = async (request, response, next) => {

    try{
        const token = request.headers.authorization;
        console.log(token);
        if(!token) {
          return response.status(400).send({ 'message': 'Token is not provided' });
        }
        const bearerToken = token.split(' ')[1]
        const decoded =  jwt.verify(bearerToken, 'shhhhh');
        console.log(decoded.role);
    
      
        if(decoded.role === 'AA00BET' ) {
      
        const res = await pool.query('SELECT * FROM bet_yaferaw_production.users WHERE id = $1',[decoded.userId]);
            if(!res.rows[0]) {
                return response.status(404).send({ 'message': 'The token you provided is invalid' });
              }
              request.user = { id: decoded.userId,
                intid: decoded.intid };
                next();
    
    }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            error: [{
                'msg': "Server Issue"
            }]
        })
    }
}

module.exports = {
    userAuth,
    adminAuth
}