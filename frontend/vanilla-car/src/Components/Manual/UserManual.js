import React, {Component} from "react";
import {Modal} from "react-bootstrap";


export class UserManual extends Component {


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
                            Instrukcja dla klienta
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Przy pierwszej rejestracji wizyty, przejdź do panelu samochodów i dodaj nowy samochód,
                            kolejno, kliknij przycisk nowa wizyta, wypełnij dane. Gdy to zrobisz w bieżących wizytach
                            pojawi się twoja wizyta.
                            Tutaj możesz wyświetlić podsumowanie przyciskiem po prawej, poniżej znajduje się kod QR
                            twojej wizyty. Po jego kliknięciu kod pobierze się na urządzenie.
                            Po kliknięciu na wizytę, uzyskasz dostęp do akcji związanych z wizytą. Tutaj możesz edytować
                            wizytę, odwołać wizytę, dodać odbiór lub dostawę.
                            Po dodaniu płatności przez mechanika, wybierz metodę płatności i zapłać. Wtedy po
                            potwierdzeniu przez mechanika wizyta przechodzi do historii.
                        </p>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
