const fs = require('fs')
const path = require('path')

const lib = {}

const BASE_DIR = path.join(__dirname, '../.data/')

// path generator
let genPath = (dir, file) => {
    return BASE_DIR + dir + "/" + file + ".json"
}

lib.create = (dir, file, data, callback) => {
    fs.open(genPath(dir, file), 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            let stringify = JSON.stringify(data)
            fs.write(fileDescriptor, stringify, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false)
                        } else {
                            callback("could not close file")
                        }
                    })
                } else {
                    callback('could not write to the data')
                }
            })
        } else {
            callback('could not open file')
        }
    })
}

lib.read = (dir, file, callback) => {
    fs.readFile(genPath(dir, file), 'utf-8', (err, data) => {
        if (!err) {
            let parsedData = JSON.parse(data)
            callback(false, parsedData)
        } else {
            callback(true, data)
        }
    })
}

lib.update = (dir, file, data, callback) => {
    fs.open(genPath(dir, file), 'r+', (err, fileDescriptor) => {
        if (!err && data) {
            let stringify = JSON.stringify(data)
            fs.write(fileDescriptor, stringify, (err) => {
                if (!err) {
                    callback("update successful")
                } else {
                    callback('update failed')
                }
            })
        } else {
            callback('could not open file')
        }
    })
}

lib.delete = (dir, file, callback) => {
    fs.unlink(genPath(dir, file), (err) => {
        if (!err) {
            callback("deleted")
        } else {
            callback('cant delete')
        }
    })
}

lib.list = (dir, callback)=>{
    fs.readdir(BASE_DIR+dir+'/', (err, data)=>{
        let trimmedFileName = []
        if(!err && data && data.length > 0){
            data.forEach(e => {
                trimmedFileName.push(e.replace('.json',''))
            });
            callback(false,trimmedFileName)
        }else{
            callback(true,'notfound')
        }
    })
}


module.exports = lib
