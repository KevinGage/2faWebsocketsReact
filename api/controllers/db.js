const sql = require('mssql');
const bcrypt = require('bcryptjs');

/* Define connection string */
const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database:process.env.DB_NAME,
  user:  process.env.DB_USER,
  password: process.env.DB_PASSWORD
}

/* create connection pool */
const pool = new sql.ConnectionPool(config)

pool.on('error', err => {
  // ... error handler
})

/* tblUsers table Queries */
module.exports.users = {
  /* Tries to select a user based on an email and password */
  login: async (email, password) => {
    if (!pool.connected) {
      await pool.connect()
    }
    try {
      const request = await pool.request()
      request.input('email', sql.VarChar, email)
      request.input('password', sql.VarChar, password)

      const result = await request.query(`SELECT id, email, password, firstname, lastname, active
        FROM tblUsers
        WHERE email = @email
        AND active = 1`)

      const user = result.recordset[0]
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          user.password = null;
          return user;
        }
      }
      return null;
    } catch (err) {
      throw(err)
    }
  },
  selectId: async (id) => {
    if (!pool.connected) {
      await pool.connect()
    }
    try {
      const request = await pool.request()
      request.input('id', sql.Int, id)
      const result = await request.query(`SELECT id, email, firstname, lastname, otp, active FROM tblUsers WHERE id = @id`)
      return result;
    } catch (err) {
      throw(err)
    }
  },
  updateTotpSecret: async (id, key) => {
    if (!pool.connected) {
      await pool.connect()
    }
    try {
      const request = await pool.request()
      request.input('id', sql.BigInt, id)
      request.input('key', sql.VarChar, key)

      const result = await request.query(`UPDATE tblUsers
        SET otp = @key
        WHERE id = @id`)

      return result;
    } catch (err) {
      throw(err)
    }
  }
}