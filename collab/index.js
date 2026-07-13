const { Server } = require('@hocuspocus/server');
const { Database } = require('@hocuspocus/extension-database');
const { Pool } = require('pg');

const PORT = parseInt(process.env.PORT || '3001');
const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT || 'http://backend:8080/api/editor/auth';
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: DATABASE_URL });

const server = Server.configure({
    port: PORT,
    extensions: [
        new Database({
            fetch: async ({ documentName }) => {
                const documentId = documentName.split('-')[1];
                const result = await pool.query(
                    'SELECT content FROM documents WHERE document_id = $1',
                    [documentId]
                );
                if (result.rows.length > 0 && result.rows[0].content) {
                    return Buffer.from(result.rows[0].content);
                }
                return null;
            },
            store: async ({ documentName, state }) => {
                const documentId = documentName.split('-')[1];
                const hex = Buffer.from(state).toString('hex');
                await pool.query(`
                    UPDATE documents
                    SET content = decode($1, 'hex'), updated_at = NOW()
                    WHERE document_id = $2
                `, [hex, documentId]);
            },
        }),
    ],
    async onAuthenticate({ token, documentName }) {
        const documentId = documentName.split('-')[1];
        console.log('documentName:', documentName, '| documentId:', documentId, '| URL:', `${AUTH_ENDPOINT}/${documentId}`);
        const response = await fetch(`${AUTH_ENDPOINT}/${documentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Authentication Error');
        }

        return response.json();
    },
});

server.listen();