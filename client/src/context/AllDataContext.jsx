import React, { createContext, useState } from "react";

export const AllDataContext = createContext();

export const AllDataContextProvider = ({ children }) => {
  const [rivals, setRivals] = useState([]);
  const [friends, setFriends] = useState([]);
  const [games, setGames] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [page, setPage] = useState(1);

  const resetData = () => {
    setRivals([]);
    setFriends([]);
    setGames([]);
    setNotifications([]);
    setOnlineFriends([]);
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
        totalUsersCount,
        setTotalUsersCount,
        page,
        setPage
      }}
    >
      {children}
    </AllDataContext.Provider>
  );
};
