const _s = window.localStorage;

const Storage = {
    save: (name, data) => {
        _s.setItem(name, JSON.stringify(data))
    },
    get: key => {
        return JSON.parse(_s.getItem(key))
    },
    update: (key, data) => {
        let temp = this.get(key)

    }
}

export default Storage;