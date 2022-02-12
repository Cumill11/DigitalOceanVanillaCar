import React from "react";
import {BrowserRouter as Router, useHistory, useLocation} from "react-router-dom";
import AuthenticateService from "../../Services/AuthenticateService";
import {Button, Card, Col, Container, Row} from "react-bootstrap";

export default function EmailConfirm() {
    return (
        <Router>
            <Confirm/>
        </Router>
    );
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Confirm() {
    let history = useHistory();
    let query = useQuery();
    let code = query.get("code");
    let email = query.get("email");
    let currentUser = AuthenticateService.getCurrentUser();
    if (currentUser !== null) {
        history.push("/profile");
        window.location.reload();
    }

    return (
        <div>
            <div>
                <Container>
                    <Row className="justify-content-md-center">

                        <Col xs lg="4">


                            {code === null ? (
                                <Card className="mt-5">
                                    <Card.Header className="text-center bg-danger text-light" as="h3">
                                        Błąd
                                    </Card.Header>
                                    <Card.Body>
                                        <p className="text-center mt-3">Wejdź z linku podanego w mailu</p>

                                    </Card.Body>

                                </Card>) : (<Card className="mt-5">
                                <Card.Header className="text-center" as="h3">
                                    Potwierdź konto
                                </Card.Header>
                                <Card.Body>
                                    <div className="text-center">
                                        <Button
                                            className="btn btn-primary btn-lg"
                                            variant="primary"
                                            onClick={() =>
                                                AuthenticateService.confirmaccount(code, email)
                                                    .then(() => {
                                                        history.push("/login");
                                                        window.location.reload();
                                                    })
                                                    .catch(function (error) {
                                                        if (error.response) {
                                                            if (window.confirm(error.response.data)) {
                                                                history.push("/login");
                                                                window.location.reload();
                                                            }
                                                        }
                                                    })
                                            }
                                        >
                                            Potwierdź
                                        </Button>
                                    </div>
                                </Card.Body>

                            </Card>)}

                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}
