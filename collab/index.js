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
                if (result.rows.length > 0) {
                    return Buffer.from(result.rows[0].content);
                }
                return null;
            },
            store: async ({ documentName, state }) => {
                const documentId = documentName.split('-')[1];
                await pool.query(`
                    INSERT INTO documents (document_id, content, updated_at)
                    VALUES ($1, $2, NOW())
                    ON CONFLICT (document_id)
                        DO UPDATE SET content = $2, updated_at = NOW()
                `, [documentId, Buffer.from(state)]);
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