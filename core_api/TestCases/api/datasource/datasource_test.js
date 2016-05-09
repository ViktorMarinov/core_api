/* globals $ /
/ eslint-env node, dirigible */

var db = require('api/database');
var response = require('api/response');

var datasource = db.getDataSource(); // default
//var datasource = db.getNamedDataSource("name-of-the-datasource");

var connection = datasource.getConnection();
try {
    var statement = connection.prepareStatement("select * from DGB_FILES1 where FILE_PATH like ?");
    var i = 0;
    statement.setString(++i, "%");
    var resultSet = statement.executeQuery();
    while (resultSet.next()) {
        response.println("[path]: " + resultSet.getString("FILE_PATH"));
    }
    resultSet.close();
    statement.close();
} catch(e) {
	console.trace(e);
    response.println(e.message);
} finally {
    connection.close();
}

response.flush();
response.close();
