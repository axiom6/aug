
let lazyLoading  = (name) => () => {
  console.log( 'Router', name, `../../vue/${name}.vue` )
  return import(               `../../vue/${name}.vue` ); }

let lazyLoadinh = ( name, index=false ) => () => import(`comp/${name}${index ? '/index' : ''}.vue`)

let lazyLoadini = ( name, chunk="none", index=false ) => () => {

  let url = index ? `comp/${name}/index.vue` : `comp/${name}.vue`;
  url = (chunk!=="none") ? `/* webpackChunkName: ${chunk} */ `+url : url;

  return import( url )
    .then(module => {
      module.default(); })
    .catch(error => {
      if( error===false){}
      console.log('Router url not found', url ); } );
}

if( lazyLoading===false && lazyLoadinh===false && lazyLoadini===false ) {}