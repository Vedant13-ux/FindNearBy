import React, { useEffect, useState, useContext } from "react";
import Navbar from "../containers/Global/Navbar";
import ServicesSVG from '../images/ServicesSVG'
import { MyContextProvider } from '../services/MyContext'
import axios from "axios";

const navigation = [
    { name: 'All Services', href: '/services', current: false },
    { name: 'My Services', href: '/myservices', current: false },
]
const colorTheme = {
    "Bus": {
        "color": "#4eb7ff",
        "icon": "fas fa-bus"
    },
    "Taxi": {
        "color": "#43f390",
        "icon": "fas fa-taxi"
    },
    "Dining": {
        "color": "#fd6494",
        "icon": "fas fa-utensils"
    },
    "Self Care and Spa": {
        "color": "#ffb508",
        "icon": "fas fa-spa"
    },
    "Swimming Pool": {
        "color": "#37ba82",
        "icon": "fas fa-swimming-pool"
    },
    "Games and Entertainment": {
        "color": "#cd57ff",
        "icon": "fas fa-gamepad"
    }
}

export default class MyServices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            services: [],
            start: true
        }
        this.Axios = axios.create({
            baseURL: 'http://localhost/wp2/api/routes/',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('loginToken')
            }
        });
    }
    async componentDidMount() {
        const { data } = await this.Axios.get('get-services.php');
        this.setState({ services: data.services.reverse(), start: false })
        console.log(data)
    }
    render() {
        if (this.state.services.length == 0 & !this.state.start) {
            return (
                <div id="my-services">
                    <MyContextProvider><Navbar navigation={navigation} history={this.props.history} /> </MyContextProvider>
                    <ServicesSVG />
                </div>
            )
        } else {
            return (
                <div id="my-services">
                    <MyContextProvider><Navbar navigation={navigation} history={this.props.history} /> </MyContextProvider>

                    <div className="flex flex-col ">
                        {this.state.services.map((service, index) => {
                            return (
                                <div className=" max-w-lg w-100 lg:flex" style={{ margin: '10px auto' }}>
                                    <div style={{ backgroundColor: colorTheme[service['service_name']]['color'] }} className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" title="Woman holding a mug">
                                        <div className="icon">
                                            <i className={colorTheme[service['service_name']]['icon']}></i>
                                        </div>
                                    </div>
                                    <div className="border-r border-b border-l border-grey-light lg:border-l-0 lg:border-t lg:border-grey-light bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                                        <div className="mb-8">
                                            <div className="text-black font-bold text-xl mb-2">{service['service_name']}</div>
                                            <p className="text-grey-darker text-base">

                                                <strong><i className="m-1 fas fa-calendar-week"></i>Date </strong>{service['date']} <br />

                                                <strong><i className="m-1 fas fa-clock"></i>Time </strong>{service['time']} <br />

                                                <strong><i className="m-1 fas fa-rupee-sign"></i>Amount</strong> {service['amount']} <br />

                                                <strong><i className="m-1 fas fa-shopping-cart"></i>Booked By</strong> {service['booked_by']} <br />


                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>
            )
        }
    }


}