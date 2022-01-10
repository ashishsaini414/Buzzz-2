import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EachFriend from "./eachFriend";
import axios from "axios";
import classes from "./allFriends.module.css";
import setHeaders from "../Assets/Apis data/fetch";

const MyFriends = (props) => {
  const dispatch = useDispatch();
  const [showSearchInput, setShowSearchHandler] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const myFriends = useSelector((state) => state.users.allFriends);
  
  const currentUser = useSelector(state => state.auth.loginUserInfo)

  // console.log(filteredFriends);
  // console.log(searchText);

  useEffect(() => {

    //syntax error ayega kuch to try/catch mai catch block run hoga otherwise koi api se error ata hai to vo then/catch block ke catch block mai jayega
    try{
      fetch("/getAllFriends", {
        method: "POST",
        headers: setHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ loginUser: currentUser.username }),
      })
        .then((res) => res.json())
        .then((data) => {
          if(!data.error){
            dispatch({ type: "SAVE_ALL_FRIENDS", payload: data });
          }
          else if(data.error){
            throw new Error(data.error)
          }
        }).catch(error => console.log(error))
    }
    catch(err){
      console.log(err);
    }
    
  }, [currentUser.username, dispatch]);

  useEffect(() => {
    const timeoutDelay = setTimeout(async () => {
      try{
        const { data } = await axios.post("/getFilteredFriends", {
          loginUser: currentUser.username,
          inputText: searchText,
        })
        if(data){
          setFilteredFriends(data);
        }
      }
      catch(err){
        if(err.response.data.error){
          console.log(err.response.data.error);
        }
        else {
          console.log(err);
        }
      }
    }, 500);
    return () => clearTimeout(timeoutDelay);
  }, [searchText, currentUser.username]);

  const searchHandler = async (e) => {
    if (e.target.value !== "") {
      setSearchText(e.target.value);
    }
    if (e.target.value === "") {
      setSearchText("");
      setFilteredFriends(myFriends);
    }
  };

  const removeFriendHandler = (data) => {
    console.log(data);
    setFilteredFriends((prevState,index) => {
      prevState.forEach(friend => {
        if(friend._id === data._id){
          prevState.splice(index)
        }
      })
      return [...prevState]
    })
  }

  return (
    <Fragment>
      <div className={classes.suggestionsComponent}>
        <div className={classes.suggestionHeader}>
          <h2 className={classes.suggestionTitle}>Contacts</h2>
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
          {filteredFriends.length === 0 && <p className={classes.noFriendsMessage}>No Friends</p>}
          {filteredFriends.map((friend, index) => {
            return (
              <div key={index}>
                <EachFriend data={friend} removeFriend={removeFriendHandler} />
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default MyFriends;
