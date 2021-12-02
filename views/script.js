function setData() {
    const fs = require('fs')
    const path = require('path')

    const electron = require('electron')
    const userData = (electron.app || electron.remote.app).getPath('userData')
    var jsonData = fs.readFileSync(path.join(userData, "data/solution.json"), "utf8")
    var data = JSON.parse(jsonData)

    document.getElementById('massaModal').innerHTML = data.massaModal.toFixed(2)
    document.getElementById('rigidezModal').innerHTML = data.rigidezModal.toFixed(2)
    document.getElementById('harmonico').innerHTML = data.harmonico + (data.harmonico == 'Nenhum'?'':'°')
    document.getElementById('maxDesloc').innerHTML = data.deslocMax.toFixed(3)
    document.getElementById('maxVeloc').innerHTML = data.velMax.toFixed(3)
    document.getElementById('maxAcel').innerHTML = data.acelMax.toFixed(3)
    document.getElementById('title').innerHTML = 'Função autovetor'
    document.getElementById('img').setAttribute('src', path.join(userData, "data/autoVetorGraph.png"))

}
function next() {
    const path = require('path')
    const electron = require('electron')
    const userData = (electron.app || electron.remote.app).getPath('userData')
    data = {
        autovetor: {
            title: 'Função autovetor',
            src: 'data/autoVetorGraph.png'
        },
        desloc: {
            title: 'Deslocamento no tempo',
            src: 'data/deslocGraph.png',
        },
        veloc: {
            title: 'Velocidade no tempo',
            src: 'data/velocGraph.png',
        },
        acel: {
            title: 'Aceleração no tempo',
            src: 'data/acelGraph.png',
        },
        maxdesloc: {
            title: 'Máximos deslocamentos',
            src: 'data/maxDeslocGraph.png',
        },
        maxveloc: {
            title: 'Máximas velocidades',
            src: 'data/maxVelocGraph.png',
        },
        maxacel: {
            title: 'Máximas acelerações',
            src: 'data/maxAcelGraph.png',
        }
    }
    currentImageTitle = document.getElementById('title').innerHTML
    if (currentImageTitle == data.autovetor.title) {
        document.getElementById('title').innerHTML = data.desloc.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.desloc.src))
    } else if (currentImageTitle == data.desloc.title) {
        document.getElementById('title').innerHTML = data.veloc.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.veloc.src))
    } else if (currentImageTitle == data.veloc.title) {
        document.getElementById('title').innerHTML = data.acel.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.acel.src))
    } else if (currentImageTitle == data.acel.title) {
        document.getElementById('title').innerHTML = data.maxdesloc.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.maxdesloc.src))
    } else if (currentImageTitle == data.maxdesloc.title) {
        document.getElementById('title').innerHTML = data.maxveloc.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.maxveloc.src))
    } else if (currentImageTitle == data.maxveloc.title) {
        document.getElementById('title').innerHTML = data.maxacel.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.maxacel.src))
    } else if (currentImageTitle == data.maxacel.title) {
        document.getElementById('title').innerHTML = data.autovetor.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.autovetor.src))
    }
}
function previous() {
    const path = require('path')
    const electron = require('electron')
    const userData = (electron.app || electron.remote.app).getPath('userData')
    data = {
        autovetor: {
            title: 'Função autovetor',
            src: 'data/autoVetorGraph.png'
        },
        desloc: {
            title: 'Deslocamento no tempo',
            src: 'data/deslocGraph.png',
        },
        veloc: {
            title: 'Velocidade no tempo',
            src: 'data/velocGraph.png',
        },
        acel: {
            title: 'Aceleração no tempo',
            src: 'data/acelGraph.png',
        },
        maxdesloc: {
            title: 'Máximos deslocamentos',
            src: 'data/maxDeslocGraph.png',
        },
        maxveloc: {
            title: 'Máximas velocidades',
            src: 'data/maxVelocGraph.png',
        },
        maxacel: {
            title: 'Máximas acelerações',
            src: 'data/maxAcelGraph.png',
        }
    }
    currentImageTitle = document.getElementById('title').innerHTML
    if (currentImageTitle == data.autovetor.title) {
        document.getElementById('title').innerHTML = data.maxacel.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.maxacel.src))
    } else if (currentImageTitle == data.desloc.title) {
        document.getElementById('title').innerHTML = data.autovetor.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.autovetor.src))
    } else if (currentImageTitle == data.veloc.title) {
        document.getElementById('title').innerHTML = data.desloc.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.desloc.src))
    } else if (currentImageTitle == data.acel.title) {
        document.getElementById('title').innerHTML = data.veloc.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.veloc.src))
    } else if (currentImageTitle == data.maxdesloc.title) {
        document.getElementById('title').innerHTML = data.acel.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.acel.src))
    } else if (currentImageTitle == data.maxveloc.title) {
        document.getElementById('title').innerHTML = data.maxdesloc.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.maxdesloc.src))
    } else if (currentImageTitle == data.maxacel.title) {
        document.getElementById('title').innerHTML = data.maxveloc.title
        document.getElementById('img').setAttribute('src', path.join(userData, data.maxveloc.src))
    }
}
function imageDownload() {
    const { dialog } = require('electron').remote
    const fs = require('fs')
    const path = require('path')
    const homedir = require('os').homedir()
    const electron = require('electron')
    const userData = (electron.app || electron.remote.app).getPath('userData')

    const currentImagePath = document.getElementById('img').getAttribute('src')
    const currentImageName = currentImagePath.split('\\')[currentImagePath.split('\\').length - 1]
    dialog.showSaveDialog({
        title:'Salvar imagem',
        properties: ['openDirectory'],
        defaultPath: homedir + '/' + currentImagePath,
        filters: [
            { name: 'Images', extensions: ['png'] },
        ]
    }).then(result => {
        fs.copyFileSync(path.resolve(currentImagePath), result.filePath)   
    })
}

