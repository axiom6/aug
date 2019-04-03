
import Vue        from '../../libs/vue/vue.esm.browser.js'
import VuexI18n   from '../../libs/vue/vuex-i18n.esm.js'
import { Store }  from '../store/Store.js'
import br         from './br.js' // add translations directly
import en         from './en.js'
import es         from './es.js'

VuexI18n.install( Vue, Store );
Vue.i18n.add('br', br);
Vue.i18n.add('en', en);
Vue.i18n.add('es', es);
Vue.i18n.set('en');      // set the start locale to use
Vue.i18n.fallback('en'); // set fallback for non-translated strings


