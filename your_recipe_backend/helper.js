const jwt = require('jsonwebtoken');
const path = require('path')
const bcrypt = require('bcryptjs')

const { Pool } = require('pg')



const connectionString = process.env.DATABASE_URL;
// var dir = path.join(__dirname, 'uploads');

const pool = new Pool({
    connectionString,
});

  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
const hashPassword = (password) =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  }
  /**
   * comparePassword
   * @param {string} hashPassword 
   * @param {string} password 
   * @returns {Boolean} return True or False
   */
const comparePassword = (hashPassword, password)=> {
    return bcrypt.compareSync(password, hashPassword);
  }
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
   const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }
  /**
   * Gnerate Token
   * @param {string} id
   * @param {string} roleid
   * @param {int} intid  
   * @returns {string} token
   */
  const generateToken = (id, roleid, intid) =>{
    const token = jwt.sign({
      userId: id,
      role: roleid,
      intid: intid
    },
    process.env.JWT_SECRET, { expiresIn: '7d' }
    );
    return token;
  }

module.exports = {
 generateToken,
 hashPassword,
 comparePassword
}

