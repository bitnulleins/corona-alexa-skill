const https = require('https')
const moment = require('moment');

const Functions = {
    getData(options)
    {
        return new Promise((resolve, reject) => {
            let req = https.request(options, (response) => {
                let json = '';

                response.setEncoding('utf-8')
                response.on('data', (chunk) => {
                    json += chunk
                })

                response.on('end', () => {
                    if (response.statusCode == 200){
                        resolve(JSON.parse(json))
                    } else {
                        resolve(null)
                    }
                })
            })

            req.on('error', (e) => {
                console.log(`Request failed: ${e}`)
            })

            req.end()
        })
    },
    getCoronaCases() {
        return new Promise((resolve) => {
            let options = {
                host: 'api.bitnulleins.de',
                path: '/corona/cases/all',
                json: true,
                method: 'GET'
            }
            this.getData(options).then((data) => {
                resolve(data)
            })
        }).catch((err) => {
            console.log("Problem API bitnulleins:" + err)
        })
    },
    getAddress(deviceId, accessToken) {
        return new Promise((resolve) => {
            let options = {
                host: 'api.eu.amazonalexa.com',
                path: `/v1/devices/${deviceId}/settings/address`,
                json: true,
                headers: {
                    Authorization: ' Bearer ' + accessToken
                },
                method: 'GET'
            }
            this.getData(options).then((data) => {
                resolve(data)
            })
        }).catch((err) => {
            console.log("Problem with getting address:" + err)
        })
    }
}

module.exports = Functions