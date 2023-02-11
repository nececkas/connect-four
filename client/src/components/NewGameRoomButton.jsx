import { socket } from './../index'

/**
 * The JoinRoom component handles the basic functionality that allows 
 * the Main Player to create and join a room (via WebSockets) in which 
 * they can play a Connect Four with an Invited Player.
 * 
 */

const NewGameRoomButton = ({
  onStartGame,
  setRoom
}) => {

  const createNewGameRoom = (e) => {
    e.preventDefault()

    /**
     * Creates a room in which the game can be played.
     * Using Math.random is not ideal, since that's only 
     * pseudo-random.  So basically, this feature would functionality
     * would need to be changed for this app to actually be able to 
     * scale and support multiple games.  But right now it LOOKS like
     * it's generating truly unique ids
     */
    const room = `${Math.random()}`.split('.')[1]

    // Main Player joins the newly room.
    socket.emit('join-room', room)

    // Performs stanard setup steps for starting game
    onStartGame(room)
  }

  return (
    <div className='centering-container'>
      <button
        className='new-game--button'
        onClick={createNewGameRoom}
      >
        Create New Game Room
      </button>
    </div>

  );
}

export default NewGameRoomButton;