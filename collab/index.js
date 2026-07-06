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
                const result = await pool.query(
                    'SELECT content FROM documents WHERE name = $1',
                    [documentName]
                );
                if (result.rows.length > 0) {
                    return Buffer.from(result.rows[0].content);
                }
                return null;
            },
            store: async ({ documentName, state }) => {
                await pool.query(`
          INSERT INTO documents (name, content, updated_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (name)
          DO UPDATE SET content = $2, updated_at = NOW()
        `, [documentName, Buffer.from(state)]);
            },
        }),
    ],
    async onAuthenticate({ token, documentName }) {
        const roomId = documentName.split('-')[1];

        const response = await fetch(`${AUTH_ENDPOINT}?token=${encodeURIComponent(token)}&roomId=${roomId}`);

        if (!response.ok) {
            throw new Error('Authentication Error');
        }

        return response.json();
    },
});

server.listen();