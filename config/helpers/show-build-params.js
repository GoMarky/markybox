const os = require('os');

const EnvironmentVariable = require('./../environment-variable');

function showBuildParams() {
  // Build stats

  console.info(`
  NODE_ENV:         ${ JSON.stringify(EnvironmentVariable.nodeEnv) }
  IS_TEST:          ${ JSON.stringify(EnvironmentVariable.isTest) }
  IS_PRODUCTION:    ${ JSON.stringify(EnvironmentVariable.isProduction) }
  IS_DEV:           ${ JSON.stringify(EnvironmentVariable.isDev) }

  BUILD_NUMBER:     ${ JSON.stringify(EnvironmentVariable.buildNumber) }
  APP_VERSION:      ${ JSON.stringify(EnvironmentVariable.appVersion) }
  PUBLIC_PATH:      ${ JSON.stringify(EnvironmentVariable.publicPath) }
  NODE_VERSION:     ${ EnvironmentVariable.nodeVersion }
  `,
  );

  // Tech stats

  console.log('Total Memory:', Math.round(os.totalmem() / 1024 / 1024), 'MB');
  console.log('Free Memory:', Math.round(os.freemem() / 1024 / 1024), 'MB');
  console.log('CPUs:', JSON.stringify(os.cpus().map(v => v.model)));
  console.log('Load avg:', JSON.stringify(os.loadavg()));
}

module.exports = showBuildParams;
