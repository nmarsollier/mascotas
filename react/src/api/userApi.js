import axios from "axios"

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

export function getCurrentToken() {
    return localStorage.getItem('token')
}

function setCurrentToken(token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = "bearer " + token;
}

export function getCurrentUser() {
    return localStorage.getItem('user')
}

export function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return new Promise(function (resolve, reject) {
        axios.get("http://localhost:3000/v1/user/signout")
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

export function login(payload) {
    return new Promise(function (resolve, reject) {
        axios.post("http://localhost:3000/v1/user/signin",
            payload)
            .then(res => {
                setCurrentToken(res.data.token)
                resolve(res.data)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

export function reloadCurrentUser() {
    return new Promise(function (resolve, reject) {
        if (getCurrentToken() !== undefined) {
            axios.get("http://localhost:3000/v1/users/current")
                .then(res => {
                    localStorage.setItem('user', res.data);
                    resolve(res.data)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        }
    })
}

export function newUser(payload) {
    return new Promise(function (resolve, reject) {
        if (getCurrentToken() !== undefined) {
            axios.post("http://localhost:3000/v1/user", payload)
                .then(res => {
                    setCurrentToken(res.data.token)
                    resolve(res.data)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        }
    })
}

if (getCurrentToken() !== undefined) {
    setCurrentToken(getCurrentToken())
}
