import React, {useEffect} from 'react';
import {Redirect} from 'react-router-dom';

//Signs out the user when the button is pushed.  Redirects back to the courses page.

export default ({context}) => {
    useEffect(() => context.actions.signOut());
    return (
        <Redirect to='/' />
    )
}