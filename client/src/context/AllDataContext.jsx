import React, { createContext, useState } from 'react';

export const AllDataContext = createContext();

export const AllDataContextProvider = ({ children }) => {
    const [rivals, setRivals] = useState([]);
    const [friends, setFriends] = useState([]);
    const [games, setGames] = useState([]);
    const [notifications, setNotifications] = useState([])

    return (
        <AllDataContext.Provider value={{ rivals, setRivals, friends, setFriends, games, setGames, notifications, setNotifications }}>
            {children}
        </AllDataContext.Provider>
    );
};
