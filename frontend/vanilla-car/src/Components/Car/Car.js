import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Button, Table} from "react-bootstrap";
import AuthenticateService from "../../Services/AuthenticateService";
import Events from "../../Other/Events";
import CarService from "../../Services/CarService";
import {UpdateCar} from "./UpdateCar";
import {AddCar} from "./AddCar";

export default class Car extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {},
            car: [],
            CarUpdateShow: false,
            CarAddShow: false,
        };
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/login"});
        this.setState({currentUser: currentUser, userReady: true});
        if (currentUser === null) {
        } else {
            if (currentUser.roleid === 2 || currentUser.roleid === 4 || currentUser.roleid === 3) this.setState({redirect: "/profile"});
            AuthenticateService.getUser(currentUser.id).then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();

                    } else {
                        this.setState({
                            getUserById: response.data,
                        })
                    }
                    ;
                },

                (error) => {
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                    if (error.response.status === 401) {
                        Events.dispatch("logout");
                    }
                }
            );
        }
        if (currentUser === null) {
        } else {
            CarService.getCar(currentUser.id).then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();

                    } else {
                        this.setState({
                            car: response.data

                        })
                    }
                    ;
                    this.setState({
                        car: this.state.car.sort(function (a, b) {
                            return a.carId - b.carId
                        })
                    })
                },
                (error) => {
                    this.setState({
                        content:
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString(),
                    });

                    if (error.response && error.response.status === 401) {
                        Events.dispatch("logout");
                    }
                }
            )
        }
        ;
    }

    deleteCar(carId) {
        if (window.confirm("Jesteś pewny?")) {
            CarService.deleteCar(carId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        }

        const {
            car,
            carid,
            carmodel,
            carproductionyear,
            fueltypeid,
            carvin,
            carplates,
            carmanufacturer,
            carnameid,
            carproductionyearid
        } = this.state;

        let CarUpdateClose = () => this.setState({CarUpdateShow: false});
        let CarAddClose = () => this.setState({CarAddShow: false});


        return (
            <div className="container">
                {this.state.userReady ? (
                    <div>
                        <header className="jumbotron">
                            <div className="d-flex">
                                <hr className="my-auto flex-grow-1"></hr>
                                <div className="px-4">
                                    <h3>Twoje samochody</h3>
                                </div>
                                <hr className="my-auto flex-grow-1"></hr>
                            </div>
                        </header>

                        <Table className="mt-4" striped bordered hover size="sm" responsive>
                            <thead>
                            <tr>
                                <th class="text-center">Marka</th>
                                <th class="text-center">Model</th>
                                <th class="text-center">Rok produkcji</th>
                                <th class="text-center">Typ paliwa</th>
                                <th class="text-center">Numer VIN</th>
                                <th class="text-center">Numer rejestracyjny</th>
                                <th class="text-center">Edytuj samochód</th>
                                <th class="text-center">Usuń samochód</th>
                            </tr>
                            </thead>
                            <tbody>
                            {car.map((car) => (
                                <tr key={car.carId}>
                                    <td class="text-center">{car.carName.carNameManufacturer}</td>
                                    <td class="text-center">{car.carName.carNameModel}</td>
                                    <td class="text-center">{car.carProduction.carProductionYear}</td>
                                    <td class="text-center">
                                        {car.fuelTypeId === 1
                                            ? "Benzyna"
                                            : car.fuelTypeId === 2
                                                ? "Diesel"
                                                : car.fuelTypeId === 3
                                                    ? "Elektryczny"
                                                    : car.fuelTypeId === 4
                                                        ? "Benzyna + LPG"
                                                        : car.fuelTypeId === 5
                                                            ? "Benzyna + CNG"
                                                            : car.fuelTypeId === 6
                                                                ? "Hybryda"
                                                                : car.fuelTypeId === 7
                                                                    ? "Wodór"
                                                                    : car.fuelTypeId === 8
                                                                        ? "Inne"
                                                                        : "błąd"}
                                    </td>
                                    <td class="text-center">{car.carVin}</td>
                                    <td class="text-center">{car.carPlates}</td>

                                    <td align="center">
                                        <Button
                                            className="mr-2"
                                            variant="secondary"
                                            onClick={() =>
                                                this.setState({
                                                    CarUpdateShow: true,
                                                    carid: car.carId,
                                                    carnameid: car.carName.carNameId,
                                                    carmodel: car.carName.carNameModel,
                                                    carmanufacturer: car.carName.carNameManufacturer,
                                                    carproductionyearid: car.carProduction.carProductionId,
                                                    carproductionyear: car.carProduction.carProductionYear,
                                                    fueltypeid: car.fuelTypeId,
                                                    carvin: car.carVin,
                                                    carplates: car.carPlates,
                                                })
                                            }
                                        >
                                            Edytuj
                                        </Button>
                                        <UpdateCar
                                            show={this.state.CarUpdateShow}
                                            onHide={CarUpdateClose}
                                            carid={carid}
                                            carnameid={carnameid}
                                            carmodel={carmodel}
                                            carproductionyearid={carproductionyearid}
                                            carmanufacturer={carmanufacturer}
                                            carproductionyear={carproductionyear}
                                            fueltypeid={fueltypeid}
                                            carvin={carvin}
                                            carplates={carplates}
                                        />
                                    </td>

                                    <td align="center">
                                        <Button
                                            className="mr-2"
                                            variant="danger"
                                            onClick={() => this.deleteCar(car.carId)}
                                        >
                                            Usuń
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <Button
                            className="mr-2"
                            variant="primary"
                            onClick={() =>
                                this.setState({
                                    CarAddShow: true,
                                    carid: car.carId,
                                })
                            }
                        >
                            Dodaj nowy samochód
                        </Button>
                        <AddCar
                            show={this.state.CarAddShow}
                            onHide={CarAddClose}
                            carid={carid}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}
