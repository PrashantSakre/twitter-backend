import { Client } from "cassandra-driver";

// Configure the connection options
export const cassandraClient = new Client({
	contactPoints: [process.env.CASSANDRA_CONTACT_POINT || "192.168.0.5:9042"], // Replace with your Cassandra node IPs
	localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER, // Required parameter
	// Authentication
	// authProvider: new cassandra.auth.Plai  nTextAuthProvider('username', 'password')
});

async function startCassandra() {
	await cassandraClient.connect();
	console.log("Successfully connected to Apache Cassandra!");

	// Create a Table
	await cassandraClient.execute(`
    CREATE TABLE IF NOT EXISTS url_shortener.short_url_clicks (
      short_code text PRIMARY KEY,
      clicks counter
    );
  `);
}
startCassandra();

// async function run() {
//   try {

//     // 3. Create a Keyspace (Database)
//     await client.execute(`
//       CREATE KEYSPACE IF NOT EXISTS url_shortener
//       WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
//     `);

//     // 4. Create a Table
//     await client.execute(`
//       CREATE TABLE IF NOT EXISTS url_shortener.short_urls  (
//         short_code text PRIMARY KEY,
//         id uuid,
//         original_url text,
//         expires_at timestamp,
//         created_at timestamp
//       );
//     `);

//     await client.execute(`
//         CREATE TABLE IF NOT EXISTS url_shortener.short_url_clicks (
//             short_code text PRIMARY KEY,
//             clicks counter
//         );
//     `);
//     console.log('Keyspace and table verified.');

//     async function incrementClicks(short_code:string){
//         const query = `UPDATE url_shortener.short_url_clicks SET clicks = clicks + 1 WHERE short_code = ?`
//         await client.execute(query, [short_code], { prepare: true });
//     }

//     // 5. Insert data using parameterized queries (prevents injection)
//     async function insertShortCode(short_code:string, original_url: string, expires_at: Date) {
//         const insertQuery = 'INSERT INTO url_shortener.short_urls (id, short_code, original_url, expires_at) VALUES (?, ?, ?, ?)';
//         const uuid = cassandra.types.Uuid.random();
//         const params = [uuid, short_code, original_url, new Date()];
//         await client.execute(insertQuery, params, { prepare: true });
//         console.log('Data successfully inserted.');
//     }

//     // 6. Read data
//     async function getShorturlByCode(short_code:string) {
//         const selectQuery = 'SELECT short_code, id, original_url, created_at FROM url_shortener.short_urls WHERE short_code = ?';
//         return await client.execute(selectQuery, [short_code]);
//     }
//     async function getShorturlClicksByCode(short_code:string) {
//         const selectQuery = `SELECT short_code, clicks FROM url_shortener.short_url_clicks WHERE short_code = ?`;
//         return await client.execute(selectQuery, [short_code]);
//     }

//     insertShortCode('thisisa', 'http://www.google.com', new Date());
//     await getShorturlByCode('thisisa').then(d => {
//         d.rows.forEach(row => {
//             console.log({
//                 short_code: row.short_code,
//                 id: row.id.toString(),
//                 original_url: row.original_url,
//                 created_at: row.created_at,
//             })
//         });
//     })
//     await incrementClicks('thisisa');
//     getShorturlClicksByCode('thisisa').then(d => {
//         d.rows.forEach(row => {
//             console.log({
//                 short_code: row.short_code,
//                 clicks: row.clicks.toNumber()
//             })
//         });
//     })

//   } catch (err) {
//     console.error('Database operation failed:', err);
//   } finally {
//     // 7. Always close the connection pool when your app shuts down
//     // await client.shutdown();
//     // console.log('Connection closed.');
//   }
// }
