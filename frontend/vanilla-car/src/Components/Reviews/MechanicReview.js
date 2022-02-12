import React, {Component} from "react";
import {Button, Modal, Row, Stack} from "react-bootstrap";
import ReviewService from "../../Services/ReviewService";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
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
const NotChoosed = (value) => {
    if (value === "0") {
        return (
            <div className="alert alert-danger" role="alert">
                Proszę wybrać ocenę
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

export class MechanicReview extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeReviewName = this.onChangeReviewName.bind(this);
        this.onChangeMechanicReviewScoreId = this.onChangeMechanicReviewScoreId.bind(this);
        this.onChangeUserId = this.onChangeUserId.bind(this);

        this.state = {
            ReviewName: "",
            MechanicReviewScoreId: "",
            UserId: "",
            loading: false,
            message: "",
            currentUser: {},
            getMechanics: []
        };
    }

    onChangeReviewName(e) {
        this.setState({
            ReviewName: e.target.value,
        });
    }

    onChangeMechanicReviewScoreId(e) {
        this.setState({
            MechanicReviewScoreId: e.target.value,
        });
    }

    onChangeUserId(e) {
        this.setState({
            UserId: e.target.value,
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
            ReviewService.addMechanicReview(
                this.state.ReviewName,
                this.state.MechanicReviewScoreId,
                this.state.UserId
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
                                "Dodałeś już recenzję dla tego mechanika",
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
            getMechanics
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
                            Oceń mechanika
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
                                        <label htmlFor="name">Opis</label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={this.state.ReviewName}
                                            onChange={this.onChangeReviewName}
                                            validations={[required]}
                                        />
                                    </div>
                                    <label htmlFor="name">Ocena</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        value={this.state.MechanicReviewScoreId}
                                        onChange={this.onChangeMechanicReviewScoreId}
                                        validations={[required, NotChoosed]}
                                    >
                                        <option value="0">Wybierz ocenę</option>
                                        <option value="1">⋆</option>
                                        <option value="2">⋆⋆</option>
                                        <option value="3">⋆⋆⋆</option>
                                        <option value="4">⋆⋆⋆⋆</option>
                                        <option value="5">⋆⋆⋆⋆⋆</option>
                                    </Select>
                                    <label htmlFor="name">Wybierz mechanika</label>
                                    <Select
                                        className="form-select"
                                        aria-label="Default select example"
                                        onChange={this.onChangeUserId}
                                        validations={[required, NotChoosedMechanic]}
                                    >
                                        <option value="0">Wybierz mechanika</option>
                                        {getMechanics.map((getMechanics) => (

                                            <option
                                                value={getMechanics.userId}>{getMechanics.userName} {getMechanics.userSurname.slice(0, getMechanics.userSurname.length - (getMechanics.userSurname.length - 1)) + "..."}
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
