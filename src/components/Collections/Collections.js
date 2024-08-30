import React, { useEffect, forwardRef, useImperativeHandle } from 'react';

import { useApp } from '../../store/AppContext';
import RegisteredEntries from '../../registeredEntries';
async function signIn(username, password) {
  const url =
    "https://ms2-dev.tacc.utexas.edu/tdis_authentication/api/auth/signin";
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Origin: "http://localhost:3000",
    Connection: "keep-alive",
    Referer: "http://localhost:3000/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
  };

  const body = JSON.stringify({ username, password });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

const Collections = forwardRef(({ username, loginTrigger }, ref) => {
  const context = useApp();
  const { state, dispatch } = context;
  const {isAuthenticated, collections, activeCollection, isLoading } = state;

  const activateCollection = (collection) => {
    dispatch({
      type: 'SET_ACTIVE_COLLECTION',
      payload: collection.tdis_identifier === activeCollection ? null : collection.tdis_identifier
    });
  };

  const refreshCollections = async () => {
    // Fetch collections logic here
  };
  
  useImperativeHandle(ref, () => ({
    refreshCollections
  }));

  const handleDeleteCollection = async (collectionId) => {
    const token = await signIn("wmobley", "ysdRk3Ry3ONDUzRk");
    const url = `https://ms2-dev.tacc.utexas.edu/redi-api/collections/${collectionId}`;
    console.log(collectionId);
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        dispatch({
          type: 'SET_COLLECTIONS',
          payload: collections.filter(
            (collection) => collection.tdis_identifier !== collectionId
          )
        });
      } else {
        console.error("Failed to delete collection");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const handleInputChange = (e) => {
    dispatch({
      type: 'SET_NEW_COLLECTION',
      payload: { ...state.newCollection, [e.target.name]: e.target.value }
    });
  };

  const createCollection = async () => {
    const token = await signIn("wmobley", "ysdRk3Ry3ONDUzRk");
    const url = "https://ms2-dev.tacc.utexas.edu/redi-api/collections/";

    const collectionData = {
      title: state.newCollection.title,
      description: state.newCollection.description,
      project: { id: 3, name: "TDIS_General_Metadata" },
      keyword_terms: ["Allocation:" + state.newCollection.allocation],
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collectionData),
      });

      if (response.ok) {
        const createdCollection = await response.json();
        dispatch({ type: 'SET_COLLECTIONS', payload: [...collections, createdCollection] });
        dispatch({ type: 'SET_SHOW_MODAL', payload: false });
        dispatch({
          type: 'SET_NEW_COLLECTION',
          payload: { title: "", description: "", allocation: "" }
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to create collection:", errorData);
      }
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };


  useEffect(() => {
    const fetchCollections = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      if (isAuthenticated && username) {
        const token = await signIn('wmobley', "ysdRk3Ry3ONDUzRk");
        const url = "https://ms2-dev.tacc.utexas.edu/redi-api/collections/";
        try {
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          const filteredCollections = data.filter(collection => 
            collection.user && collection.user.username === username
          );
          dispatch({ type: 'SET_COLLECTIONS', payload: filteredCollections });
        } catch (error) {
          console.error('Error fetching collections:', error);
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    };
    fetchCollections();
  }, [isAuthenticated, username, dispatch, loginTrigger]);
  if (!isAuthenticated) {
    return <div>Please log in to view collections.</div>;
  }

    return (
      <div className="collections-container">
        <h2>Collections 
          <button
            onClick={() => dispatch({ type: 'SET_SHOW_MODAL', payload: true })}
            className="create-collection-btn"
          >
            Add +
          </button>
        </h2>

        <div className="collection-cards">
          {collections.map((collection) =>
            activeCollection === null ||
            activeCollection === collection.tdis_identifier ? (
              <div
                key={collection.id}
                className={`metadata-card ${
                  activeCollection === collection.tdis_identifier ? "active" : ""
                }`}
                onClick={() => activateCollection(collection)}>
                <h3>
                  {collection.name}
                </h3>

                <div className="expanded-content">
                  <p>
                    <strong>Description:</strong> {collection.description}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(collection.created).toLocaleDateString()}
                  </p>
                  {state.showModal && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <h3>Create New Collection</h3>
                        <input
                          type="text"
                          name="title"
                          value={state.newCollection.title}
                          onChange={handleInputChange}
                          placeholder="Collection Name"
                        />
                        <textarea
                          name="description"
                          value={state.newCollection.description}
                          onChange={handleInputChange}
                          placeholder="Collection Description"
                        />
                        <input
                          type="text"
                          name="allocation"
                          value={state.newCollection.allocation}
                          onChange={handleInputChange}
                          placeholder="Collection Allocation"
                        />
                        <button onClick={createCollection}>Create</button>
                        <button onClick={() => dispatch({ type: 'SET_SHOW_MODAL', payload: false })}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {activeCollection === collection.tdis_identifier && (
                    <RegisteredEntries collectionName={collection.name} />
                  )}

                  {activeCollection && (
                    <button
                      onClick={() => dispatch({ type: 'SET_ACTIVE_COLLECTION', payload: null })}
                      className="back-btn"
                    >
                      Back to Collections
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteCollection(collection.tdis_identifier)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  }
);

export default Collections;