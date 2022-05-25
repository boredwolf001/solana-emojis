import React, { useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import HeadComponent from '../components/Head'
import CreateProduct from '../components/createProduct'
import Product from '../components/Product'

// Constants
const TWITTER_HANDLE = 'manethye'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
  const { publicKey } = useWallet()
  const [products, setProducts] = useState([])
  const isOwner = publicKey
    ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY
    : false
  const [creating, setCreating] = useState(false)

  console.log(process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY)

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/fetchProducts')
      const data = await res.json()

      setProducts(data)
    }

    fetchProducts()
  }, [publicKey])

  const renderNotConnectedContainer = () => (
    <div>
      <img
        src='https://c.tenor.com/8-tAOVECWzwAAAAM/aang-avatar.gif'
        alt='emoji'
      />

      <div className='button-container'>
        <WalletMultiButton className='cta-button connect-wallet-button' />
      </div>
    </div>
  )

  const renderItemBuyContainer = () => (
    <div className='products-container'>
      {products.map(product => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  )

  return (
    <div className='App'>
      <HeadComponent />
      <div className='container'>
        <header className='header-container'>
          <p className='header'> 😳 Avatar's Emoji Store 😈</p>
          <p className='sub-text'>
            The only emoji store that accepts sh*tcoins
          </p>

          {isOwner && (
            <button
              className='create-product-button'
              onClick={() => setCreating(!creating)}>
              {creating ? 'Close' : 'Create Product'}
            </button>
          )}
        </header>

        <main>
          {creating && <CreateProduct />}
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>

        <div className='footer-container'>
          <img
            alt='Twitter Logo'
            className='twitter-logo'
            src='twitter-logo.svg'
          />
          <a
            className='footer-text'
            href={TWITTER_LINK}
            target='_blank'
            rel='noreferrer'>{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App
