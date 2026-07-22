const ENABLE_FONT_OPTIMIZATION = false
const FONT_VERSION = '1.522.0'
const FONT_PACKAGE_URL = `https://cdn.jsdelivr.net/npm/lxgw-wenkai-gb-web@${FONT_VERSION}/`
const FONT_LATEST_URL =
  'https://cdn.jsdelivr.net/npm/lxgw-wenkai-gb-web@latest/'

const FONT_DISPLAY_OVERRIDE = `
<script id="site-font-display">
  (function () {
    var fontPackageUrl = ${JSON.stringify(FONT_PACKAGE_URL)};

    for (var i = 0; i < document.styleSheets.length; i++) {
      var sheet = document.styleSheets[i];
      if (!sheet.href || sheet.href.indexOf(fontPackageUrl) !== 0) continue;

      try {
        for (var j = 0; j < sheet.cssRules.length; j++) {
          var rule = sheet.cssRules[j];
          if (rule.type === CSSRule.FONT_FACE_RULE) {
            rule.style.setProperty('font-display', 'optional');
          }
        }
      } catch (error) {
        // The original stylesheet remains usable if a browser denies CSSOM access.
      }
    }
  })();
</script>`

hexo.extend.filter.register('after_render:html', function (html) {
  if (!ENABLE_FONT_OPTIMIZATION) return html

  const pinnedFonts = html
    .replaceAll(FONT_LATEST_URL, FONT_PACKAGE_URL)
    .replace(
      /(<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/lxgw-wenkai-gb-web@1\.522\.0\/lxgwwenkaigb-(?:regular|medium)\/result\.css")>/g,
      '$1 crossorigin="anonymous">',
    )

  return pinnedFonts.replace('</head>', `${FONT_DISPLAY_OVERRIDE}\n</head>`)
})
