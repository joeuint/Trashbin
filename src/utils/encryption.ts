import crypto from 'crypto'
import util from 'util'

const pbkdf2Promise = util.promisify(crypto.pbkdf2)

export const encrypt = (async (key: string, message: string) => {
    const keyBytes = Buffer.from(key, 'base64')

    const iv = crypto.randomBytes(16).toString('base64')
    console.log(key)

    const cipher = crypto.createCipheriv('aes-256-gcm', keyBytes, iv)
    let encrypted = cipher.update(message, 'utf-8', 'base64')
    encrypted += cipher.final('base64')

    const authTag = cipher.getAuthTag()

    return {
        encrypted,
        iv,
        authTag: authTag.toString('base64')
    }
})

export const decrypt = (async (stringKey: string, iv: string, encrypted: string, authTag: string) => {
    const authTagDecoded = Buffer.from(authTag, 'base64')
    const keyBytes = Buffer.from(stringKey, 'base64')
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBytes, iv)
    decipher.setAuthTag(authTagDecoded)
    let decrypted = decipher.update(encrypted, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8')

    return decrypted
})

export const createKey = (async (password: string) => {
    const salt = crypto.randomBytes(16)
    const key = await pbkdf2Promise(password, salt, 500_000, 32, 'sha256')
    return {
        key: key.toString('base64'),
        salt: salt.toString('base64')
    }
})

export const derriveKey = (async (password: string, salt: string) => {
    const bufferSalt = Buffer.from(salt, 'base64')
    const key = await pbkdf2Promise(password, bufferSalt, 500_000, 32, 'sha256')

    return {
        key: key.toString('base64')
    }
})