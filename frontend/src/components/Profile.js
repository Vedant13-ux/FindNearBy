import React, { useContext } from 'react';
import Navbar from '../containers/Global/Navbar';
import axios from 'axios'

const navigation = [
    { name: 'All Services', href: '/services', current: false },
    { name: 'My Services', href: '/myservices', current: false },
]


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            start: true,
        }
        this.Axios = axios.create({
            baseURL: 'http://localhost/wp2/api/routes/',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('loginToken')
            }
        });
    }
    async componentDidMount() {
        const {data} = await this.Axios.get('user-info.php');
        this.setState({ user: data.user, start: false });
    }
    render() {
        if (this.state.start) {
            return <div></div>
        } else {
            return (
                <div id='profile'>
                    <Navbar navigation={navigation} history={this.props.history} />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '75px', marginBottom: '75px' }}>
                        <div className="max-w-sm rounded overflow-hidden shadow-lg" >
                            <img src="https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?s=1024x768" className="w-full" alt="Sunset in the mountains" />
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">{this.state.user.hotel_name}</div>
                                <p className="text-gray-700 text-base">
                                    <strong>Name :</strong> {this.state.user.name}<br />
                                    <strong>Email :</strong> {this.state.user.email}

                                </p>
                            </div>
                            <div className="px-6 pt-4 pb-2">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"><i className="fa fa-map-marker"> Mumbai</i></span>
                            </div>
                        </div>
                    </div>
                </div>


            )
        }
    }
}
