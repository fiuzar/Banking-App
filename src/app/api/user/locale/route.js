import { auth } from "@/auth"
import { query } from "@/dbh"

export async function POST(req) {
    try {
        const session = await auth()
        const userId = session?.user?.id
        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: "Authentication required" }), { status: 401 })
        }

        const { lang, currency, flag } = await req.json()
        if (!lang || !currency || !flag) {
            return new Response(JSON.stringify({ success: false, error: "Missing locale data" }), { status: 400 })
        }

        await query(
            `UPDATE users SET locale_lang = $1, locale_currency = $2, locale_flag = $3, updated_at = NOW() WHERE id = $4`,
            [lang, currency, flag, userId]
        )

        return new Response(JSON.stringify({ success: true }), { status: 200 })
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: "Failed to update locale" }), { status: 500 })
    }
}
