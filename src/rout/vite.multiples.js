
const path = require("path");

export default {
  build: {
    rollupOptions: {
      input: {
        'Home': path.resolve( __dirname, '/'    ),
        'Info': path.resolve( __dirname, 'Info' ),
        'Know': path.resolve( __dirname, 'Know' ),
        'Wise': path.resolve( __dirname, 'Wise' )
      }
    }
  }
}
