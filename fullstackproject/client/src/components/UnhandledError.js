import React from 'react';
import {Link} from 'react-router-dom';


//Creates page for when an unhandled error occurs

const UnhandledError = () => {
    return(
        <div className="bounds">
            <h1>Error</h1>
            <p>I'm sorry, an unexpected error has occurred</p>
            <div className="button">
                <Link to="/">Return to Home</Link>
            </div>
        </div>
    )
}

export default UnhandledError;