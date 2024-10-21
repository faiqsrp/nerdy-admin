// Next Imports
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email } = await req.json()

  try {
    const Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (Response.ok) {
      const responseMessage = await Response.json()

      return NextResponse.json(responseMessage)
    } else {

      const errorData = await Response.json()
      return NextResponse.json(
        {
          message: errorData.message || ['Failed to send password reset email. Please try again.'],
        },
        {
          status: Response.status,
          statusText: Response.statusText,
        }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: ['An error occurred while processing your request'],
      },
      {
        status: 500,
        statusText: 'Internal Server Error',
      }
    )
  }
}
