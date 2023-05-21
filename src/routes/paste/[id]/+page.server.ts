import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import prisma from '../../../utils/prisma';
import { error } from '@sveltejs/kit';
import { decrypt, derriveKey } from '../../../utils/encryption';
import dayjs from 'dayjs';

export const load = (async ({ params, locals }) => {
    if (locals.formSubmit) return
    const post = await prisma.paste.findUnique({
        where: {
            id: params.id
        },
        select: {
            id: true,
            content: true,
            expired_at: true,
            created_at: true,
            encrypted: true,
            burn: true
        }
    })

    if (post === null) throw error(404, 'Post not found')
    if (dayjs(post.expired_at) <= dayjs()) {
        await prisma.paste.delete({
            where: {
                id: post.id
            }
        })

        throw error(404, 'Post not found')
    }
    if (post.encrypted) return {
        encrypted: post.encrypted
    }
    if (post.burn) {
        await prisma.paste.delete({
            where: {
                id: post.id
            }
        })
    }

    return {
        post,
        burn: post.burn
    };
}) satisfies PageServerLoad;


export const actions = {
    default: async ({request, params, locals}) => {
        const post = await prisma.paste.findUnique({
            where: {
                id: params.id
            }
        })
        
        
        const formData = await request.formData()
        const password = formData.get('decryptPassword')
        
        if (!post) throw error(404)
        if (!password || password instanceof File) throw error(400)
        if (!post.iv || !post.salt || !post.authTag) throw error(500)
        
        const key = (await derriveKey(password, post.salt)).key
        
        const decrypted = await decrypt(key, post.iv, post.content, post.authTag)

        if (post.burn) {
            await prisma.paste.delete({
                where: {
                    id: post.id
                }
            })
        }

        locals.formSubmit = true

        return {
            post: {
                id: post.id,
                content: decrypted,
                expired_at: post.expired_at,
                created_at: post.created_at
            },
            burn: post.burn
        }
    }
} satisfies Actions;