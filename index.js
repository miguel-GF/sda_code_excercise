const express = require('express');
const moment = require('moment');
const serviceDriver = require('./services/drivers');
const serviceShipment = require('./services/shipments');
const serviceAddress = require('./services/addresses');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

let inputs = [];
readline.on('line', function(line) {    
    inputs.push(line);

    if (line === 'exit') {
        console.log('Bye!');
        readline.close();   
        process.exit();
    }
    if (inputs.length == 1) {
        console.log('Addresses:', line);
    }
    else {
        console.log('Drivers:', line);
    }

    if (inputs.length == 2) {
        main(inputs[0], inputs[1]);
        inputs = [];
    }
});


async function main(addresses, drivers) {
    await mainAction(addresses, drivers);
}

async function mainAction(addresses, drivers) {
    if (addresses != null && drivers != null) {
        let addressesArray = addresses.split(";");
        drivers = drivers.split(";");
        console.log(drivers);
        addressesArray.map((address, index) => {
            console.log(`Address ${index + 1}`);
            checkExistData(address, drivers);
            console.log('---------');
        })        
    }
    else {
        console.log('Wrong params, try again');
    }
}

async function checkExistData(address, drivers) {
    let existDriver = await findDriver(drivers);
    let existAddress = await findAddress(address);
    let existShipment = await findShipment(drivers[0]);

    // IF NOT EXISTS INSERT TO TABLE DRIVERS
    if (existDriver) {
        console.log(`Driver ${drivers[0]} already exists`);
    }
    else {
        var driver = [];
        driver.push(await serviceDriver.insertDriver({
            name: drivers[0],
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }));
        existDriver = driver;
        console.log(existDriver.message);
    }

    // IF NOT EXISTS INSERT TO TABLE ADDRESSES
    if (existAddress) {
       console.log(`Address ${address} already exists`);
    }
    else {    
        var add = [];
        add.push(await serviceAddress.insertAddress({
            address: address,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
        }));
        existAddress = add;
        console.log(existAddress.message);
    }

    
    if(existShipment) {
        console.log(`Driver ${drivers[0]} already has a shipment`);
        drivers.splice(0,1);
    }
    else {
        let isEvenAddress = isEven(address);
        calculateSS(drivers, address, isEvenAddress, existDriver, existAddress);
    }
}

function isEven(address) {
    let length = address.length;
    if ((length % 2) == 0) {
        return true; 
    }
    else {
        return false;
    }
}

async function calculateSS(drivers, address, isEvenAddress, existDriver, existAddress) {
    let vowels = 'aeiouAEIOU';
    let ss = ''
    if((address.length == drivers[0].length) || isEvenAddress) {
        console.log('its even address or same length as driver');
        let regularExpression = new RegExp(`[${vowels}]`,'gi');
        let result = drivers[0].match(regularExpression);
        let countVowelsDriver = 0;
        if(result) {
            countVowelsDriver = result.length;
        }
        console.log('Total vowels: ' + countVowelsDriver);
        
        ss = countVowelsDriver * 1.5;
        console.log('SS: ' + ss);
    }
    else {
        console.log('its odd address');
        console.log(drivers);
        let regularExpression =  new RegExp(`(?![${vowels}])[a-zA-Z]`, 'gi');
        let result = drivers[0].match(regularExpression);  
        let countConsonantsDriver = 0;
        if(result) {
            countConsonantsDriver = result.length;
        }
        console.log('Total consonants: ' + countConsonantsDriver);

        ss = countConsonantsDriver * 1;
        console.log('SS: ' + ss);
    }

    await insertShipment(existDriver, existAddress, ss);
    drivers.splice(0,1);
}

async function findDriver(drivers) {
    return serviceDriver.getDriverName(drivers[0]).then((res) => {
        if(res.data.length > 0) {
            return res.data;
        }

        return false;

    }).catch(e => {
        console.log(e);
    })
}

async function findShipment(driver) {
    return serviceShipment.getShipmentByDriver(driver).then((res) => {
        if(res.data.length > 0) {
            return res.data;
        }

        return false;

    }).catch(e => {
        console.log(e);
    })
}

async function findAddress(address) {
    return serviceAddress.getAddressName(address).then((res) => {
        if(res.data.length > 0) {
            return res.data;
        }

        return false;

    }).catch(e => {
        console.log(e);
    })
}

async function insertShipment(driver, address, ss) {
    return serviceShipment.insertShipment({
        id_driver: driver[0].id,
        id_address: address[0].id,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        ss: ss
    }).then((res) => {        
        console.log(res);
    }).catch(e => {
        console.log(e);
    })
}