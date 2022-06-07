const db = require('./db');
const helper = require('../helpers/helper');
const config = require('../config/database');

async function getDrivers(){
  const rows = await db.query(
    `
    SELECT * FROM drivers
    ORDER BY id ASC
    `
  );
  
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}

async function getDriverName(name){
    const rows = await db.query(
      `
      SELECT * FROM drivers
      WHERE name = '${name}'
      `
    );
    
    const data = helper.emptyOrRows(rows);
  
    return {
      data
    }
  }

async function insertDriver(driver){
    const result = await db.query(
        `INSERT INTO drivers 
        (name, created_at)
        VALUES 
        ('${driver.name}', '${driver.created_at}')`
    );

    let message = 'Error in creating driver';

    if (result.affectedRows) {
        message = 'Driver created successfully';
    }

    return {
      'message': message,
      'id': result.insertId
    };
}

module.exports = {
    getDrivers,
    insertDriver,
    getDriverName,
}