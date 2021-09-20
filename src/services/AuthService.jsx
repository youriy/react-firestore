import {
    getAuth,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";

class AuthService {

    constructor() {
        this.auth = getAuth();
    }
    
    signIn(email, password) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    onAuthState() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                return user.uid;
            }

            return false;
        });
    }

    out() {
        return signOut(this.auth);
    }
}

export default new AuthService();
