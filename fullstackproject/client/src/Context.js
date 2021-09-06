import React, {Component} from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext();

//Set up Provider component to create Context for use throughout the App

export class Provider extends Component {
    state={
        authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
        password: Cookies.getJSON('password') || null
    };

    constructor() {
        super();
        this.data=new Data();
    }

    render() {
        const {authenticatedUser, password} = this.state;
        const value = {
            authenticatedUser,
            password,
            data: this.data,
            actions: {
                signIn: this.signIn,
                signOut: this.signOut
            }
        };
        return(
            <Context.Provider value={value}>
                {this.props.children}
            </Context.Provider>
        );
    }


    //Sign In - Look to the API to make sure user is authenticated
    signIn = async (emailAddress, password) => {
        const user = await this.data.getUser(emailAddress, password);
        if (user !== null) {
            user.password = password;
            user.emailAddress = user.Email;
            this.setState(() => {
                return{
                    authenticatedUser: user
                }
            });
            Cookies.set('authenticatedUser', JSON.stringify(user), {expires: 1});
        }
        return user;
    }

    //Sign Out - Remove user from Authenticated, and sign them out.
    signOut = () => {
        this.setState( () => {
            return {
                authenticatedUser: null
            }
        });
        Cookies.remove('authenticateduser');
    }
}

export const Consumer = Context.Consumer;


//Higher-order component to wrap a provided component in a Context Consumer component.
export default function withContext(Component) {
    return function ContextComponent(props) {
        return (
            <Context.Consumer>
                {context => <Component {...props} context={context} />}
            </Context.Consumer>
        )
    }
}