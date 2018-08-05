// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	apiHost: 'http://fashionni.inexture.com/api/',
	firebase: {
		apiKey: 'AIzaSyAkNmYcQHlIUKXTxHLG1Yfa6G8E2OBe5UY',
		authDomain: 'fashionni-1522748465958.firebaseapp.com',
		databaseURL: 'https://fashionni-1522748465958.firebaseio.com',
		projectId: 'fashionni-1522748465958',
		storageBucket: 'fashionni-1522748465958.appspot.com',
		messagingSenderId: '209980155449'
	}
};
