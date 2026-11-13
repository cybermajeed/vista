import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { generateInteriorImage } from './server/visualizerApi.ts'

dotenv.config()

function visualizerApiPlugin(): Plugin {
  return {
    name: 'visualizer-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/visualize/health' && req.method === 'GET') {
          const hasKey = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ status: 'ok', hasApiKey: hasKey }))
          return
        }

        if (req.url === '/api/visualize' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })

          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}')
              if (!data.image) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Missing room image data' }))
                return
              }

              const result = await generateInteriorImage(data)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, ...result }))
            } catch (error: any) {
              console.error('Visualizer API Error:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  success: false,
                  error: error?.message || 'Failed to generate room visualization',
                  missingKey: error?.message?.includes('GEMINI_API_KEY')
                })
              )
            }
          })
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizerApiPlugin()],
})
