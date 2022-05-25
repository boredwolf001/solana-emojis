import React from 'react'
import useIPFS from '../hooks/useIPFS'

const IPFSDownload = ({ hash, filename, cta }) => {
  const file = useIPFS(hash, filename)

  console.log(hash, filename)
  return (
    <div>
      {file ? (
        <div className='download-component'>
          <a href={file} download={file} className='download-button'>
            {cta}
          </a>
        </div>
      ) : (
        <p>Downloading file...</p>
      )}
    </div>
  )
}

export default IPFSDownload
