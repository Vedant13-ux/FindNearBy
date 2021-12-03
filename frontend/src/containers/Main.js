import React, { useContext, useEffect } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Homepage from '../components/Homepage'
import Login from '../components/LoginTest'
import MyServices from '../components/MyServices';
import AddCustomer from '../components/AddCustomer';
import Profile from '../components/Profile';
import Service from '../components/Service';
import NotFound from '../images/NotFound';
import { MyContextProvider } from '../services/MyContext'

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        const loginToken = localStorage.getItem('loginToken');

        // If inside the local-storage has the JWT token
        if (!loginToken) {
            this.props.history.push('/login');
        }
    }
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/login" render={props => <MyContextProvider><Login {...props} /></MyContextProvider>} />
                    <Route exact path="/services" render={props => <MyContextProvider><Homepage {...props} /></MyContextProvider>} />
                    <Route exact path="/services/:service" render={props => <MyContextProvider><Service {...props} /></MyContextProvider>} />
                    <Route exact path="/myservices" render={props => <MyContextProvider><MyServices {...props} /></MyContextProvider>} />
                    <Route exact path="/addcustomer" render={props => <MyContextProvider><AddCustomer {...props} /></MyContextProvider>} />
                    <Route exact path="/profile" render={props => <MyContextProvider><Profile {...props} /></MyContextProvider>} />
                    <Route path="*" render={props => <NotFound />} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(Main);
