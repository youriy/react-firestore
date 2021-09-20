import firebase from "../firebase.jsx";
import {
    doc,
    setDoc,
    deleteDoc,
    addDoc,
    collection,
    getDocs,
    getDoc,
} from "firebase/firestore";

class DataService {
    getAllServices() {
        return getDocs(collection(firebase, "services"))
            .then((querySnapshot) => {
                let result = [];
                querySnapshot.forEach((doc) => {
                    result.push({
                        id: doc.id,
                        description: doc.data().description,
                        image_ref: doc.data().image_ref,
                        action: doc.id,
                    });
                });
                return result;
            })
            .catch((error) => {
                console.log("Ошибка при получении services: " + error.message);
                return [];
            });
    }

    getAllContracts() {
        return getDocs(collection(firebase, "contracts"))
            .then((querySnapshot) => {
                let result = [];
                querySnapshot.forEach((doc) => {
                    result.push({
                        id: doc.id,
                        advantages: doc.data().advantages,
                        image_ref: doc.data().image_ref,
                        short_info: doc.data().short_info,
                        action: doc.id,
                    });
                });
                return result;
            })
            .catch((error) => {
                console.log("Ошибка при получении contracts: " + error.message);
                return [];
            });
    }

    getAllLessonTypes() {
        return getDocs(collection(firebase, "lesson_types"))
            .then((querySnapshot) => {
                let result = [];
                querySnapshot.forEach((doc) => {
                    result.push({
                        id: doc.id,
                        description: doc.data().description,
                        image_ref: doc.data().image_ref,
                        action: doc.id,
                    });
                });
                return result;
            })
            .catch((error) => {
                console.log(
                    "Ошибка при получении lesson_types: " + error.message
                );
                return [];
            });
    }

    getAllMasters() {
        return getDocs(collection(firebase, "masters"))
            .then((querySnapshot) => {
                let result = [];
                querySnapshot.forEach((doc) => {
                    result.push({
                        id: doc.id,
                        achievements: doc.data().achievements,
                        specialization: doc.data().specialization,
                        top: doc.data().top,
                        action: doc.id,
                    });
                });
                return result;
            })
            .catch((error) => {
                console.log("Ошибка при получении masters: " + error.message);
                return [];
            });
    }

    getAllServiceCats() {
        return getDocs(collection(firebase, "service_cats"))
            .then((querySnapshot) => {
                let result = [];
                querySnapshot.forEach((doc) => {
                    result.push({
                        id: doc.id,
                        image_ref: doc.data().image_ref,
                        action: doc.id,
                    });
                });
                return result;
            })
            .catch((error) => {
                console.log(
                    "Ошибка при получении service_cats: " + error.message
                );
                return [];
            });
    }

    getAllTour() {
        return getDocs(collection(firebase, "tour"))
            .then((querySnapshot) => {
                let result = [];
                querySnapshot.forEach((doc) => {
                    result.push({
                        id: doc.id,
                        date: doc.data().date,
                        sent: doc.data().sent,
                        action: doc.id,
                    });
                });
                return result;
            })
            .catch((error) => {
                console.log("Ошибка при получении tour: " + error.message);
                return [];
            });
    }

    updateOrCreate(collection, id, value) {
        return setDoc(doc(firebase, collection, id), value);
    }

    delete(id, collection) {
        return deleteDoc(doc(firebase, collection, id));
    }

    add(collect, value) {
        return addDoc(collection(firebase, collect), value);
    }

    getById(collect, id) {
        return getDoc(doc(firebase, collect, id));
    }
}

export default new DataService();
