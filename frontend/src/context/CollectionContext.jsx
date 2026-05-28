import React, { createContext, useContext, useState, useEffect } from 'react';

const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
  const [collectionItems, setCollectionItems] = useState(() => {
    const localData = localStorage.getItem('userCollection');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('userCollection', JSON.stringify(collectionItems));
  }, [collectionItems]);

  const toggleCollection = (book) => {
    setCollectionItems((prevItems) => {
      const isAlreadyIn = prevItems.some((item) => item._id === book._id);
      if (isAlreadyIn) {
        return prevItems.filter((item) => item._id !== book._id);
      } else {
      return [...prevItems, book];
      }
    });
  };

 
  const isInCollection = (bookId) => {
    return collectionItems.some((item) => item._id === bookId);
  };

  return (
    <CollectionContext.Provider value={{ 
      collectionItems, 
      toggleCollection, 
      isInCollection 
    }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => useContext(CollectionContext);