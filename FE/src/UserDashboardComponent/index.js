import classes from './index.module.css'
import TopComponent from './TopComponent/topComponent';
import BottomComponent from './BottomComponent/bottomComponent';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setHeaders from '../Assets/Apis data/fetch';

const UserDashboardComponent = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.loginUserInfo)
    
    useEffect(()=>{
        async function getLoginUserInfo(){
            fetch("/getLoginUserAllInformation",{
                method: "POST",
                headers: setHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({loginUser: currentUser.username})
            }).then(res => res.json()).then(data => {
            // console.log("data",data)
                if(!data.error){
                    dispatch({type:"SAVE_LOGIN_USER_INFO", payload: data})
                }
                else if(data.error){
                    console.log(data);
                }
            }).catch(error =>  console.error(error))
        }
        getLoginUserInfo();
    },[currentUser.username, dispatch])
    
    return <div className={classes.userDashboardComponent}>
            <TopComponent/>
            <BottomComponent/>
    </div>
}

export default UserDashboardComponent;