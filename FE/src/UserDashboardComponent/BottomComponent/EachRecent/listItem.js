import { Fragment } from "react";
import SampleImage from '../../../Assets/Images/groupImage.jpg'
import classes from './listItem.module.css'

const ListItem = (props) =>{
    const { data } = props;
    
    return <Fragment>
        <div className={classes.listItem}>
            <img src={data.listItemImage} className={classes.listItemImage} onError={(e)=> e.target.setAttribute("src",SampleImage)} alt=""></img>
            <p>{data.listItemTitle}</p>
    </div>  
    </Fragment>
}
export default ListItem;