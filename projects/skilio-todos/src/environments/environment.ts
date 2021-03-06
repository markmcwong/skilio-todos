// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const packageJson = require('../../../../package.json');

export const environment = {
  appName: 'Skilio Todo',
  envName: 'DEV',
  production: false,
  test: false,
  i18nPrefix: '',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome: packageJson.dependencies['@fortawesome/fontawesome-free'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript'],
    cypress: packageJson.devDependencies['cypress'],
    eslint: packageJson.devDependencies['eslint']
  },
  firebaseConfig: {
    apiKey: 'AIzaSyBwp2h2pSH-LOmABsEm2zgr-HqcQnDOg8o',
    authDomain: 'skilio-todo.firebaseapp.com',
    projectId: 'skilio-todo',
    storageBucket: 'skilio-todo.appspot.com',
    messagingSenderId: '690651932859',
    appId: '1:690651932859:web:ab2bce815e8ff63e1da19e',
    measurementId: 'G-RKWWT82312'
  }
};
