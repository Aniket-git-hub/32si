import React, { createContext, useState } from "react";

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

  const resetData = () => {
    setRivals([]);
    setFriends([]);
    setGames([]);
    setNotifications([]);
    setOnlineFriends([]);
    setHasMore(true);
    setPage(1);
    setPageLoaded([]);
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
      }}
    >
      {children}
    </AllDataContext.Provider>
  );
};
