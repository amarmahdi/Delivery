const _data = require('./crud')
const helpers = require('./helpers')
const foods = require('./foods')
const stripe = require('stripe')('sk_test_51JAyPxFBFT80zV7HhO162Iwu6702jSBl9FjBIjAPxXg4XRq0hjwvVql9ONs9f8pnSKQ5bwsvMpQkEtMNnOPtNyWT00Dv8TnOxL')
const fs = require('fs')
const path = require('path')

const handlers = {}

handlers.notFound = (data, callback) => {
    callback(404)
}

handlers.ping = (data, callback) => {
    callback(200)
}

handlers.login = (data, callback) => {
    let email = typeof (data.payload.email) == 'string' &&
        data.payload.email.trim().length > 0 ?
        data.payload.email.trim() : false

    let password = typeof (data.payload.password) == 'string' &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() : false

    if (email && password) {
        _data.read('users', email, (err, userData) => {
            if (!err && userData) {
                var hashedPassword = helpers.hash(password)
                // console.log(userData.userId)
                if (hashedPassword == userData.password) {
                    _data.read('tokens', userData.userId, (err, tokenData) => {
                        if (!err && tokenData) {
                            if (tokenData.expire > Date.now()) {
                                tokenData.expire = Date.now() + 1000 * 60 * 60
                                _data.update('tokens', userData.userId, tokenData, (err) => { console.log(err) })
                                callback(200, tokenData)
                            } else {
                                _data.read('users', email, (err, userData) => {
                                    if (!err && userData) {
                                        _data.read('tokens', userData.userId, (err, tokenData) => {
                                            if (!err && tokenData) {
                                                tokenData.expire = Date.now() + 1000 * 60 * 60
                                                _data.update('tokens', userData.userId, tokenData, (err, data) => {
                                                    if (!err && data) {
                                                        callback(200, tokenData)
                                                    } else {
                                                        callback(false)
                                                    }
                                                })
                                            } else {
                                                callback(false)
                                            }
                                        })
                                    } else {
                                        callback(400)
                                    }
                                })
                            }
                        } else {
                            callback(403, { 'err': 'token not found' })
                        }
                    })
                } else {
                    callback(403, { 'err': 'password is not valid' })
                }
            } else {
                callback(404, { 'err': 'user not found ' })
            }
        })
    } else {
        console.log(data.method)
        callback(403, { 'err': 'missing fields' })
    }
}

handlers.foods = (data, callback) => {
    // if (data.method === 'options') {
    //     data.method = data.headers['access-control-request-method'].toLowerCase()
    // }
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    // console.log(userId)

    if (userId) {
        handlers._token.tokenVerify(userId, userId, (tokenIsValid) => {
            if (tokenIsValid) {
                callback(200, foods.menuItems)
            } else {
                callback(403)
            }
        })
    } else {
        callback(403, { 'err': 'err' })
    }
}

handlers.users = (data, callback) => {
    // if (data.method === 'options') {
    //     // data.method = data.headers['access-control-request-method'].toLowerCase()
    // }
    let acceptableData = ['post', 'get', 'put', 'delete', 'options']
    if (acceptableData.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback)
    } else {
        callback(405, { 'err': data.method })
    }
    // console.log(data.method)
}

handlers._users = {}

handlers._users.options = (data, callback) => {
    data.headers['access-control-request-method'] == "POST" ? handlers._users.post(data, callback) : false
    data.headers['access-control-request-method'] == "GET" ? handlers._users.get(data, callback) : false
    data.headers['access-control-request-method'] == "PUT" ? handlers._users.put(data, callback) : false
    data.headers['access-control-request-method'] == "DELETE" ? handlers._users.delete(data, callback) : false
}

handlers._users.post = (data, callback) => {
    let name = typeof (data.payload.name) == 'string' &&
        data.payload.name.trim().length > 0 ?
        data.payload.name.trim() : false

    let email = typeof (data.payload.email) == 'string' &&
        data.payload.email.trim().length > 0 ?
        data.payload.email.trim() : false

    let password = typeof (data.payload.password) == 'string' &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() : false

    let streetAddress = typeof (data.payload.streetAddress) == 'string' &&
        data.payload.streetAddress.trim().length > 0 ?
        data.payload.streetAddress.trim() : false

    let phone = typeof (data.payload.phone) == 'string' &&
        data.payload.phone.trim().length == 10 ?
        data.payload.phone.trim() : false

    if (name && email && password && streetAddress && phone) {
        let userId = helpers.userIdGen(email)
        if (userId) {
            _data.read('users', email, (err, data) => {
                if (err) {
                    let hashedPassword = helpers.hash(password)
                    if (hashedPassword) {
                        stripe.customers.create({
                            name: name,
                            email: email,
                            phone: phone
                        })
                            .then((data) => {
                                let dataObject = {
                                    'customerId': data.id,
                                    'userId': userId,
                                    'name': name,
                                    'email': email,
                                    'phone': phone,
                                    'password': hashedPassword,
                                    'streetAddress': streetAddress
                                }
                                _data.create('users', email, dataObject, (err) => {
                                    if (!err) {
                                        delete dataObject.hashedPassword
                                        callback(200, dataObject)
                                    } else {
                                        callback(500)
                                    }
                                })

                            }).catch(e => console.log(e))
                    } else {
                        callback(400, { "err": "could not hash the password" })
                    }
                } else {
                    callback(403, { 'err': "a user with this email address exists" })
                }
            })
        } else {
            callback(403, { 'err': 'could not create user id' })
        }
    } else {
        callback(400, { 'err': 'missing required field' })
    }
}

handlers._users.get = (data, callback) => {
    let getQuery = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    if (getQuery) {
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
        // console.log(getQuery)
        handlers._token.tokenVerify(getQuery, getQuery, (tokenIsValid) => {
            console.log(tokenIsValid)
            if (tokenIsValid) {
                // console.log(token)
                _data.read('tokens', getQuery, (err, tokenData) => {
                    if (!err && tokenData) {
                        if (tokenData.userId == getQuery) {
                            _data.read('users', tokenData.userEmail, (err, userData) => {
                                if (!err && userData) {
                                    delete userData.password
                                    callback(true, userData)
                                } else {
                                    callback(false)
                                }
                            })
                        } else {
                            callback(404)
                        }
                    } else {
                        callback(404)
                    }
                })
            } else {
                callback(404, { 'err': 'user not authenticated' })
            }
        })
    } else {
        callback(404, { 'err': 'user not found' })
    }
}

handlers._users.put = (data, callback) => {
    let getQuery = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    let name = typeof (data.payload.name) == 'string' &&
        data.payload.name.trim().length > 0 ?
        data.payload.name.trim() : false

    let email = typeof (data.payload.email) == 'string' &&
        data.payload.email.trim().length > 0 ?
        data.payload.email.trim() : false

    let phone = typeof (data.payload.phone) == 'string' &&
        data.payload.phone.trim().length > 0 ?
        data.payload.phone.trim() : false

    let password = typeof (data.payload.password) == 'string' &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() : false

    let streetAddress = typeof (data.payload.streetAddress) == 'string' &&
        data.payload.streetAddress.trim().length > 0 ?
        data.payload.streetAddress.trim() : false

    if (email && name && password && phone && streetAddress) {
        if (getQuery) {
            let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
            handlers._token.tokenVerify(token, getQuery, (tokenIsValid) => {
                if (tokenIsValid) {
                    _data.read('tokens', token, (err, tokenData) => {
                        if (!err && tokenData) {
                            _data.read('users', tokenData.userEmail, (err, userData) => {
                                if (!err && userData) {
                                    if (name) {
                                        userData.name = name
                                    }
                                    if (email) {
                                        var tokenDatas = {
                                            'userId': tokenData.userId,
                                            'token': token,
                                            'userEmail': email,
                                            'expire': data.expire
                                        }
                                        var p = path.join(__dirname, '/../.data/users/')
                                        fs.rename(p + userData.email + '.json', p + email + ".json", () => {
                                            console.log('success')
                                            _data.update('tokens', token, tokenDatas, (err, data) => {
                                                if (!err && data) {
                                                    callback(200)
                                                } else {
                                                    callback(true)
                                                }
                                            })
                                        })
                                        userData.email = email
                                        console.log(p + email)
                                    }
                                    if (password) {
                                        var hashedPassword = helpers.hash(password)
                                        userData.password = hashedPassword
                                    }
                                    if (streetAddress) {
                                        userData.streetAddress = streetAddress
                                    }
                                    if (streetAddress) {
                                        userData.streetAddress = streetAddress
                                    }
                                    console.log(userData)
                                    _data.update('users', email, userData, (err) => {
                                        if (!err) {
                                            delete userData.password
                                            callback(200, userData)
                                        } else {
                                            callback(true)
                                        }
                                    })
                                } else {
                                    callback(400, { "err": "err " })
                                }
                            })

                        } else {
                            callback(404)
                        }
                    })
                } else {
                    callback(404, { 'err': 'user not authenticated' })
                }
            })
        } else {
            callback(404, { 'err': 'user not found' })
        }

    } else {
        callback(400, { "err": "missing fields" })
    }
}

handlers._users.delete = (data, callback) => {
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    let email = typeof (data.payload.email) == 'string' &&
        data.payload.email.trim().length > 0 ?
        data.payload.email.trim() : false

    if (userId && email) {
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
        handlers._token.tokenVerify(token, getQuery, (tokenIsValid) => {
            if (tokenIsValid) {
                _data.delete('users', email, (err) => {
                    if (!err) {
                        callback(false)
                    } else {
                        callback('could not delete user')
                    }
                })
            } else {
                callback(404, { 'err': 'user not authenticated' })
            }
        })
    } else {
        callback(404)
    }
}

handlers.token = (data, callback) => {
    let acceptableData = ['POST', 'GET', 'PUT', 'DELETE']
    if (acceptableData.indexOf(data.method) > -1) {
        handlers._token[data.method](data, callback)
    } else {
        callback(405)
    }
}

handlers._token = {}

handlers._token.tokenVerify = (id, userId, callback) => {
    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            // console.log(tokenData.userId == userId)
            if (tokenData.userId == userId && tokenData.expire > Date.now()) {
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}

handlers._token.post = (data, callback) => {
    // let userId = typeof (data.payload.userId) == 'string' &&
    //     data.payload.userId.trim().length > 0 ?
    //     data.payload.userId.trim() : false

    let userEmail = typeof (data.payload.userEmail) == 'string' &&
        data.payload.userEmail.trim().length > 0 ?
        data.payload.userEmail.trim() : false

    let password = typeof (data.payload.password) == 'string' &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() : false

    if (userEmail && password) {
        _data.read('users', userEmail, (err, userData) => {
            if (!err) {
                let token = helpers.tokenGen(20)
                if (token) {
                    let hashedPassword = helpers.hash(password)
                    if (userData.password == hashedPassword) {
                        let tokenObject = {
                            'userId': userData.userId,
                            'token': token,
                            'userEmail': userEmail,
                            'expire': Date.now() + 1000 * 60 * 60
                        }
                        _data.create('tokens', userData.userId, tokenObject, (err) => {
                            if (!err) {
                                callback(200, tokenObject)
                            } else {
                                callback(true)
                            }
                        })
                    } else {
                        callback(403, { 'err': 'password does not match' })
                    }
                } else {
                    callback(500, { 'err': 'could not generate token' })
                }
            } else {
                callback(400, { 'err': 'could not get user data' })
            }
        })
    } else {
        callback(404, { 'err': 'missing fields' })
    }

}

handlers._token.get = (data, callback) => {
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    if (userId) {
        _data.read('tokens', userId, (err, tokenData) => {
            if (!err && tokenData) {
                callback(200, tokenData)
            } else {
                callback(404)
            }
        })
    } else {
        callback(404, { 'err': 'could not find token or might have expired' })
    }
}

handlers._token.put = (data, callback) => {
    let userId = typeof (data.payload.userId) == 'string' &&
        data.payload.userId.trim().length > 0 ?
        data.payload.userId.trim() : false

    let extend = typeof (data.payload.extend) == 'boolean' &&
        data.payload.extend == true ? true : false


    if (userId && extend) {
        _data.read('tokens', userId, (err, tokenData) => {
            if (!err && tokenData) {
                if (tokenData.expire > Date.now()) {
                    tokenData.expire = Date.now() + 1000 * 60 * 60
                    _data.update('tokens', userId, tokenData, (err) => {
                        if (!err) {
                            callback(200, tokenData)
                        } else {
                            callback(false)
                        }
                    })
                } else {
                    callback(403, { 'err': 'token already epired' })
                }
            } else {
                callback(404)
            }
        })
    } else {
        callback(400, { 'err': 'missing fields' })
    }
}

handlers._token.delete = (data, callback) => {
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    if (userId) {
        _data.delete('tokens', userId, (err) => {
            if (!err) {
                callback(200)
            } else {
                callback(404, { 'err': "token not found" })
            }
        })
    }

}

handlers.cart = (data, callback) => {
    // if (data.method === 'options') {
    //     data.method = data.headers['access-control-request-method'].toLowerCase()
    // }
    let acceptableData = ['post', 'get', 'put', 'delete', 'options']
    if (acceptableData.indexOf(data.method) > -1) {
        handlers._cart[data.method](data, callback)
    } else {
        callback(405)
    }
    console.log(data)
}

handlers._cart = {}

handlers._cart.verifyEmail = (userId, email, callback) => {
    _data.read('users', email, (err, data) => {
        if (!err && data) {
            if (email == data.email) {
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}

handlers._cart.options = (data, callback) => {
    data.headers['access-control-request-method'] == "POST" ? handlers._cart.post(data, callback) : false
    data.headers['access-control-request-method'] == "GET" ? handlers._cart.get(data, callback) : false
    data.headers['access-control-request-method'] == "PUT" ? handlers._cart.put(data, callback) : false
    data.headers['access-control-request-method'] == "DELETE" ? handlers._cart.delete(data, callback) : false
}

handlers._cart.post = (data, callback) => {
    let userId = typeof (data.payload.userId) == 'string' &&
        data.payload.userId.trim().length > 0 ?
        data.payload.userId.trim() : false

    let items = typeof (data.payload.items) == 'object' &&
        data.payload.items instanceof Array &&
        data.payload.items.length > 0 ?
        data.payload.items : false;

    let email = typeof (data.payload.email) == 'string' &&
        data.payload.email.trim().length > 0 ?
        data.payload.email.trim() : false

    if (userId && items && email) {
        let orderItem = foods.searcher(items)
        if (orderItem) {
            handlers._token.tokenVerify(userId, userId, (tokenIsValid) => {
                if (tokenIsValid) {
                    let cartId = helpers.tokenGen(20)
                    if (cartId) {
                        _data.read('users', email, (err, userData) => {
                            if (!err && userData) {
                                _data.read('carts', userId, (err, cartData) => {
                                    if (err) {
                                        let cartObject = {
                                            'cartId': cartId,
                                            'userId': userId,
                                            'name': userData.name,
                                            'userEmail': email,
                                            'items': orderItem,
                                            'ordered': false
                                        }
                                        _data.create('carts', userId, cartObject, (err) => {
                                            if (!err) {
                                                callback(200, cartObject)
                                            } else {
                                                callback(403, { 'err': "err creating cart" })
                                            }
                                        })
                                    } else {
                                        callback(403, { 'err': 'cart aleady created' })
                                    }
                                })

                            } else {
                                callback(404)
                            }
                        })
                    } else {
                        callback(500, { 'err': 'could not generate cart id' })
                    }
                } else {
                    callback(404, { 'err': 'user not authenticated' })
                }
            })
        } else {
            callback(500, { 'err': 'could not create item' })
        }
    } else {
        callback(500, { 'err': 'missing item' })
    }

}

handlers._cart.get = (data, callback) => {
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    if (userId) {
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
        handlers._token.tokenVerify(userId, userId, (tokenIsValid) => {
            if (tokenIsValid) {
                _data.read('carts', userId, (err, cartData) => {
                    if (!err && cartData) {
                        callback(200, cartData)
                    } else {
                        callback(404, { 'err': 'could not find cart' })
                    }
                })
            } else {
                callback(404, { 'err': 'user not authenticated' })
            }
        })
    } else {
        callback(404, { 'err': 'missing query' })
    }

}

handlers._cart.put = (data, callback) => {
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    let cartId = typeof (data.payload.cartId) == 'string' &&
        data.payload.cartId.trim().length == 20 ?
        data.payload.cartId.trim() : false

    let items = typeof (data.payload.items) == 'object' &&
        data.payload.items instanceof Array &&
        data.payload.items.length > 0 ?
        data.payload.items : false

    let ordered = typeof (data.payload.ordered) == 'boolean' &&
        data.payload.ordered == true ? true : false

    if (userId && cartId) {
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
        handlers._token.tokenVerify(token, userId, (tokenIsValid) => {
            if (tokenIsValid) {
                if (items || ordered) {
                    _data.read('carts', userId, (err, cartData) => {
                        if (!err && cartData) {
                            if (items) {
                                cartData.items = foods.searcher(items)
                            }
                            if (ordered) {
                                cartData.ordered = ordered
                            }
                            _data.update('carts', userId, cartData, (err) => {
                                if (!err) {
                                    callback(200, cartData)
                                } else {
                                    callback(false)
                                }
                            })
                        } else {
                            callback(400)
                        }
                    })
                } else {
                    callback(400)
                }
            } else {
                callback(404, { 'err': 'could not find cart' })
            }
        })

    }

}

handlers._cart.delete = (data, callback) => {
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    if (userId) {
        let token = typeof (data.headers.token) == 'string' ? data.headers.token : false
        handlers._token.tokenVerify(token, userId, (tokenIsValid) => {
            if (tokenIsValid) {
                _data.delete('carts', userId, (err) => {
                    if (!err) {
                        callback(true)
                    } else {
                        callback(false)
                    }
                })
            } else {
                callback(404, { 'err': 'could not find cart' })
            }
        })
    }
}

handlers.order = (data, callback) => {
    let acceptableData = ['post', 'get', 'options']
    if (acceptableData.indexOf(data.method) > -1) {
        handlers._order[data.method](data, callback)
    } else {
        callback(405)
    }
}

handlers._order = {}

handlers._order.options = (data, callback) => {
    data.headers['access-control-request-method'] == "POST" ? handlers._order.post(data, callback) : false
    data.headers['access-control-request-method'] == "GET" ? handlers._order.get(data, callback) : false
}

handlers._order.post = (data, callback) => {
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    let cartId = typeof (data.payload.cartId) == 'string' &&
        data.payload.cartId.trim().length == 20 ?
        data.payload.cartId.trim() : false

    let userEmail = typeof (data.payload.userEmail) == 'string' &&
        data.payload.userEmail.trim().length > 0 ?
        data.payload.userEmail.trim() : false

    if (userId && cartId && userEmail) {
        _data.read('carts', userId, (err, cartData) => {
            if (!err && cartData) {
                let orderId = helpers.tokenGen(20)
                let orderObject = {
                    'orderId': orderId,
                    'userId': userId,
                    'cartItems': cartData.items,
                    'orderedBy': userEmail,
                    'paid': false,
                }
                cartData.ordered = true
                _data.update('carts', userId, cartData, (err) => console.log(err))
                _data.read('users', userEmail, (err, userData) => {
                    if (!err, userData) {
                        userData.order = orderObject
                        _data.update('users', userEmail, userData, (err) => {
                            if (!err) {
                                console.log(userData)
                            } else {
                                console.log("could not create order in users")
                            }
                        })
                    } else {
                        console.log("could not get order in users")
                    }
                })
                _data.create('orders', userId, orderObject, (err) => {
                    if (!err) {
                        callback(200, orderObject)
                    } else {
                        callback(500)
                    }
                })
            } else {
                callback(404, { 'err': 'could not find cart' })
            }
        })
    } else {
        callback(403, { 'err': "missing field(s)" })
    }
}

handlers._order.get = (data, callback) => {
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    if (userId) {
        _data.read('orders', userId, (err, orderData) => {
            if (!err && orderData) {
                callback(200, orderData)
            } else {
                callback(404)
            }
        })
    } else {
        callback(404)
    }
}

handlers.pay = (data, callback) => {
    let acceptableData = ['post', 'get', 'options']
    if (acceptableData.indexOf(data.method) > -1) {
        handlers._pay[data.method](data, callback)
    } else {
        callback(405)
    }
}

handlers._pay = {}

handlers._pay.options = (data, callback) => {
    data.headers['access-control-request-method'] == "POST" ? handlers._pay.post(data, callback) : false
    data.headers['access-control-request-method'] == "GET" ? handlers._pay.get(data, callback) : false
}

handlers._pay.post = (data, callback) => {
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    let email = typeof (data.payload.email) == 'string' &&
        data.payload.email.trim().length > 0 ?
        data.payload.email.trim() : false

    let orderId = typeof (data.payload.orderId) == 'string' &&
        data.payload.orderId.trim().length == 20 ?
        data.payload.orderId.trim() : false

    let creditCard = typeof (data.payload.creditCard) == 'string' &&
        data.payload.creditCard.trim().length > 0 ?
        data.payload.creditCard.trim() : false

    let expMonth = typeof (data.payload.expMonth) == 'string' &&
        data.payload.expMonth.trim().length > 0 ?
        data.payload.expMonth.trim() : false

    let expYear = typeof (data.payload.expYear) == 'string' &&
        data.payload.expYear.trim().length > 0 ?
        data.payload.expYear.trim() : false

    let cvc = typeof (data.payload.cvc) == 'string' &&
        data.payload.cvc.trim().length > 0 ?
        data.payload.cvc.trim() : false

    console.log(userId, email, orderId, creditCard, expMonth, expYear)

    if (userId && orderId && creditCard && expMonth && expYear && email) {
        _data.read('orders', userId, (err, orderData) => {
            if (!err && orderData) {
                if (!orderData.paid) {
                    let amount = orderData.cartItems[orderData.cartItems.length - 1].totalPrice
                    _data.read('users', email, (err, userData) => {
                        if (!err && userData) {
                            let paymentInfo = {}
                            stripe.paymentMethods.create({
                                type: 'card',
                                card: {
                                    number: creditCard,
                                    exp_month: expMonth,
                                    exp_year: expYear,
                                    cvc: cvc,
                                },
                                billing_details: {
                                    email: orderData.orderedBy,
                                }
                            }).then((data) => {
                                stripe.paymentMethods.attach(
                                    data.id,
                                    { customer: userData.customerId }
                                ).then((d) => {
                                    paymentInfo.paymentMethodsAttach = d
                                    stripe.paymentIntents.create({
                                        amount: amount,
                                        currency: 'usd',
                                        payment_method: data.id,
                                        customer: userData.customerId,
                                    }).then((da) => {
                                        stripe.paymentIntents.confirm(
                                            da.id,
                                            { payment_method: data.id }
                                        ).then((dat) => {
                                            paymentInfo.paymentIntentsConfirm = dat
                                            _data.read('payments', userId, (err, paymentData) => {
                                                if (err) {
                                                    _data.create('payments', userId, paymentInfo, (err) => {
                                                        if (!err) {
                                                            callback(200, paymentInfo)
                                                        } else {
                                                            callback(500)
                                                        }
                                                    })
                                                } else {
                                                    callback(409, { 'err': 'already paid' })
                                                }
                                            })
                                            callback(200, paymentInfo)
                                        })
                                    })
                                })
                            }).catch(err => console.log(err))
                        } else {
                            callback(400)
                        }
                    })
                } else {
                    callback(409)
                }
            } else {
                callback(404)
            }
        })
    } else {
        callback(400, {'err':"err is here"})
    }
}

handlers._pay.get = (data, callback) => {
    let userId = typeof (data.queryStringObject.userId) == 'string' &&
        data.queryStringObject.userId.trim().length > 0 ?
        data.queryStringObject.userId.trim() : false

    if (userId) {
        _data.read('payments', userId, (err, paymentData) => {
            if (!err && paymentData) {
                callback(200, paymentData)
            } else {
                callback(404)
            }
        })
    } else {
        callback(403)
    }
}

module.exports = handlers