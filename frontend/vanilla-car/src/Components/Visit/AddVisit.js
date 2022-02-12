import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import CarService from "../../Services/CarService";
import Events from "../../Other/Events";
import AuthenticateService from "../../Services/AuthenticateService";
import VisitService from "../../Services/VisitService";
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
const minimaldate = (value) => {
    let curdate = new Date().toLocaleString("sv-SE", {hour12: false}).replace(',', '').slice(0, 16)
    let curval = value.replace('T', ' ')
    if (curval < curdate) {
        return (
            <div className="alert alert-danger" role="alert">
                Wybrana została zła data
            </div>
        );
    }
};
const NotChoosedType = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać typ wizyty
            </div>
        );
    }
};
const NotChoosedCar = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać samochód
            </div>
        );
    }
};
const NotChoosedMechanic = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać mechanika
            </div>
        );
    }
};
const minimalhour = (value) => {
    let curval = value.replace('T', ' ').slice(11)
    let hours=curval.slice(0,-3).toString();
    if (parseInt(hours) <10||parseInt(hours)>18) {
        return (
            <div className="alert alert-danger" role="alert">
                Zapisy na wizytę prowadzone są od 10 do 18
            </div>
        );
    }
};
const NotSunday = (value) => {
    let date=new Date(value);
    let localedate=date.toLocaleDateString("en-EN", { weekday: 'long' });
    if (localedate==="Sunday") {
        return (
            <div className="alert alert-danger" role="alert">
                W niedziele, warsztat jest nieczynny
            </div>
        );
    }
};

export class AddVisit extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeVisitDateTime = this.onChangeVisitDateTime.bind(this);
        this.onChangeVisitTypeId = this.onChangeVisitTypeId.bind(this);
        this.onChangeCarId = this.onChangeCarId.bind(this);
        this.onChangeMechanicId = this.onChangeMechanicId.bind(this);

        this.state = {
            VisitDateTime: "",
            VisitTypeId: "",
            CarId: "",
            MechanicId: "",
            loading: false,
            message: "",
            allCars: [],
            getMechanics: [],
        };
    }

    onChangeVisitDateTime(e) {
        this.setState({
            VisitDateTime: e.target.value,
        });
    }

    onChangeVisitTypeId(e) {
        this.setState({
            VisitTypeId: e.target.value,
        });
    }

    onChangeCarId(e) {
        this.setState({
            CarId: e.target.value,
        });
    }

    onChangeMechanicId(e) {
        this.setState({
            MechanicId: e.target.value,
        });
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/login"});
        this.setState({currentUser: currentUser, userReady: true});
        if (currentUser === null) {
        } else {
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
                            allCars: response.data,
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
            )
        }
        ;
        AuthenticateService.getMechanics().then(
            (response) => {
                if (response === undefined) {
                    Events.dispatch("logout");
                    this.props.history.push("/");
                    window.location.reload();

                } else {
                    this.setState({
                        getMechanics: response.data,
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

    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            VisitService.addVisit(
                this.state.VisitDateTime,
                this.state.VisitTypeId,
                this.state.CarId,
                this.state.MechanicId
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
                                "Podany termin dla tego mechanika jest zajęty, wybierz inny",
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
        const {allCars, getMechanics} = this.state;

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
                            Dodaj wizytę
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
                                    <div className="form-group">
                                        <label htmlFor="manufacturer">Data i godzina</label>
                                        <Input
                                            type="datetime-local"
                                            className="form-control"
                                            name="manufacturer"
                                            value={this.state.VisitDateTime}
                                            onChange={this.onChangeVisitDateTime}
                                            validations={[required, minimaldate,minimalhour,NotSunday]}
                                        />
                                    </div>
                                    <label htmlFor="name">Typ wizyty</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        value={this.state.VisitTypeId}
                                        onChange={this.onChangeVisitTypeId}
                                        validations={[required, NotChoosedType]}
                                    >
                                        <option value="0">Wybierz typ wizyty</option>
                                        <option value="1">Naprawa mechanicza</option>
                                        <option value="2">Naprawa elektryczna</option>
                                        <option value="3">Naprawa kompleksowa</option>
                                        <option value="4">Naprawa powypadkowa</option>
                                        <option value="5">Naprawa inne</option>
                                        <option value="6">Konsultacja</option>
                                        <option value="7">Przegląd</option>
                                        <option value="8">Wymiana opon</option>
                                        <option value="9">Nie wiem</option>
                                        <option value="10">Inne</option>
                                    </Select>
                                    <label htmlFor="name">Samochód</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        onChange={this.onChangeCarId}
                                        validations={[required, NotChoosedCar]}
                                    >
                                        <option value="0">Wybierz samochód</option>
                                        {allCars.map((allCars) => (
                                            <option value={allCars.carId}>
                                                {allCars.carName.carNameManufacturer} | {allCars.carName.carNameModel} | {allCars.carPlates}
                                            </option>
                                        ))}
                                    </Select>
                                    <label htmlFor="name">Mechanik</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        onChange={this.onChangeMechanicId}
                                        validations={[required, NotChoosedMechanic]}
                                    >
                                        <option value="0">Wybierz mechanika</option>
                                        {getMechanics.map((getMechanics) => (
                                            <option value={getMechanics.userId}>
                                                {getMechanics.userName} {" "}
                                                {getMechanics.userSurname.slice(0, getMechanics.userSurname.length - (getMechanics.userSurname.length - 1)) + "..."}

                                            </option>
                                        ))}
                                    </Select></div>

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
