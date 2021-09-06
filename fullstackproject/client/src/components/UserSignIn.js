import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Form from './Form';


//Creates the Signin Class, using the user's email and password.

export default class UserSignIn extends Component {

    state = {
        emailAddress: '',
        password: '',
        errors: []
    }

    render() {
        const{
            emailAddress,
            password,
            errors
        } = this.state;
    


    return (
        <div className="bounds">
            <div className="grid-33 centered signin">
                <h1>Sign In</h1>
                <Form
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Sign In"
                    elements={() => (
                        <React.Fragment>
                            <input
                                id="emailAddress"
                                name="emailAddress"
                                type="text"
                                value={emailAddress}
                                onChange={this.change}
                                placeholder="Email Address" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={this.change}
                                placeholder="Password" />
                        </React.Fragment>
                    )} />
                    <p>
                        Not have an account? <Link to="/signup">Click here</Link> to sign up
                    </p>
                </div>
            </div>
        )
    }

//Update state using user input.
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return{
                [name]: value
            }
        })
    }


//Check to see if user signing in is authorized.

    submit = () => {
        const {context} = this.props;
        const {from} = this.props.location.state || {from: {pathname: '/'}};
        const {emailAddress, password} = this.state;
        context.actions.signIn(emailAddress, password)
            .then(user => {
                if (user === null) {
                    this.setState(() => {
                        return {errors: ['Sign-in unsuccessful. Please try again.']}
                    })
                } else {
                    this.props.history.push(from)
                    console.log(`Successfully signed in ${emailAddress}`)
                }
            })
            .catch(err => {
                console.log(err);
                this.props.history.push('/error')
            })
    }

// If cancel button is pushed, return to the Courses page.

    cancel = () => {
        this.props.history.push('/')
    }

}