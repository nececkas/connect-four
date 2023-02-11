import { useEffect } from 'react'

import { socket } from './../index'

/**
 * Listens for any moves from the other player via the socket.
 */

const useReceiveMove = ({ handleMove }) => {

  useEffect(() => {
    socket.on('receive-move', handleMove)

    return () => socket.off('receive-move', handleMove)
  }, [socket])

}

export default useReceiveMove;