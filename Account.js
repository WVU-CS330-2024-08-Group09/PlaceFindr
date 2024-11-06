//import to load environment variables from .env file
require('dotenv').config();

const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

//TODO: Create encryption function for password storage
//TODO: Connect to the account/register HTML pages functionally

//ignore this part
/*
    //Use Azure VM Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        port: process.env["db_port"],
        database: process.env["db_database"],
        authentication: {
            type: 'azure-active-directory-msi-vm'
        },
        options: {
            encrypt: true
        }
    }

    //Use Azure App Service Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        port: process.env["db_port"],
        database: process.env["db_database"],
        authentication: {
            type: 'azure-active-directory-msi-app-service'
        },
        options: {
            encrypt: true
        }
    }
*/


//START TESTING FUNCTIONS:
//devResetTable();

//Old, removed variation of emailStored / validLogin
//console.log("Starting userExists...");
//userExists('test user', 35);

//console.log("Starting newUser...");
//newUser('test user after reset', 132);

//console.log("Starting deleteUser...");
//deleteUser('test user', 9912);

//console.log("All done!");
//END TESTING FUNCTIONS


async function emailStored(email){
    try{
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(
            `SELECT *
            FROM [dbo].[Account]
            WHERE [Email]='${email}'`
        );

        const rowExists = resultSet.recordset.length !== 0;

        //START DEBUGGING SECTION
        // console.log(`Row Exists? - ${rowExists}`);

        // // output column headers
        // var columns = "";
        // for (var column in resultSet.recordset.columns) {
        //     columns += column + ", ";
        // }
        // console.log("%s\t", columns.substring(0, columns.length - 2));

        // // ouput row contents from default record set
        // resultSet.recordset.forEach(row => {
        //     console.log("%s, %s, %s, %s, %s, %s, %s, %s, %s", 
        //         row.UserID, row.FirstName, row.LastName, row.Email, row.EncryptedPassword, 
        //         row.MinTemp, row.MaxTemp, row.Precipitation, row.Humidity);
        // });
        //END DEBUGGING SECTION

        // close connection only when we're certain application is finished
        poolConnection.close();
        console.log("Connection closed.");

        //return true if at least one column matches the email
        return rowExists;
    }
    catch(err){
        //log error message and close connection
        console.log(err.message);
        poolConnection.close();
        console.log("Connection closed.");
    }
}

async function validLogin(email,password){
    try{
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(
            `SELECT *
            FROM [dbo].[Account]
            WHERE [Email]='${email}' AND [EncryptedPassword]=${password}`
        );

        let fullName = "";

        const rowExists = resultSet.recordset.length !== 0;

        //START DEBUGGING SECTION, FULLNAME ASSIGNMENT NOT INCLUDED
        // console.log(`Row Exists? - ${rowExists}`);

        // // output column headers
        // var columns = "";
        // for (var column in resultSet.recordset.columns) {
        //     columns += column + ", ";
        // }
        // console.log("%s\t", columns.substring(0, columns.length - 2));

        // // output row contents from default record set and store the user's full name to return
        resultSet.recordset.forEach(row => {
            // console.log("%s, %s, %s, %s, %s, %s, %s, %s, %s", 
            //     row.UserID, row.FirstName, row.LastName, row.Email, row.EncryptedPassword, 
            //     row.MinTemp, row.MaxTemp, row.Precipitation, row.Humidity);
            fullName = row.FirstName + " " + row.LastName
        });
        //END DEBUGGING SECTION, FULLNAME LEFT IN REGARDLESS

        // close connection only when we're certain application is finished
        poolConnection.close();
        console.log("Connection closed.");

        //return true if at least one column matches the email and password, and the user's name to use in the site
        return [rowExists, fullName];
    }
    catch(err){
        //log error message and close connection
        console.log(err.message);
        poolConnection.close();
        console.log("Connection closed.");
    }
}

async function newUser(firstName,lastName,email,password){
    try{
        var poolConnection = await sql.connect(config);

        console.log("Inserting rows into the Table...");

        //insert new user info to the Account table
        await poolConnection.request().query(
            `INSERT INTO [dbo].[Account] (FirstName, LastName, Email, EncryptedPassword)
            VALUES ('${firstName}', '${lastName}', '${email}', ${password})`
        );

        // close connection only when we're certain application is finished
        poolConnection.close();
        console.log("Connection closed.");
    }
    catch(err){
        //log error message and close connection
        console.log(err.message);
        poolConnection.close();
        console.log("Connection closed.");
    }
}

async function deleteUser(email,password){
    try{
        var poolConnection = await sql.connect(config);

        console.log("Deleting row from the Table...");

        //insert new user info to the Account table
        await poolConnection.request().query(
            `DELETE FROM [dbo].[Account] WHERE Email='${email}' AND EncryptedPassword=${password}`
        );

        // close connection only when we're certain application is finished
        poolConnection.close();
        console.log("Connection closed.");
    }
    catch(err){
        //log error message and close connection
        console.log(err.message);
        poolConnection.close();
        console.log("Connection closed.");
    }
}

async function devResetTable() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("DEVELOPER ONLY: Resetting the Table...");
        await poolConnection.request().query(
            `DELETE FROM [dbo].[Account]`
        );
        await poolConnection.request().query(
            `DBCC CHECKIDENT('Account', RESEED, 0)`
        );

        // close connection only when we're certain application is finished
        poolConnection.close();
        console.log("Connection closed.");
    } catch (err) {
        console.error(err.message);
        poolConnection.close();
        console.log("Connection closed.");
    }
}

async function connectAndQuery() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(
            `SELECT *
            FROM [dbo].[testing]`);

        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // ouput row contents from default record set
        resultSet.recordset.forEach(row => {
            console.log("%s\t%s", row.num, row.word);
        });

        // close connection only when we're certain application is finished
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

export {emailStored, validLogin, newUser};