module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  "transformIgnorePatterns": [
    "<rootDir>/node_modules/(?!(quill-mention)/)"
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  }
}
