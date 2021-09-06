import React from 'react';
import {Link} from 'react-router-dom';

//In case they are already registered
const EmailInUse = () => {
    return(
        <div className="bounds">
            <h1>This email has already been registered.</h1>
            <p>Please sign up with another email address, or proceed to signing in.</p>
            <div className="button">
                <Link to="/signup">Return to Sign Up</Link>
            </div>
        </div>
    )
}

export default EmailInUse;