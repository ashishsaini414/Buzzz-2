import { Fragment, useEffect, useState } from "react";
import EachSuggestion from "./eachSuggestion";
import { useDispatch, useSelector } from "react-redux";
import classes from "./suggestions.module.css";
import axios from "axios";
import setHeaders from "../Assets/Apis data/fetch";

const Suggestions = (props) => {

  const currentUser = useSelector(state => state.auth.loginUserInfo)
  const filteredSuggestions = useSelector((state) => state.users.myFilteredSuggestions);

  const [showSearchInput, setShowSearchHandler] = useState(false);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    try{
      fetch("/getAllSuggestions", {
        method: "POST",
        headers: setHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ loginUser: currentUser.username }),
      })
        .then((res) => res.json())
        .then((data) => {
          if(!data.error){
            dispatch({ type: "SAVE_ALL_SUGGESTIONS", payload: data });
          }
          else if(data.error){
            throw new Error(data.error);
          }
        }).catch(error => console.log(error))
    }
    catch(err){
      console.log(err);
    }
    
  }, [currentUser.username, dispatch]);
 
  useEffect(() => {
    if(searchText !== ""){
      const timeoutDelay = setTimeout(async () => {
        try{
          const { data } = await axios.post("/getFilteredSuggestion", {
            loginUser: currentUser.username,
            inputText: searchText,
          })
          if(data){
            dispatch({type: "SAVE_ALL_FILTERED_SUGGESTIONS", payload: data})
          }
        }
        catch(err){
          if(err.response.data.error){
            console.log(err.response.data.error)
          }
          else {
            console.log(err)
          }
        }
        
      }, 500);
      return () => clearTimeout(timeoutDelay);
    }
  }, [searchText, currentUser.username,dispatch]);

  const searchHandler = async (e) => {
    if (e.target.value !== "") {
      setSearchText(e.target.value);
    }
    if (e.target.value === "") {
      dispatch({type: "RESET_FILTERED_SUGGESTIONS"})
    }
  };

  return (
    <Fragment>
      <div className={classes.suggestionsComponent}>
        <div className={classes.suggestionHeader}>
          <h2 className={classes.suggestionTitle}>Suggestions</h2>
          <span
            className={classes.searchIcon}
            onClick={(e) => setShowSearchHandler((prevState) => !prevState)}
          >
            <i className="fas fa-search"></i>
          </span>
        </div>
        {showSearchInput && (
          <div>
            <input
              className={classes.searchInput}
              placeholder="Enter Text ..."
              onChange={searchHandler}
            />
          </div>
        )}
        <div className={classes.suggestionList}>
          {filteredSuggestions.length === 0 && <p className={classes.noSuggestionMessage}>No Suggestions</p>}
          {filteredSuggestions.map((data, index) => {
            return (
              <div key={index}>
                <EachSuggestion suggestion={data} />
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default Suggestions;
