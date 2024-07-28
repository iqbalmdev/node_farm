// file
const fs = require('fs')
const http = require('http')
const url = require('url')
// blockng way of reading file sync
const inputText = fs.readFileSync("./txt/input.txt", "utf-8")

const outputText = `This is a sample output from text fie ${inputText} at the tome on ${Date.now()}`

fs.writeFileSync("./txt/output.txt", outputText)

// non-blocking way of reading files async
const readFileAsync = fs.readFile("./txt/input.txt", "utf-8", (err, data1) => {
    fs.readFile("./txt/output.txt", "utf-8", (err, data2) => {
        fs.writeFile("./txt/new.txt", `${data1} ${data2}`, "utf-8", err => {
            console.log("file written successfully")
        })
    })
})
// function

const replacetemplte = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%ID%}/g, product.id)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%FROM%}/g, product.from)
    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic")
    }

    return output
}



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const datObj = JSON.parse(data)
// server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8")
const tempProudct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8")
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8")

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)
    const ul = url.parse(req.url)

    if (pathname === "/" || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardsHtml = datObj.map(el => replacetemplte(tempCard, el)).join('')
        const updatedObject = tempOverview.replace(/{%PROUDCT_CARDS%}/g, cardsHtml)
        res.end(updatedObject)
    } else if (pathname === '/product') {
        const data = datObj[query.id]

        const productOutput = replacetemplte(tempProudct, data)
        res.end(productOutput)
    } else if (pathname === '/api') {
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', ((err, data) => {
            const newData = JSON.parse(data)
            console.log(newData)
            res.writeHead(200, {
                'Content-type': 'application/json'
            })
            res.end(data)
        }))
    }
    else {
        res.writeHead(404, {
            'Content-type': "text/html"
        })
        res.end("<h1>Page not found<h1/>")
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log("app is running in port 8000")
})