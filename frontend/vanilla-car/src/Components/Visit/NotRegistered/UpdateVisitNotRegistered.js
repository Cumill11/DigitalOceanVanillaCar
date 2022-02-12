import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Events from "../../../Other/Events";
import AuthenticateService from "../../../Services/AuthenticateService";
import VisitService from "../../../Services/VisitService";
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

export class UpdateVisitNotRegistered extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeVisitDateTime = this.onChangeVisitDateTime.bind(this);
        this.onChangeVisitTypeId = this.onChangeVisitTypeId.bind(this);

        this.state = {
            VisitDateTime: "",
            VisitTypeId: "",
            loading: false,
            message: "",
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

    async handleSubmit(e) {
        e.preventDefault();

        if (this.state.MechanicId === 0 || this.state.MechanicId === "") {
            await this.setState({
                MechanicId: this.props.mechanicid,
            });
        }
        if (this.state.VisitDateTime === "") {
            await this.setState({
                VisitDateTime: this.props.visitdatetime,
            });
        }
        if (this.state.VisitTypeId === "") {
            await this.setState({
                VisitTypeId: this.props.visittypeid,
            });
        }

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            VisitService.UpdateVisitNotRegistered(
                this.props.visitid,
                this.state.VisitDateTime,
                this.state.VisitTypeId,
                this.props.userid
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
                            Edytuj wizytę
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
                                            value={this.props.visitdatetime}
                                            onChange={this.onChangeVisitDateTime}
                                            validations={[required]}
                                        />
                                    </div>
                                    <label htmlFor="name">Typ wizyty</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        onChange={this.onChangeVisitTypeId}
                                    >
                                        <option value={this.props.visittypeid}>{this.props.visittypeid === 1 ? (
                                            "Naprawa mechaniczna"
                                        ) : this.props.visittypeid === 2 ? (
                                            "Naprawa elektryczna"
                                        ) : this.props.visittypeid === 3 ? (
                                            "Naprawa kompleksowa"
                                        ) : this.props.visittypeid === 4 ? (
                                            "Naprawa powypadkowa"
                                        ) : this.props.visittypeid === 5 ? (
                                            "Naprawa inne"
                                        ) : this.props.visittypeid === 6 ? (
                                            "Konsulatacja"
                                        ) : this.props.visittypeid === 7 ? (
                                            "Przegląd"
                                        ) : this.props.visittypeid === 8 ? (
                                            "Wymiana opon"
                                        ) : this.props.visittypeid === 9 ? (
                                            "Nie wiem"
                                        ) : this.props.visittypeid === 10 ? (
                                            "Inne"
                                        ) : (
                                            <div></div>
                                        )}</option>
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
