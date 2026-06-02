// jest.config.ts
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
    dir: './',
})

const config = {
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
    testEnvironment: 'jest-environment-jsdom',
    // 1. Explicitly match only actual test files
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    // 2. Map path aliases explicitly so Jest understands the '@/' prefix
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
}

export default createJestConfig(config)