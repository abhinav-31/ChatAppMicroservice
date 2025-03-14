import { useContext } from "react";
import WebSocketContext from "../context/WebSocketContext";
import AuthFlowContext from "../context/AuthFlowContext";
import GlobalContext from "../context/GlobalContextProvider";
import BackdropContext from "../context/BackdropContext";

export const useWebSocketContext = () => useContext(WebSocketContext);
export const useAuthFlow = () => useContext(AuthFlowContext);
export const useGlobalContext = () => useContext(GlobalContext);
export const useBackdropContext = () => useContext(BackdropContext);