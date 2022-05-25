import React, { useMemo, useState, useEffect } from 'react'
import { Keypair, Transaction } from '@solana/web3.js'
import { findReference, FindReferenceError } from '@solana/pay'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { InfinitySpin } from 'react-loader-spinner'
import IPFSDownload from './ipfsDownload'
import { addOrder, hasPurchased } from '../lib/api'

const STATUS = {
  Initial: 'Initial',
  Submitted: 'Submitted',
  Paid: 'Paid',
}

const Buy = ({ itemID }) => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const orderID = useMemo(() => Keypair.generate().publicKey, [])

  const [status, setStatus] = useState(STATUS.Initial)
  const [loading, setLoading] = useState(false)

  const [item, setItem] = useState(null)

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  )

  const processTransaction = async () => {
    setLoading(true)
    const txResponse = await fetch('../api/createTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    })
    const txData = await txResponse.json()

    const tx = Transaction.from(Buffer.from(txData.transaction, 'base64'))
    try {
      const txHash = await sendTransaction(tx, connection)
      console.log(
        `Transaction sent: https://solanascan.io/tx/${txHash}?cluster=devnet`
      )

      setStatus(STATUS.Submitted)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status == STATUS.Submitted) {
      setLoading(true)
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID)
          console.log('Finding tx reference', result.confirmationStatus)
          if (
            result.confirmationStatus === 'confirmed' ||
            result.confirmationStatus === 'finalized'
          ) {
            clearInterval(interval)
            setStatus(STATUS.Paid)
            addOrder(order)
            setLoading(false)
            alert('Why did u buy this LMAO')
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null
          }

          console.error('Unknown error', e)
        } finally {
          setLoading(false)
        }
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [status])

  useEffect(() => {
    async function fetchItem() {
      const res = await fetch('../api/fetchItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemID,
        }),
      })

      const data = await res.json()

      setItem(data)
    }

    fetchItem()
  }, [publicKey, itemID])

  useEffect(() => {
    async function checkPurchased() {
      const purchased = await hasPurchased(publicKey, itemID)
      if (purchased) {
        setStatus(STATUS.Paid)
        console.log('Address has already purchased this item!')
      }
    }

    checkPurchased()
  }, [publicKey, itemID])

  if (!publicKey)
    return (
      <div>
        <p>You need to connect your wallet to communicate with avatar</p>
      </div>
    )

  if (loading) return <InfinitySpin color='gray' />

  return (
    <div>
      {status === STATUS.Paid ? (
        <IPFSDownload
          filename={item?.filename}
          hash={item?.hash}
          cta='Download emojis'
        />
      ) : (
        <button
          disabled={loading}
          className='buy-button'
          onClick={processTransaction}>
          Buy now 🠚
        </button>
      )}
    </div>
  )
}

export default Buy
