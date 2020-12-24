let timer;

export default {
    async login(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'login'
        })
    },
    async signup(context, payload) {
        return context.dispatch('auth', {
            ...payload,
            mode: 'signup'
        })
    },
    logout(context) {
        context.commit('setUser', {
            token: null,
            userId: null,
        })
        clearTimeout(timer)
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('tokenExpiration')
    },
    async auth(context, payload) {
        const mode = payload.mode;
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAkKqnApL97drP06M24dL12NB1-g0ay7Ks';
        if (mode === 'signup') {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAkKqnApL97drP06M24dL12NB1-g0ay7Ks';
        }
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            })
        })
        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(
                responseData.message || 'Failed to authenticate. Check your login data.'
            );
            throw error;
        }
        const expiresIn = +responseData.expiresIn * 1000;
        const exporationDate = new Date().getTime() + expiresIn;

        localStorage.setItem('token', responseData.idToken);
        localStorage.setItem('userId', responseData.localId);
        localStorage.setItem('tokenExpiration', exporationDate);

        timer = setTimeout(() => {
            context.dispatch('autoLogout');
        }, expiresIn);

        context.commit('setUser', {
            token: responseData.idToken,
            userId: responseData.localId,
            tokenExpiration: exporationDate
        });
    },
    autoLogin(context) {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        const expiresIn = +tokenExpiration - new Date().getTime();

        if (expiresIn < 0) {
            return;
        }

        timer = setTimeout(() => {
            context.dispatch('autoLogout')
        }, expiresIn);

        if (token && userId) {
            context.commit('setUser', {
                token: token,
                userId: userId,
            })
        }
    },
    autoLogout(context) {
        context.dispatch('logout')
        context.commit('setAutoLogout')
    }
};