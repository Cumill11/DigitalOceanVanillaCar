import React, {Component} from "react";
import {Button, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import ReviewService from "../../Services/ReviewService";
import Events from "../../Other/Events";
import AuthenticateService from "../../Services/AuthenticateService";

export class ShowOneMechanicReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: {},
            test: "",
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
        };
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();
        if (currentUser === null) {
        } else {
            ReviewService.getReviewForMechanic(currentUser.id).then(
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

    deleteReview(reviewId) {
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
        const {getReviews} = this.state;

        var test = 0;
        var parse = 0;
        getReviews.map(
            (getReviews) => ((parse += getReviews.mechanicReviewScoreId, test++))
        );
        var result = Math.ceil(parse / test);

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
                            Wszystkie oceny
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {" "}
                        {getReviews.length === 0 ? (
                            <div>
                                <p>Nie została dodana jeszcze żadna recenzja</p>
                            </div>
                        ) : (
                            <div>
                                {getReviews.map((getReviews) => (
                                    <div key={getReviews.reviewId}>
                                        <ListGroup>


                                            <ListGroupItem>
                                                Recenzja: <br></br>
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

                                            <Button
                                                className="mt-2 mb-2"
                                                variant="danger"
                                                onClick={() => this.deleteReview(getReviews.mechanicReviewId)}
                                            >
                                                Usuń
                                            </Button>
                                        </ListGroup>

                                    </div>
                                ))}
                                <ListGroup>
                                    <ListGroupItem className="mt-4">
                                        Średnia wszystkich ocen to:
                                        {result === 1 ? (
                                            <div>⋆</div>
                                        ) : result === 2 ? (
                                            <div>⋆⋆</div>
                                        ) : result === 3 ? (
                                            <div>⋆⋆⋆</div>
                                        ) : result === 4 ? (
                                            <div>⋆⋆⋆⋆</div>
                                        ) : result === 5 ? (
                                            <div>⋆⋆⋆⋆⋆</div>
                                        ) : null}
                                    </ListGroupItem>
                                </ListGroup>
                            </div>
                        )}
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
