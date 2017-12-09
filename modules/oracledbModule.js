var oracledb = require('oracledb');

var connectionAttrs = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: 'cis450db.cct52rn5ie4j.us-east-1.rds.amazonaws.com:1521/ORCL'
}

function doRelease(connection) {
  connection.close(function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Successfully closed Oracle DB connection');
    }
  });
}

module.exports = {
  handleDatabaseConnection: function(query, variables, callback) {
    oracledb.getConnection(connectionAttrs, function(err, connection) {
      console.log('Attempting to connect to Oracle DB');
      if (err) {
        console.error(err.message);
        return;
      }
      console.log('Successfully connected to Oracle DB');
      connection.execute(query, variables, function(err, result) {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        callback(result);
        doRelease(connection);
      });
    });
  }
};
