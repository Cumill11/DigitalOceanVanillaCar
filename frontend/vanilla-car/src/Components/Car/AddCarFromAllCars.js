import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import CarService from "../../Services/CarService";
import AuthenticateService from "../../Services/AuthenticateService";
import Events from "../../Other/Events";
import Select from "react-validation/build/select";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Pole wymagane
            </div>
        );
    }
};
const vin = (value) => {
    if (value.length < 17 || value.length > 17) {
        return (
            <div className="alert alert-danger" role="alert">
                Vin musi miec 17 znaków
            </div>
        );
    }
};
const NotChoosedManufacturer = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać markę
            </div>
        );
    }
};
const NotChoosedModel = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać model
            </div>
        );
    }
};
const NotChoosedYear = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać rok produkcji
            </div>
        );
    }
};
const NotChoosedFuel = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać typ paliwa
            </div>
        );
    }
};
const NotChoosedClient = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać klienta
            </div>
        );
    }
};


export class AddCarFromAllCars extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeCarManufacturer = this.onChangeCarManufacturer.bind(this);
        this.onChangeCarModel = this.onChangeCarModel.bind(this);
        this.onChangeCarProductionYear = this.onChangeCarProductionYear.bind(this);
        this.onChangeCarFuelTypeId = this.onChangeCarFuelTypeId.bind(this);
        this.onChangeCarVin = this.onChangeCarVin.bind(this);
        this.onChangeCarPlates = this.onChangeCarPlates.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);


        this.state = {
            allUsers: [],
            CarManufacturer: "",
            CarModel: "",
            CarProductionYear: "",
            CarFuelType: "",
            CarVin: "",
            CarPlates: "",
            UserEmail: "",
            CarProduction: [],
            CarName: [],
            CarNameModel: [],
            loading: false,
            message: "",
            choosed: false,
        };
    }

    getNames(name) {

        CarService.getNameModelCar(name).then(
            (response) => {
                if (response === undefined) {
                    Events.dispatch("logout");
                    this.props.history.push("/");
                    window.location.reload();

                } else {
                    this.setState({
                        CarNameModel: response.data,
                        choosed: false
                    })
                }
                ;
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
        );

    }

    onChangeCarManufacturer(e) {
        this.setState({
            CarManufacturer: e.target.value,
            choosed: true
        });
    }

    onChangeCarModel(e) {
        this.setState({
            CarModel: e.target.value,
        });
    }

    onChangeCarProductionYear(e) {
        this.setState({
            CarProductionYear: e.target.value,
        });
    }

    onChangeCarFuelTypeId(e) {
        this.setState({FuelTypeId: e.target.value});
    }

    onChangeCarVin(e) {
        this.setState({
            CarVin: e.target.value,
        });
    }

    onChangeCarPlates(e) {
        this.setState({
            CarPlates: e.target.value,
        });
    }

    onChangeUserEmail(e) {
        this.setState({
            UserEmail: e.target.value,
        });
    }

    componentDidMount() {
        AuthenticateService.getAllUsers().then(
            (response) => {
                if (response === undefined) {
                    Events.dispatch("logout");
                    this.props.history.push("/");
                    window.location.reload();

                } else {
                    this.setState({
                        allUsers: response.data,
                    })
                }
                ;
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
        );
        CarService.getProductionYear().then(
            (response) => {
                if (response === undefined) {
                    Events.dispatch("logout");
                    this.props.history.push("/");
                    window.location.reload();

                } else {
                    this.setState({
                        CarProduction: response.data,
                    })
                }
                ;
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
        );

        CarService.getName().then(
            (response) => {
                if (response === undefined) {
                    Events.dispatch("logout");
                    this.props.history.push("/");
                    window.location.reload();

                } else {
                    this.setState({
                        CarName: response.data,
                    })
                }
                ;
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
        );
    }


    handleSubmit(e) {
        e.preventDefault();


        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();


        if (this.checkBtn.context._errors.length === 0) {
            CarService.addCarMechanic(
                this.state.CarModel,
                this.state.CarProductionYear,
                this.state.FuelTypeId,
                this.state.CarVin,
                this.state.CarPlates,
                this.state.UserEmail
            ).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    if (error.response.status === 400) {
                        this.setState({
                            loading: false,
                            message:
                                "Już istnieje samochód z podanym numerem VIN lub rejestracyjnym",
                        });
                    } else
                        this.setState({
                            loading: false,
                            message: resMessage,
                        });
                }
            );
        } else {
            this.setState({
                loading: false,
            });
        }
    }

    render() {
        const {
            allUsers, CarProduction, CarName, CarNameModel
        } = this.state;
        return (
            <div className="container">
                <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Dodaj samochód
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Form
                                onSubmit={this.handleSubmit}
                                ref={(c) => {
                                    this.form = c;
                                }}
                            >
                                <div className="mb-4">
                                    <label htmlFor="name">Marka</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        onChange={this.onChangeCarManufacturer}
                                        validations={[required, NotChoosedManufacturer]}
                                    >
                                        <option value="0">wybierz markę</option>

                                        {CarName.map((CarName) => (

                                            <option value={CarName}>{CarName} </option>

                                        ))}
                                    </Select>
                                    {this.state.CarManufacturer === "" ? (<></>) : (<div>
                                        {this.state.choosed === true ? (
                                            <div> {this.getNames(this.state.CarManufacturer)}</div>) : (<div></div>)}
                                    </div>)}
                                    <label htmlFor="name">Model</label>
                                    <Select

                                        className="form-select"
                                        aria-label="Default select example"
                                        validations={[required, NotChoosedModel]}
                                        onChange={this.onChangeCarModel}

                                    >
                                        <option value="0">Wybierz model</option>


                                        {CarNameModel.map((CarNameModel) => (


                                            <option value={CarNameModel.carNameId}>{CarNameModel.carNameModel} </option>

                                        ))}

                                    </Select>

                                    <label htmlFor="name">Rok produkcji</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        onChange={this.onChangeCarProductionYear}
                                        validations={[required, NotChoosedYear]}
                                    >
                                        <option value="0">Wybierz rok produkcji</option>
                                        {CarProduction.map((CarProduction) => (

                                            <option
                                                value={CarProduction.carProductionId}>{CarProduction.carProductionYear} </option>

                                        ))}
                                    </Select>
                                    <label htmlFor="name">Typ paliwa</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        value={this.state.FuelTypeId}
                                        onChange={this.onChangeCarFuelTypeId}
                                        validations={[required, NotChoosedFuel]}
                                    >
                                        <option value="0">Wybierz paliwo</option>
                                        <option value="1">Benzyna</option>
                                        <option value="2">Diesel</option>
                                        <option value="3">Elektryczny</option>
                                        <option value="4">Benzyna + LPG</option>
                                        <option value="5">Benzyna + CNG</option>
                                        <option value="6">Hybryda</option>
                                        <option value="7">Wodór</option>
                                        <option value="8">Inne</option>

                                    </Select>
                                    <div className="form-group">
                                        <label htmlFor="VIN">Numer VIN</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="VIN"
                                            value={this.state.CarVin}
                                            onChange={this.onChangeCarVin}
                                            validations={[required, vin]}

                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Plates">Numer rejestracyjny</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="plates"
                                            pattern="[A-Za-z]{2,3} [0-9A-Za-z]{4,5}"
                                            value={this.state.CarPlates}
                                            onChange={this.onChangeCarPlates}
                                            validations={[required]}

                                        />
                                    </div>
                                    <label htmlFor="name">Klient</label>

                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        validations={[required, NotChoosedClient]}
                                        onChange={this.onChangeUserEmail}
                                    >
                                        <option value="0">Wybierz klienta</option>
                                        {allUsers.map((allUsers) => (
                                            <>
                                                {allUsers.roleId === 1 ? (<>
                                                    <option
                                                        value={allUsers.userEmail}>{allUsers.userName} {allUsers.userSurname.slice(0, allUsers.userSurname.length - (allUsers.userSurname.length - 1)) + "..."}</option>
                                                </>) : (<></>)}


                                            </>))}

                                    </Select>
                                </div>
                                <Stack direction="horizontal" gap={3}>
                                    <button
                                        className="btn btn-primary btn-block ps-5 pe-5"
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Ok</span>
                                    </button>
                                    <Button className="ms-auto ps-5 pe-5" variant="danger"
                                            onClick={this.props.onHide}>Anuluj</Button>
                                </Stack>

                                {this.state.message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {this.state.message}
                                        </div>
                                    </div>
                                )}
                                <CheckButton
                                    style={{display: "none"}}
                                    ref={(c) => {
                                        this.checkBtn = c;
                                    }}
                                />
                            </Form>
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
