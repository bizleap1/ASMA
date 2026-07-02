// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// @ts-ignore
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, approvalLink, type } = await req.json()

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    let toEmail = 'advaitsharemarketacademy@gmail.com'
    let subject = 'New User Approval Request'
    let text = `New user signup request from ${email}.\n\nPlease approve their account by clicking this link:\n${approvalLink}`

    if (type === 'student-success') {
      toEmail = email
      subject = 'Account Approved - Advait Stock Market Academy'
      text = 'Good news! Your account has been approved by the admin. You can now login to Advait Stock Market Academy.'
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Default testing domain for Resend
        to: toEmail,
        subject: subject,
        text: text,
      }),
    })

    const resData = await res.json()

    if (res.ok) {
      return new Response(JSON.stringify(resData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      return new Response(JSON.stringify({ error: resData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
