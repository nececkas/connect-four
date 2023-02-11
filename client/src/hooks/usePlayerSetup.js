import { useState, useEffect } from 'react'

import { socket } from './../index'

/**
 * This hook runs one on initial load of App and does these things:
 * 
 * 1) Designates the Main player and Invited player based on pathname
 * 2) For the Invited Player:
 *    - Joins the socket room initialized that was by the Main Player
 *    - Calls handleStartGame, which:
 *        + Sets the game as in progess
 *        + Sets the Invited player as the first player to move
 * 
 * The hook returns player, which is either "Main" or "Invited"
 */

const usePlayerSetup = ({ handleStartGame }) => {
  const [player, setPlayer] = useState(null)

  useEffect(() => {
    const pathname = window.location.pathname

    if (pathname === '' || pathname === '/') {
      // If user went to blank domain, they are the Main player
      setPlayer('Main')
    } else {
      // If user pasted link with pathname, they are the Invited player
      setPlayer('Invited')
      // And so must join the socket room created by the Main player
      // (see JoinRoom for generation of the link with socket room)
      const room = pathname.slice(1)
      socket.emit('join-room', room)
      // Call handleStartGame
      handleStartGame(room)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return player
}

export default usePlayerSetup