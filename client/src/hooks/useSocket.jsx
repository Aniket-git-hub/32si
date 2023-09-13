import { useContext } from "react"
import {SocketContext} from "../context/SocketContext"

const useSocket = () => {
  return useContext(SocketContext)
}

export default useSocket