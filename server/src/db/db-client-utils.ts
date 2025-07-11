export function getDBNameAndRepository(this: any) {
    return {
        name: this._db.current.dbName,
        repository: this._db.current.repository
    }
}

