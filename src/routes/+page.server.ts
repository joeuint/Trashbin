import type { Actions } from './$types';
import prisma from '../utils/prisma';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { encrypt, createKey } from '../utils/encryption';

interface CreatedKey {
    key: string,
    salt: string
}

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData()
        let content: any = data.get('pasteContent')
        const password = data.get('pastePassword')
        const burn = data.get('burnPaste') || false
        let expiryString = data.get('pasteExpiry') || null
        let expiry

        if (typeof expiryString === 'string') {
            expiry = dayjs(expiryString)
        } else {
            expiry = dayjs().add(2, 'y')
        }

        if (dayjs() >= expiry) throw error(400, 'Time must be in the future')

        const encrypted = password ? true : false

        if (content instanceof File || content === null) throw error(400, 'No content provided')

        let key: CreatedKey
        let encKey: string
        let salt: string|null = null
        let iv: string|null = null
        let authTag: string|null = null

        if (encrypted && password !== null && !(password instanceof File)) {
            key = await createKey(password)
            encKey = key.key
            const enc = await encrypt(encKey, content)
            content = enc.encrypted
            salt = key.salt
            iv = enc.iv
            authTag = enc.authTag
        }

        const post = await prisma.paste.create({
            data: {
                content,
                encrypted,
                expired_at: expiry.toDate(),
                burn: burn === 'on',
                salt,
                iv,
                authTag
            }
        })

        return {
            success: true,
            id: post.id
        }
    }
} satisfies Actions;