const mysql = require('mysql');

/* eslint-disable no-console */

// TODO make a module parameter somehow
const DATABASE_URL = process.env.CLEARDB_DATABASE_URL;

const EXPIRE_TIME_IN_DAYS = 5;
const HOURS_BETWEEN_EXPIRY_CHECKS = 12;

const SQL = {
  INSURE_TABLE: 'CREATE TABLE IF NOT EXISTS json ' +
    ' (id VARCHAR(20) PRIMARY KEY, json TEXT, ' +
    '  lastUpdate TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW())',
  FIND_ID: 'SELECT id FROM json WHERE id=:id',
  FETCH_JSON: 'SELECT json FROM json WHERE id=:id',
  FETCH_ALL: 'SELECT * FROM json',
  INSERT_JSON: 'INSERT INTO json (id, json) VALUES (:id, :json)',
  REPLACE_JSON: 'REPLACE INTO json (id, json) VALUES (:id, :json)',
  UPDATE_JSON: 'UPDATE json SET json=:json WHERE id=:id',
  DELETE_JSON: 'DELETE FROM json WHERE id=:id',
  EXPIRE_JSON: `DELETE FROM json WHERE lastUpdate < CURDATE() - INTERVAL ${EXPIRE_TIME_IN_DAYS} DAY`,
};

// eslint says don't use hasOwnProperty on the target object
const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

// don't break on parse errors
const tryToParse = (json) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('couldn’t parse', json, e);
    return undefined;
  }
};

// parse URL and create connection object
const dbURL = new URL(DATABASE_URL);
const dbConfig = {
  host: dbURL.host,
  user: dbURL.username,
  password: dbURL.password,
  database: dbURL.pathname.slice(1), // remove leading slash
};
console.log('dbConfig', dbConfig);

const pool = mysql.createPool(dbConfig);

const getConnection = () => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) reject(err);
    else {
      // support named parameters in queries
      const escape = connection.escape.bind(connection);
      // eslint-disable-next-line no-param-reassign
      connection.config.queryFormat = (query, values) => {
        if (!values) return query;
        return query.replace(/:(\w+)/g, (txt, key) => (
          hasProperty(values, key) ? escape(values[key]) : txt
        ));
      };
      resolve(connection);
    }
  });
});

// a generic query function that returns promises
const query = (sql, vars = {}) => new Promise((resolve, reject) => {
  // console.debug('query', sql, vars);
  getConnection().then((db) => db.query(sql, vars, (error, result) => {
    if (error) {
      console.warn('mysql query error', sql, error);
      reject(error);
    } else {
      resolve(result);
    }
  }));
});

// returns an id not already in the database
async function availableId() {
  const id = `${Math.floor(Math.random() * 900000 + 100000)}`; // 6 random digits
  const ids = await query(SQL.FIND_ID, { id });
  return ids.length > 0 ? availableId() : id;
}

const insertData = (id, data) => (
  query(SQL.INSERT_JSON, { id, json: JSON.stringify(data) })
);

const saveData = (id, data) => (
  query(SQL.REPLACE_JSON, { id, json: JSON.stringify(data) })
);

const getData = (id) => (
  query(SQL.FETCH_JSON, { id }).then((entries) => {
    if (entries.length === 0) throw new Error('Not found');
    const data = tryToParse(entries[0].json);
    if (!data) throw new Error('Invalid JSON');
    return data;
  })
);

const getAllData = (id) => (
  query(SQL.FETCH_ALL).then((rows) => {
    const result = {}
    rows.forEach((row) => {
      result[row.id] = tryToParse(row.json);
    });
    return result;
  })
);


//
// expiration
//
async function expireJson() { query(SQL.EXPIRE_JSON).then(); }


//
// initialize
//

query(SQL.INSURE_TABLE)
  .then(() => {
    console.log('mysql connected');
    expireJson().then();
    setInterval(expireJson, HOURS_BETWEEN_EXPIRY_CHECKS * 60 * 60 * 1000);
  })
  .catch((error) => { throw new Error(error); });


module.exports = {
  query, SQL, availableId, insertData, saveData, getData, getAllData,
};
