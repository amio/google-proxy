const fs = require('fs')
const path = require('path')
const http = require('http')
const proxy = require('http-proxy-middleware')
const serveMarked = require('serve-marked')

const serveIndex = serveMarked(
  fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8'),
  {
    title: 'Google Proxy',
    inlineCSS: `
      @import "https://fonts.googleapis.com/css?family=Merriweather";
      @import "https://sindresorhus.com/github-markdown-css/github-markdown.css";
      body { margin: 0 }
      .markdown-body { max-width: 720px; margin: 0 auto; padding: 0 1em }
      .markdown-body h1 { text-align: center; font: 2.2em/5em Merriweather, serif }
      .markdown-body h1 { width: 100vw; margin: 0 0 0 calc(50% - 50vw); background-color: #F9F9F9 }
      .markdown-body h1 + p { text-align: center; margin: -11px 0 4em 0; }
      h2, h3, h4, h5 { font-family: Merriweather, serif }
    `,
    beforeHeadEnd: '<meta name="viewport" content="width=device-width">'
  }
)

const serveProxy = proxy({
  target: 'https://www.google.com',
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['cache-control'] = 'public, max-age=60, stale-while-revalidate=604800, stale-if-error=604800, s-maxage=604800'
  }
})

const main = (req, res) => {
  switch (req.url) {
    case '/':
      return serveIndex(req, res)
    default:
      return serveProxy(req, res)
  }
}

module.exports = main

if (require.main === module) {
  const port = process.env.PORT || 3000
  http.createServer(main).listen(port)
}
