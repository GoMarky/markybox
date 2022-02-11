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
    '^@/(.*)$': '<rootDir>/app/src/$1',
    '^@EXTENSIONS/(.*)$': '<rootDir>/extensions/$1',
    '^@UI/(.*)$': '<rootDir>/ui/src/$1',
    '^@TEST/(.*)$': '<rootDir>/test/$1',
    '^@CONFIG/(.*)$': '<rootDir>/config/$1',
  }
}
