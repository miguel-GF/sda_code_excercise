const db = require('./db');
const helper = require('../helpers/helper');
const config = require('../config/database');

async function getAddresses(){
  const rows = await db.query(
    `
    SELECT * FROM addresses
    ORDER BY id ASC
    `
  );
  
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}

async function getAddressName(address){
    const rows = await db.query(
      `
      SELECT * FROM addresses
      WHERE address = '${address}'
      `
    );
    
    const data = helper.emptyOrRows(rows);
  
    return {
      data
    }
  }

async function insertAddress(address){
    const result = await db.query(
        `INSERT INTO addresses 
        (address, created_at)
        VALUES 
        ('${address.address}', '${address.created_at}')`
    );

    let message = 'Error in creating address';

    if (result.affectedRows) {
        message = 'Address created successfully';
    }

    return {
      'message': message,
      'id': result.insertId
    };
}

module.exports = {
    getAddresses,
    insertAddress,
    getAddressName,
}