import React, {Component} from "react";
import {Modal} from "react-bootstrap";


export class BossManual extends Component {


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
                            Instrukcja dla szefa
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            W panelu wizyty można dodać dostawę, edytować lub ją usunać. Również tutaj możesz dodać opis
                            wizyty
                            Po skończeniu naprawy kliknij dodaj płatność aby wystawić rachunek. Klient musi wybrać
                            metodę płatności i opłacić.
                            Następnie trzeba potwierdzić skończenie wizyty aby wizyta przeszła do historii </p>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
