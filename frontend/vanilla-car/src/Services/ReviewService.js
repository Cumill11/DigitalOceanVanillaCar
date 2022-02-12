import axios from "axios";
import AuthenticateHeader from "./AuthenticateHeader";

// const API_URL = "http://localhost:5000/api/Review";
// const API_URL_2 = "http://localhost:5000/api/MechanicReview";

const API_URL = "https://do.vanillacar.me:8888/api/Review";
const API_URL_2 = "https://do.vanillacar.me:8888/api/MechanicReview";


class ReviewService {
    addReview(ReviewName, MechanicReviewScoreId) {
        return axios.post(
            API_URL,
            {ReviewName, MechanicReviewScoreId},
            {headers: AuthenticateHeader()}
        );
    }

    addMechanicReview(MechanicReviewName, MechanicReviewScoreId, mechanicId) {
        return axios.post(
            API_URL_2,
            {MechanicReviewName, MechanicReviewScoreId, mechanicId},
            {headers: AuthenticateHeader()}
        );
    }

    updateReview(ReviewId, ReviewName, MechanicReviewScoreId) {
        return axios.put(
            API_URL + "/" + ReviewId,
            {ReviewName, MechanicReviewScoreId},
            {headers: AuthenticateHeader()}
        );
    }

    mechanicUpdateReview(MechanicReviewId, MechanicReviewName, MechanicReviewScoreId) {
        return axios.put(
            API_URL_2 + "/" + MechanicReviewId,
            {MechanicReviewName, MechanicReviewScoreId},
            {headers: AuthenticateHeader()}
        );
    }


    getReview(UserId) {
        return axios.get(API_URL + "/" + UserId, {headers: AuthenticateHeader()});
    }

    getReviewForMechanic(UserId) {
        return axios.get(API_URL_2 + "/mechanic/" + UserId, {headers: AuthenticateHeader()});
    }

    getReviews() {
        return axios.get(API_URL, {headers: AuthenticateHeader()});
    }

    getMechanicReview(UserId) {
        return axios.get(API_URL_2 + "/" + UserId, {headers: AuthenticateHeader()});

    }

    deleteReview(reviewId) {
        return axios.delete(API_URL + "/" + reviewId, {
            headers: AuthenticateHeader(),
        });
    }

    deleteMechanicReview(reviewId) {
        return axios.delete(API_URL_2 + "/" + reviewId, {
            headers: AuthenticateHeader(),
        });
    }
}

export default new ReviewService();
