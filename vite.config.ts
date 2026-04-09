import { sveltekit } from '@sveltejs/kit/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [sveltekit(), vanillaExtractPlugin()],
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
})
