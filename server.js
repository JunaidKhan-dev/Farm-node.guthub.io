const http = require('http')
const fs = require('fs')
const url = require('url')

const overviewTemplate = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')

const productData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const productDataJson = JSON.parse(productData)

const outputTemplate = (template, product) => {
  let outputHtml = template.replace(/{%ProductImage%}/g, product.image)
  outputHtml = outputHtml.replace(/{%ProductName%}/g, product.productName)
  outputHtml = outputHtml.replace(/{%ProductNutrients%}/g, product.nutrients)
  outputHtml = outputHtml.replace(/{%ProductQuantity%}/g, product.quantity)
  outputHtml = outputHtml.replace(/{%ProductPrice%}/g, product.price)
  outputHtml = outputHtml.replace(/{%ID%}/g, product.id)
  outputHtml = outputHtml.replace(/{%ProductDescription%}/g, product.description)
  outputHtml = outputHtml.replace(/{%ProductFrom%}/g, product.from)

  if (!product.organic) {
    outputHtml = outputHtml.replace(/{%NotOrganic%}/g, 'not-organic')
  }
  return outputHtml
}

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true)
  if (pathname === '/' || pathname === '/overview') {
    const templateForOverview = productDataJson.map((product) => outputTemplate(templateCard, product)).join('')
    // console.log(templateForOverview)
    res.writeHead(200, {
      'Content-type': 'text/html'
    })
    const overviewTemp = overviewTemplate.replace(/{%ProductCards%}/g, templateForOverview)
    return res.end(overviewTemp)
  } else if (pathname === '/product') {
    let cardTemp = productDataJson[query.id]
    const card = outputTemplate(productTemplate, cardTemp)
    return res.end(card)
  }

  return res.end('Page Not Found')
})

server.listen(3000, () => {
  console.log('server is running at 3000')
})
