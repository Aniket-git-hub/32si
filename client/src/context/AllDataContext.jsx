import { createContext, useState } from "react";

export const AllDataContext = createContext();

export const AllDataContextProvider = ({ children }) => {
  const [rivals, setRivals] = useState([]);
  const [friends, setFriends] = useState([]);
  const [games, setGames] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pageLoaded, setPageLoaded] = useState([]);
  // Unread chat messages per sender id, and the friend whose chat is open (their messages count as read).
  const [unreadMessages, setUnreadMessages] = useState({});
  const [openChatWith, setOpenChatWith] = useState(null);

  const resetData = () => {
    setRivals([]);
    setFriends([]);
    setGames([]);
    setNotifications([]);
    setOnlineFriends([]);
    setHasMore(true);
    setPage(1);
    setPageLoaded([]);
    setUnreadMessages({});
    setOpenChatWith(null);
  };

  return (
    <AllDataContext.Provider
      value={{
        rivals,
        setRivals,
        friends,
        setFriends,
        games,
        setGames,
        notifications,
        setNotifications,
        onlineFriends,
        setOnlineFriends,
        resetData,
        hasMore,
        setHasMore,
        page,
        setPage,
        pageLoaded,
        setPageLoaded,
        unreadMessages,
        setUnreadMessages,
        openChatWith,
        setOpenChatWith,
      }}
    >
      {children}
    </AllDataContext.Provider>
  );
};
