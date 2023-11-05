const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData
    });
  
    useEffect(() => {
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true
        };
      default:
        throw new Error();
    }
  };
  
  function App() {
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState("dog");
    const brewerySearchURL = "https://api.openbrewerydb.org/v1/breweries/search";
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
        `${brewerySearchURL}?query=dog`, []
    );
  
    return (
      <Fragment>
        <form
          onSubmit={event => {
            doFetch(`${brewerySearchURL}?query=${query}`);
  
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>
  
        {isError && <div>Something went wrong ...</div>}
  
        {isLoading ? (
          <div>Loading ...</div>
        ) : (
          <ul className="group-list">
            {data.map(item => (
              <li className="group-list-item" key={item.objectID}>
                <a href={item.website_url}>{item.name}</a> in {item.city}, {item.state}
              </li>
            ))}
          </ul>
        )}
      </Fragment>
    );
  }
  
  // ========================================
  ReactDOM.render(<App />, document.getElementById("root"));
  