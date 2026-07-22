const MENU_LABELS = {
  Home: '首页',
  Archives: '归档',
  Tags: '标签',
  Categories: '分类',
  About: '关于'
};

const HEAD_OVERRIDES =
  '<style id="site-layout-stability">html { scrollbar-gutter: stable; }</style>';

hexo.extend.filter.register('after_render:html', function (html) {
  let renderedHtml = html;

  for (const [english, chinese] of Object.entries(MENU_LABELS)) {
    renderedHtml = renderedHtml.replace(
      new RegExp(`(<a class="nav-link"[^>]*>)${english}(</a>)`, 'g'),
      `$1${chinese}$2`
    );
  }

  return renderedHtml.replace('</head>', `${HEAD_OVERRIDES}\n</head>`);
});
