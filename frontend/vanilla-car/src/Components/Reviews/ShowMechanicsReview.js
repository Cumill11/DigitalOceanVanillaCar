import React, {Component} from "react";
import {Button, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import ReviewService from "../../Services/ReviewService";
import Events from "../../Other/Events";
import AuthenticateService from "../../Services/AuthenticateService";
import {MechanicUpdateReview} from "./MechanicUpdateReview";

export class ShowMechanicsReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: {},
            getMechanic: [
                {
                    userId: "",
                },
            ],
            getReviews: [
                {
                    reviewName: "",
                    mechanicReviewScoreId: "",
                    user: {
                        userName: "",
                        userSurname: "",
                    },
                },
            ],
            loading: false,
            message: "",
            MechanicReviewUpdateShow: false,
        };
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();
        AuthenticateService.getMechanics().then(
            (response) => {
                if (response === undefined) {
                    Events.dispatch("logout");
                    this.props.history.push("/");
                    window.location.reload();

                } else {
                    this.setState({
                        getMechanic: response.data,
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
        if (currentUser === null) {
        } else {
            ReviewService.getMechanicReview(currentUser.id).then(
                (response) => {
                    if (response === undefined) {
                        Events.dispatch("logout");
                        this.props.history.push("/");
                        window.location.reload();

                    } else {
                        this.setState({
                            getReviews: response.data,
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
            )
        }
        ;
    }

    deleteMechanicReview(reviewId) {
        if (window.confirm("Jesteś pewny?")) {
            ReviewService.deleteMechanicReview(reviewId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    render() {
        const {
            getReviews,
            getMechanic,
            mechanicreviewid,
            mechanicreviewname,
            mechanicreviewscoreid,
        } = this.state;
        let MechanicReviewUpdateClose = () =>
            this.setState({MechanicReviewUpdateShow: false});


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
                            Twoje recenzje mechaników
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup>
                            {getReviews.length === 0 ? (
                                <div>Nie dodałeś jeszcze żadnej recenzji</div>
                            ) : (
                                <div>
                                    {getReviews.map((getReviews) => (
                                        <p key={getReviews.reviewId}>
                                            <ListGroupItem>
                                                {" "}
                                                Imię i nazwisko mechanika:
                                                {getMechanic.map((getMechanic) => (
                                                    <div key={getMechanic.userId}>
                                                        {getMechanic.userId === getReviews.mechanicId ? (
                                                            <div>
                                                                {getMechanic.userName}{" "}
                                                                {getMechanic.userSurname.slice(0, getMechanic.userSurname.length - (getMechanic.userSurname.length - 1)) + "..."}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                ))}
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                Twoja recenzja:
                                                <br></br>
                                                {getReviews.mechanicReviewName}
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                Liczba gwiazdek:
                                                {getReviews.mechanicReviewScoreId === 1 ? (
                                                    <div>⋆</div>
                                                ) : getReviews.mechanicReviewScoreId === 2 ? (
                                                    <div>⋆⋆</div>
                                                ) : getReviews.mechanicReviewScoreId === 3 ? (
                                                    <div>⋆⋆⋆</div>
                                                ) : getReviews.mechanicReviewScoreId === 4 ? (
                                                    <div>⋆⋆⋆⋆</div>
                                                ) : getReviews.mechanicReviewScoreId === 5 ? (
                                                    <div>⋆⋆⋆⋆⋆</div>
                                                ) : null}
                                            </ListGroupItem>

                                            <div className="d-grid gap-2">
                                                <Button
                                                    className="mt-4"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        this.setState({
                                                            MechanicReviewUpdateShow: true,
                                                            mechanicreviewid: getReviews.mechanicReviewId,
                                                            mechanicreviewname: getReviews.mechanicReviewName,
                                                            mechanicreviewscoreid:
                                                            getReviews.mechanicReviewScoreId,
                                                        })
                                                    }
                                                >
                                                    Edytuj
                                                </Button>
                                                <Button
                                                    className="mr-2"
                                                    variant="danger"
                                                    onClick={() =>
                                                        this.deleteMechanicReview(
                                                            getReviews.mechanicReviewId
                                                        )
                                                    }
                                                >
                                                    Usuń
                                                </Button>
                                                <MechanicUpdateReview
                                                    show={this.state.MechanicReviewUpdateShow}
                                                    onHide={MechanicReviewUpdateClose}
                                                    mechanicreviewid={mechanicreviewid}
                                                    mechanicreviewname={mechanicreviewname}
                                                    mechanicreviewscoreid={mechanicreviewscoreid}
                                                />
                                            </div>
                                        </p>
                                    ))}
                                </div>
                            )}
                        </ListGroup>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>
                            Anuluj
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
