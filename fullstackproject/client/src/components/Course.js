import React from 'react';

//  Create HTML to display Course modules on the index page.

const Course = ({title, url}) => {
    return(
        <div className="grid-33">
            <a className="course--module course--link" href={url}>
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{title}</h3>
            </a>
        </div>
    )
}

export default Course;