import React, { createContext, useState } from 'react';

export const AllDataContext = createContext();

export const AllDataContextProvider = ({ children }) => {
    const [rivals, setRivals] = useState([]);
    const [friends, setFriends] = useState([]);
    const [games, setGames] = useState([]);

    return (
        <AllDataContext.Provider value={{ rivals, setRivals, friends, setFriends, games, setGames }}>
            {children}
        </AllDataContext.Provider>
    );
};
