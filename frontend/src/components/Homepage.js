import React, { useContext} from "react";
import Navbar from "../containers/Global/Navbar";
import { Link } from 'react-router-dom'
import { MyContext } from '../services/MyContext'

const navigation = [
    { name: 'All Services', href: '/services', current: true },
    { name: 'My Services', href: '/myservices', current: false },
]


function Homepage(props) {
    
    const { logoutUser } = useContext(MyContext);


    return (
        <div>
            <Navbar logoutUser= {logoutUser} history={props.history} navigation={navigation} />
            <div id="homepage" >
                <div className="container">
                    <Link to="/services/bus" className="serviceBox">
                        <div className="icon" style={{ "--i": "#4eb7ff" }}>
                            <i className="fas fa-bus"></i>
                        </div>
                        <div className="content">
                            <h2>Bus</h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
                                eos facilis beatae dicta perferendis. Similique.
                            </p>
                        </div>
                    </Link>
                    <Link to="/services/dining" className="serviceBox">
                        <div className="icon" style={{ "--i": "#fd6494" }}>
                            <i className="fas fa-utensils"></i>
                        </div>
                        <div className="content">
                            <h2>Dining</h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
                                eos facilis beatae dicta perferendis. Similique.
                            </p>
                        </div>
                    </Link>
                    <Link to="/services/taxi" className="serviceBox">
                        <div className="icon" style={{ "--i": "#43f390" }}>
                            <i className="fas fa-taxi"></i>
                        </div>
                        <div className="content">
                            <h2>Taxi</h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
                                eos facilis beatae dicta perferendis. Similique.
                            </p>
                        </div>
                    </Link>
                    <Link to="/services/spa" className="serviceBox">
                        <div className="icon" style={{ "--i": "#ffb508" }}>
                            <i className="fas fa-spa"></i>
                        </div>
                        <div className="content">
                            <h2>Self Care & Spa</h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
                                eos facilis beatae dicta perferendis. Similique.
                            </p>
                        </div>
                    </Link>
                    <Link to="/services/swimming" className="serviceBox">
                        <div className="icon" style={{ "--i": "#37ba82" }}>
                            <i className="fas fa-swimming-pool"></i>
                        </div>
                        <div className="content">
                            <h2>Swimming Pool</h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
                                eos facilis beatae dicta perferendis. Similique.
                            </p>
                        </div>
                    </Link>
                    <Link to="/services/games" className="serviceBox">
                        <div className="icon" style={{ "--i": "#cd57ff" }}>
                            <i className="fas fa-gamepad"></i>
                        </div>
                        <div className="content">
                            <h2>Games & Entertainment</h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
                                eos facilis beatae dicta perferendis. Similique.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default Homepage;