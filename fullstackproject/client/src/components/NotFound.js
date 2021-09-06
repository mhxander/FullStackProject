import React from 'react';
import {Link} from 'react-router-dom';


//Create the NotFound page when we receive a 404 error.

const NotFound = () => {
    return(
        <div className="bounds">
            <h1>Not Found</h1>
            <p>Sorry! We couldn't find the page you are looking for.</p>
            <div className="button">
                <Link to="/">Return to Home</Link>
            </div>
        </div>
    )
}

export default NotFound