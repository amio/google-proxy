const express = require('express')
const serveMarked = require('serve-marked')
const proxy = require('http-proxy-middleware')

const app = express()

app.get('/', serveMarked('README.md', {
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
}))

app.use('/*', proxy({
  target: 'https://www.google.com',
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['cache-control'] = 'public, max-age=60, stale-while-revalidate=604800, stale-if-error=604800, s-maxage=604800'
  }
}))

app.listen(8000)
