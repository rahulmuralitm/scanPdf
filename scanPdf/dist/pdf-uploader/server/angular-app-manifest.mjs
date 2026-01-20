
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 9104, hash: '1adc226debac17a16290becace909bc3ec919b6dc14f87812d2f6e6b24a9e139', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 949, hash: '0f313f5de45b9d87e0cf220f2008598bc5b7042fc1949cdde6965b08405639fc', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 13128, hash: 'f3fd5b52d67c3a2b273a732c26c3207a78050d9bf1bc8904f4b15c72f9860911', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-Z5C2BKSZ.css': {size: 8746, hash: 'E8b1F2nSegU', text: () => import('./assets-chunks/styles-Z5C2BKSZ_css.mjs').then(m => m.default)}
  },
};
