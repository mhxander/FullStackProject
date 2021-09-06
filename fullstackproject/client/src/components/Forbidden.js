import React from 'react';
import {Link} from 'react-router-dom';


//Creates the forbidden page, in case a user is not Authorized to do something.
export default () => {
    return(
        <div className="bounds">
            <h1>Forbidden</h1>
            <p>Oops! You're not allowed to access this page.</p>
            <div className="button">
                <Link to="/">Return Home</Link>
            </div>
        </div>
    )
}