import { useState } from "react"
import { Experience } from "./components/Experience/Experience"
import { RoomDialog } from "./components/RoomDialog/RoomDialog"

function App() {
  const [roomId, setRoomId] = useState<string | null>(null);

  return (
    <>
      {!roomId && <RoomDialog onJoinRoom={setRoomId} />}
      {roomId && <Experience roomId={roomId} />}
    </>
  )
}

export default App
