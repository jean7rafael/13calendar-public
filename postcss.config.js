import autoprefixer from 'autoprefixer';

/* ===========================================================
   PREFIXOS CSS PARA OS NAVEGADORES SUPORTADOS
=========================================================== */

export default {
  plugins: [
    autoprefixer({
      overrideBrowserslist: [
        'last 4 Chrome versions',
        'last 4 Firefox versions',
        'last 4 Edge versions',
        'last 4 Safari versions',
        'last 4 Android versions',
        'last 4 ChromeAndroid versions',
        'last 4 FirefoxAndroid versions',
        'last 4 iOS versions',
      ],
    }),
  ],
};
