import { handleClientScriptLoad } from 'next/script'
import products from './products.json'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { itemID } = req.body

    if (!itemID) return res.status(400).send('ItemID is required')

    const product = products.find(item => item.id === itemID)

    if (product.hash !== null || product.filename !== nul) {
      res.status(200).json({ hash: product.hash, filename: product.filename })
    } else {
      res.status(404).Send('Not found')
    }
  } else {
    res.status(400).send(`Method ${req.method} is not allowed`)
  }
}
