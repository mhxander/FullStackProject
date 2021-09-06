import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Form from './Form';

//Create the Signup class

export default class UserSignUp extends Component {
    state = {
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
        errors: []
    }

//Render the signup form.

    render() {
        const{
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword,
            errors
        } = this.state;

        return(
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    <Form
                        cancel={this.cancel}
                        errors={errors}
                        submit={this.submit}
                        submitButtonText="Sign Up"
                        elements={() => (
                            <React.Fragment>
                                <input
                                    id="firstName" 
                                    name="firstName" 
                                    type="text"
                                    value={firstName} 
                                    onChange={this.change} 
                                    placeholder="First Name" />
                                <input
                                    id="lastName" 
                                    name="lastName" 
                                    type="text"
                                    value={lastName} 
                                    onChange={this.change} 
                                    placeholder="Last Name" />
                                <input 
                                    id="emailAddress"
                                    name="emailAddress"
                                    type="text"
                                    value={emailAddress}
                                    onChange={this.change}
                                    placeholder="Email Address"/>
                                <input 
                                    id="password" 
                                    name="password"
                                    type="password"
                                    value={password} 
                                    onChange={this.change} 
                                    placeholder="Password" />
                                <input 
                                    id="confirmPassword" 
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword} 
                                    onChange={this.change} 
                                    placeholder="Confirm Password" />
                            </React.Fragment>
                        )} />
                    <p>
                        Already have an account? <Link to="/signup">Click here</Link> to sign in
                    </p>
                </div>
            </div>
        )
    }

//Change state based on user input.

    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return{
                [name]: value
            }
        })
    }


//User info is sent to the API on submission.  Then redirected to the Courses page.

    submit = () => {
        const {context} = this.props;
        const {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword
        } = this.state;

        const user={
            firstName,
            lastName,
            emailAddress,
            password
        }

        if(confirmPassword === password) {
            context.data.createUser(user)
            .then(errors => {
                if (errors.length){
                    this.setState({errors});
                } else {
                    console.log(`${emailAddress} is successfully signed up`);
                    context.actions.signIn(emailAddress, password)
                    .then(() => {
                        this.props.history.push('/')
                    });
                }
            })
            .catch(err => {
                console.log('Email in use', err);
                this.props.history.push('/email-in-use');
            })
        } else {
            this.setState({
                errors: 'Password do not match'
            })
        }
    }

//When the cancel button is pushed, redirects back to the courses page.

    cancel = () => {
        this.props.history.push('/')
    }

}