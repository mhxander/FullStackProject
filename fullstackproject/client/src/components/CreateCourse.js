import React, {Component, Fragment} from 'react';
import Form from './Form';
import Data from '../Data';

//  Set up the Create Course class

export default class CreateCourse extends Component {

    constructor() {
        super()
        this.data = new Data();
    }

    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        userId: '',
        name: '',
        errors: []
    }

    //Get the ID and Name for the Authenticated User to assign to the new course

    componentDidMount() {
        const {context} = this.props;
        this.setState(() => {
            return {
                userId: context.authenticatedUser.Id,
                name: context.authenticatedUser.Name
            }
        })
    }

    //Render the Create Course page

    render() {
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors
        } = this.state;
        
        return(
        <div className="bounds course--detail">
            <h1>Create Course</h1>
            <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Create Course"
            elements={() => (
                <Fragment>
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div>
                                <input 
                                    id="title" 
                                    name="title" 
                                    type="text" 
                                    value={title}
                                    onChange={this.change} 
                                    className="input-title course--title--input" 
                                    placeholder="Course title..." />
                            </div>
                            <p>By {this.state.name}</p>
                        </div>
                        <div className="course--description">
                            <div>
                                <textarea 
                                    id="description" 
                                    name="description" 
                                    value={description}
                                    onChange={this.change} 
                                    placeholder="Course description..."
                                    className="course--description" />
                            </div> 
                        </div>
                    </div> 
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                        <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                            <h4>Estimated Time</h4>
                                <div>
                                    <input 
                                        id="estimatedTime" 
                                        name="estimatedTime" 
                                        type="text"
                                        value={estimatedTime} 
                                        onChange={this.change} 
                                        className="course--time--input"                              
                                        placeholder="Hours" />
                                </div>
                            </li>
                            <li className="course--stats--list--item">
                                <h4>Materials Needed</h4>
                                <div>
                                    <textarea
                                        id="materialsNeeded" 
                                        name="materialsNeeded"
                                        value={materialsNeeded}
                                        onChange={this.change} 
                                        placeholder="List materials..." 
                                        ></textarea>
                                </div>
                            </li>
                        </ul>
                        </div>
                    </div>
                </Fragment>
            )} />
        </div>
        )
    }

    //Update state using Form fields

    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            }
        })
    }

    //Checks if user is Authorized to create a course

    submit = () => {
        const {context} = this.props;
        const {emailAddress,password} = context.authenticatedUser;
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId
        } = this.state;

        const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId
        }

        context.data.createCourse(course, emailAddress, password).then(errors => {
            if (errors && errors.length > 0){
                this.setState({errors});
            } else {
                this.props.history.push('/')
            }
        })
        .catch(err => {
            console.log(err);
            this.props.history.push('./error');
        })
    }

    //Cancel button redirects to the Courses page

    cancel = () => {
        this.props.history.push('/')
    }
}