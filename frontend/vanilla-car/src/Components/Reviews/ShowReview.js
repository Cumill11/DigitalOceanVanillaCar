import React, {Component} from "react";
import {Button, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import ReviewService from "../../Services/ReviewService";
import Events from "../../Other/Events";
import AuthenticateService from "../../Services/AuthenticateService";
import {UpdateReview} from "./UpdateReview";


export class ShowReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: {},
            getReviews: [],
            ReviewUpdateShow: false,
            loading: false,
            message: "",
        };
    }

    componentDidMount() {
        const currentUser = AuthenticateService.getCurrentUser();
        if (currentUser === null) {
        } else {
            ReviewService.getReview(currentUser.id).then(
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
            ReviewService.deleteReview(reviewId).then(
                () => {
                    window.location.reload();
                },
                (error) => {
                }
            );
        }
    }

    render() {
        const {getReviews, reviewid, reviewname, mechanicreviewscoreid} =
            this.state;
        let ReviewUpdateClose = () => this.setState({ReviewUpdateShow: false});

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
                            Twoja recenzja warsztatu
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ListGroup>
                            {getReviews.map((getReviews) => (
                                <p key={getReviews.reviewId}>
                                    <ListGroupItem>Twoja recenzja: <br></br>
                                        {getReviews.reviewName} </ListGroupItem>
                                    <ListGroupItem>Liczba gwiazdek:
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
                                        ) : null} </ListGroupItem>

                                    <div className="d-grid gap-2 mt-4">
                                        <Button
                                            className="mr-2"
                                            variant="secondary"
                                            onClick={() =>
                                                this.setState({
                                                    ReviewUpdateShow: true,
                                                    reviewid: getReviews.reviewId,
                                                    reviewname: getReviews.reviewName,
                                                    mechanicreviewscoreid: getReviews.mechanicReviewScoreId,
                                                })
                                            }
                                        >
                                            Edytuj
                                        </Button>
                                        <Button
                                            className="mt-1"
                                            variant="danger"
                                            onClick={() => this.deleteReview(getReviews.reviewId)}
                                        >
                                            Usuń
                                        </Button>
                                        <UpdateReview
                                            show={this.state.ReviewUpdateShow}
                                            onHide={ReviewUpdateClose}
                                            reviewid={reviewid}
                                            reviewname={reviewname}
                                            mechanicreviewscoreid={mechanicreviewscoreid}
                                        /></div>
                                </p>
                            ))}</ListGroup>
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
