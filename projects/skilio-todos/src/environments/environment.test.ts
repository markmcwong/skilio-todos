const packageJson = require('../../../../package.json');

export const environment = {
  appName: 'Skilio Todo',
  envName: 'TEST',
  production: false,
  test: true,
  i18nPrefix: '',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome:
      packageJson.dependencies['@fortawesome/fontawesome-free-webfonts'],
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
