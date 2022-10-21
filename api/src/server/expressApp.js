import { json, urlencoded } from 'body-parser'
import express from 'express'


const app = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.header('origin') || '*')
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, cache-control, pragma, Authorization, TimeZone, locale, currentUser, currentclient'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).send('')
    return
  }
  return next()
})

app.use('/ping', (req, res, next) => {
  res.status(200).send('ping ok')
})


export default app
