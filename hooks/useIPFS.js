import { useState, useEffect } from 'react'

const useIPFS = (hash, filename) => {
  const [file, setFile] = useState(null)

  useEffect(() => {
    // setFile(`https://gateway.ipfscdn.io/ipfs/${hash}/${filename}`)
    setFile('https://gateway.ipfscdn.io/ipfs/' + hash + '/' + filename)
  }, [])

  return file
}

export default useIPFS
