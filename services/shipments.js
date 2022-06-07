const db = require('./db');
const helper = require('../helpers/helper');
const config = require('../config/database');

async function getShipments(){
  const rows = await db.query(
    `
    SELECT * FROM shipments
    ORDER BY id ASC
    `
  );
  
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}

async function getShipment(address, driver){
    const rows = await db.query(
      `
      SELECT s.id FROM shipments AS s
      JOIN drivers AS d ON d.id = s.id_driver
      JOIN addresses AS a ON a.id = s.id_address
      WHERE d.name = '${driver}'
      AND a.address = '${address}'
      `
    );
    
    const data = helper.emptyOrRows(rows);
  
    return {
      data
    }
  }

  async function getShipmentByDriver(driverName){
    const rows = await db.query(
      `
      SELECT s.id FROM shipments AS s
      JOIN drivers AS d ON d.id = s.id_driver
      WHERE d.name = '${driverName}'
      `
    );
    
    const data = helper.emptyOrRows(rows);
  
    return {
      data
    }
  }

async function insertShipment(shipment){
    const result = await db.query(
        `INSERT INTO shipments 
        (id_driver, id_address, created_at, ss)
        VALUES 
        ('${shipment.id_driver}', '${shipment.id_address}', '${shipment.created_at}', '${shipment.ss}')`
    );

    let message = 'Error in creating shipment';

    if (result.affectedRows) {
        message = 'Shipment created successfully';
    }

    return {message};
}

module.exports = {
    getShipments,
    getShipment,
    insertShipment,
    getShipmentByDriver
}