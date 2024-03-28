const { getConnectionManager } = require('typeorm');

async function clearCache() {
    const connectionManager = getConnectionManager();
    connectionManager.connections.forEach(connection => {
        connection.queryResultCache.clear();
    });
    console.log('TypeORM cache cleared.');
}

clearCache().catch(error => {
    console.error('Error clearing TypeORM cache:', error);
});
