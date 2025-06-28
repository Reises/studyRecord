import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'studyRecord'

// https://vite.dev/config/
export default defineConfig({
  base: `/${repoName}/`,
  plugins: [react()],
})
