import classes from './profileForm.module.css';
import axios from "axios";
import {useState} from "react";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ProfileForm = (props) => {

    const { getProfileData: { userObject } } = props;
    // console.log(userObject)
    const currentUser = useSelector(state => state.auth.loginUserInfo)

    const [inputFirstName, setInputFirstName] = useState(userObject.firstName);
    const [inputLastName, setInputLastName] = useState(userObject.lastName);
    const [inputDesignation, setInputDesignation] = useState(userObject.otherInformation.designation);
    const [inputWebsite, setInputWebsite] = useState(userObject.otherInformation.website);
    const [inputGender, setInputGender] = useState(userObject.otherInformation.gender);
    const [inputBirthday, setInputBirthday] = useState(userObject.otherInformation.birthday);
    const [inputCity, setInputCity] = useState(userObject.otherInformation.address.city);
    const [inputState, setInputState] = useState(userObject.otherInformation.address.state);
    const [inputZip, setInputZip] = useState(userObject.otherInformation.address.zip);

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        let task = "profileDataUpdate";

        var formDataSent = {inputFirstName, inputLastName, inputDesignation, inputWebsite, inputGender, inputBirthday, inputCity, inputState, inputZip}

        const { data } = await axios.post("/updateProfileData", {
        data: formDataSent,
        loginUser : currentUser.username,
        task,
        });
        // console.log(data);
        if(data) {
        toast.success("Update Successfully")
      }
        
    };
    const handleRatioInput = (e) => {
        // console.log(e)
        setInputGender(e.target.value);
    }
    const resetButtonHandler = (e)=>{
        setInputFirstName("");
        setInputLastName("");
        setInputDesignation("");
        setInputWebsite("");
        setInputGender("");
        setInputGender("");
        setInputBirthday("");
        setInputCity("");
        setInputState("");
        setInputZip("");
    }
    
    return <form
    className={classes.userDetailsForm}
    onSubmit={formSubmitHandler}
  >
    <div className={classes.formFirstRow}>
      <div>
        <label htmlFor="firstName">FirstName</label>
          <input
            type="text"
            value={inputFirstName}
            id="firstName"
            placeholder="Enter FirstName"
            onChange={(e)=> setInputFirstName(e.target.value)}
          ></input>
      </div>
      <div>
        <label htmlFor="lastName">LastName</label>
        <input type="text" id="lastName" value={inputLastName} onChange={(e)=> setInputLastName(e.target.value)}></input>
      </div>
    </div>
    <div className={classes.formSecondRow}>
      <div>
        <label htmlFor="Designation">Designation</label>
        <input
          type="text"
          id="Designation"
          value={inputDesignation}
          onChange={(e)=> setInputDesignation(e.target.value)}
        ></input>
      </div>
      <div>
        <label htmlFor="myWebsite">My Website</label>
        <input type="text" id="myWebsite" value={inputWebsite} onChange={(e)=> setInputWebsite(e.target.value)}></input>
      </div>
    </div>
    <div className={classes.formThirdRow}>
      <div>
        <label htmlFor="gender" >Gender</label>
         <div className={classes.radioElements}> <label htmlFor="male">Male</label>
          <input
            type="radio"
            value="male"
            name="gender"
            checked={inputGender === "male" && true}
            onChange={handleRatioInput}
          ></input>
          <label htmlFor="female" style={{ paddingLeft: "15px" }}>Female</label>
          <input 
          type="radio" 
          value="female" 
          name="gender"
          checked={inputGender === "female" && true}
          onChange={handleRatioInput}
          ></input>
          </div>
      </div>
      <div>
        <label htmlFor="birthday">Birthday</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            style={{width: "14.8em"}}
            value={inputBirthday}
            onChange={(e)=> setInputBirthday(e.target.value)}
          />
      </div>
    </div>
    <div className={classes.formFouthRow}>
      <div>
        <label htmlFor="city">City</label>
          <input type="text" id="city" value={inputCity} onChange={(e)=> setInputCity(e.target.value)}></input>
      </div>
      <div className={classes.fourthRowElements}>
        <div>
          <label htmlFor="state">State</label>
            <select name="mystate" id={classes.select} value={inputState} onChange={(e)=> setInputState(e.target.value)}>
              <option>none</option>
              <option value="Up">Up</option>
              <option value="Punjab">Punjab</option>
              <option value="Uttarakhand">Uttarakhand</option>
            </select>
        </div>
        <div>
          <label htmlFor="zip">Zip</label>
            <input
              type="number"
              style={{ width: "6.7em" }}
              id="zip"
              value={inputZip}
              onChange={(e)=> setInputZip(e.target.value)}
            />
        </div>
      </div>
    </div>
    <div className={classes.formFivthRow}>
      <input type="submit" value="Save" />
      <input type="reset" value="Reset All" onClick={resetButtonHandler} />
    </div>
  </form>
}

export default ProfileForm;