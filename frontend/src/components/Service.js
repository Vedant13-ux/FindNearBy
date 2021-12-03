import React from 'react'
import Navbar from '../containers/Global/Navbar'
import NotFound from '../images/NotFound'
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios'
const navigation = [
    { name: 'All Services', href: '/services', current: false },
    { name: 'My Services', href: '/myservices', current: false },
]


export default class Service extends React.Component {
    constructor(props) {
        super(props)
        this.Axios = axios.create({
            baseURL: 'http://localhost/wp2/api/routes/',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('loginToken')
            }
        });
        this.state = {
            cost_per_head: null,
            name: "",
            amount: null,
            date: "",
            time: "",
            people_selected: [],
            invalid: false,
            customer_emails: [],
            services: {}
        }
        this.getService = this.getService.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.multiselectRef = React.createRef();

    }

    getService(service) {
        var tempState = {}
        if (service == 'bus') {
            tempState = {
                name: "Bus",
                color: "#4eb7ff",
                icon: "fas fa-bus"
            }
        } else if (service == 'taxi') {
            tempState = {
                name: "Taxi",
                color: "#43f390",
                icon: "fas fa-taxi"
            }
        } else if (service == 'dining') {
            tempState = {
                name: "Dining",
                color: "#fd6494",
                icon: "fas fa-utensils"
            }
        } else if (service == 'spa') {
            tempState = {
                name: "Self Care and Spa",
                color: "#ffb508",
                icon: "fas fa-spa"
            }
        } else if (service == 'swimming') {
            tempState = {
                name: "Swimming Pool",
                color: "#37ba82",
                icon: "fas fa-swimming-pool"
            }
        } else if (service == 'games') {
            tempState = {
                name: "Games and Entertainment",
                color: "#cd57ff",
                icon: "fas fa-gamepad"
            }
        } else {
            tempState = {
                invalid: true
            }
        }
        this.setState(tempState)

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    async handleSubmit(event) {
        event.preventDefault();
        var people_selected = await this.multiselectRef.current.getSelectedItems()
        var peopleObject = []
        for (let person of people_selected) {
            peopleObject.push(person.text)
        }
        const { date, amount, time, name } = this.state
        var reqObj = {
            date: new Date(date).toDateString(), amount, time, service_name: name, people_selected: peopleObject
        }
        await this.Axios.post('service.php', reqObj).then(res => {
            if (res.data.success == 1) {
                this.props.history.push('/myservices')
            }
        })
        console.log(reqObj)
    }

    async onSelect() {
        var people_selected = await this.multiselectRef.current.getSelectedItems().length
        this.setState({ amount: (people_selected + 1) * this.state.cost_per_head })

    }

    async onRemove() {
        this.setState({ amount: this.state.amount - this.state.cost_per_head })

    }



    async componentDidMount() {
        window.scrollTo(0, 0);
        if (this.props.match.params.service) {
            await this.getService(this.props.match.params.service)
            const data = await (await this.Axios.get('get-members.php')).data
            var services = data.services
            var customer_emails = data.emails


            var emailObj = []
            for (let email of customer_emails) {
                emailObj.push({ text: email })
            }
            this.setState({
                customer_emails: emailObj, services: services, cost_per_head: services[this.state.name],
                amount: services[this.state.name]
            })
            console.log(services)
        }
    }
    render() {

        return (
            <div id='service'>
                <Navbar navigation={navigation} history={this.props.history} />
                {this.state.invalid ? <NotFound /> :
                    <div style={{ margin: '0 auto' }}>
                        <div className="p-3" style={{ background: this.state.color, textAlign: 'center' }}>
                            <div className="text-lg antialiased font-medium" style={{ color: 'white' }}><i className={`m-2 ${this.state.icon}`} ></i>{this.state.name.toUpperCase()}</div>
                        </div>

                        <div className="flex flex-col items-center justify-center m-10 bg-white">
                            <form onSubmit={this.handleSubmit} style={{ background: this.state.color }} className="w-full sm:w-3/4 max-w-lg p-12 pb-6 shadow-2xl rounded">

                                <input
                                    className="block text-gray-700 p-1 m-4 ml-0 w-full rounded text-lg font-normal placeholder-gray-300"
                                    type="date"
                                    placeholder="Enter Date of Service"
                                    onChange={this.handleChange}
                                    name="date"
                                    value={this.state.date}
                                    required
                                />

                                <input
                                    className="block text-gray-700 p-1 m-4 ml-0 w-full rounded text-lg font-normal placeholder-gray-300"
                                    type="time"
                                    placeholder="Enter time of service"
                                    onChange={this.handleChange}
                                    name="time"
                                    value={this.state.time}
                                    required
                                />

                                <Multiselect
                                    options={this.state.customer_emails} // Options to display in the dropdown
                                    onRemove={this.onRemove} // Function will trigger on remove event
                                    onSelect={this.onSelect} // Function will trigger on select event
                                    displayValue="text" // Property name to display in the dropdown options
                                    ref={this.multiselectRef}
                                />

                                <input
                                    className="block text-gray-700 p-1 m-4 ml-0 w-full rounded text-lg font-normal placeholder-gray-300"
                                    id="amount"
                                    type="text"
                                    placeholder="Amount"
                                    value={"Amount = ₹" + this.state.amount}
                                    name="amount"
                                    disabled
                                />



                                <div style={{ textAlign: 'center' }}>
                                    <button
                                        className="content-center antialiased inline-block mt-2 bg-green-600 focus:bg-green-800 px-6 py-2 rounded text-white shadow-lg"
                                        style={{ background: "white", color: this.state.color, fontWeight: '500' }}
                                    >
                                        Confirm Booking
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>


                }
            </div>
        )

    }
}
