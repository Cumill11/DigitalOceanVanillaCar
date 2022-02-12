import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";
import {isEmail} from "validator";
import {Redirect} from "react-router-dom";
import {Card, Col, Container, Row} from "react-bootstrap";
import VisitService from "../../../Services/VisitService";
import AuthenticateService from "../../../Services/AuthenticateService";
import Events from "../../../Other/Events";


const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Pole wymagane
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
const NotChoosedVisit = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać typ wizyty
            </div>
        );
    }
};
const email = (value) => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                Podaj prawidłowy E-mail
            </div>
        );
    }
};
const telephone = (value) => {
    if (value.length <= 8 || value.length > 16) {
        return (
            <div className="alert alert-danger" role="alert">
                Numer musi miec 9 cyfr
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


export default class NotRegistered extends Component {
    state = {redirect: null};

    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeVisitDateTime = this.onChangeVisitDateTime.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.onChangeUserTelephone =
            this.onChangeUserTelephone.bind(this);
        this.onChangeVisitTypeId = this.onChangeVisitTypeId.bind(this);
        this.onChangeMechanicId = this.onChangeMechanicId.bind(this);

        this.state = {
            VisitDateTime: "",
            UserEmail: "",
            UserTelephone: "",
            VisitTypeId: "",
            VisitCode: "",
            MechanicId: "",
            getMechanics: [],
            loading: false,
            successful: false,
            message: "",
        };
    }

    onChangeVisitDateTime(e) {
        this.setState({
            VisitDateTime: e.target.value,
        });
    }

    onChangeUserEmail(e) {
        this.setState({
            UserEmail: e.target.value,
        });
    }

    onChangeUserTelephone(e) {
        this.setState({
            UserTelephone: e.target.value,
        });
    }

    onChangeVisitTypeId(e) {
        this.setState({
            VisitTypeId: e.target.value,
        });
    }

    onChangeMechanicId(e) {
        this.setState({
            MechanicId: e.target.value,
        });
    }

    componentDidMount() {
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
            }
        );
    }

    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false,
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            VisitService.addVisitNotRegistered(
                this.state.VisitDateTime,
                this.state.UserEmail,
                this.state.UserTelephone,
                this.state.VisitTypeId,
                this.state.MechanicId
            ).then(
                (response) => {
                    this.setState({
                        message: "Zarejestrowano",
                        successful: true,
                        VisitCode: response.data
                    });
                    this.setState({
                        redirect: "/codenotregistered?code=" + this.state.VisitCode
                    });
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
                                "Błąd, sprawdź podane dane",
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
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>;
        }
        const {
            getMechanics,
        } = this.state;


        return (
            <div>
                <Container>
                    <Row className="justify-content-md-center">

                        <Col xs lg="4">
                            <Form
                                onSubmit={this.handleRegister}
                                ref={(c) => {
                                    this.form = c;
                                }}
                            >
                                {!this.state.successful && (
                                    <div>
                                        <Card>
                                            <Card.Header as="h3">Nowa wizyta bez rejestracji</Card.Header>
                                            <Card.Body>

                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        name="email"
                                                        value={this.state.UserEmail}
                                                        onChange={this.onChangeUserEmail}
                                                        validations={[required, email]}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="telephone">Telefon</label>
                                                    <Input
                                                        type="tel"
                                                        className="form-control"
                                                        name="telephone"
                                                        pattern="[0-9]{9}|[0-9]{3} [0-9]{3} [0-9]{3}|[+0-9]{3,4} [0-9]{9}|[+0-9]{3,4} [0-9]{3} [0-9]{3} [0-9]{3}"
                                                        minlength="9"
                                                        maxlength="15"
                                                        value={this.state.UserTelephone}
                                                        onChange={this.onChangeUserTelephone}
                                                        validations={[required, telephone]}
                                                    />
                                                </div>
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
                                                            {getMechanics.userName} {getMechanics.userSurname}{" "}
                                                        </option>
                                                    ))}
                                                </Select>
                                                <label htmlFor="name">Typ wizyty</label>
                                                <Select
                                                    className="form-select"
                                                    aria-label="Default select example"
                                                    value={this.state.VisitTypeId}
                                                    onChange={this.onChangeVisitTypeId}
                                                    validations={[required, NotChoosedVisit]}
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


                                                <div className="d-grid gap-2 mt-4">
                                                    <button
                                                        className="btn btn-primary btn-block"
                                                        disabled={this.state.loading}
                                                    >
                                                        {this.state.loading && (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        )}
                                                        <span>Potwierdź</span>
                                                    </button>
                                                </div>

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
                                            </Card.Body>
                                        </Card>
                                    </div>
                                )}
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
