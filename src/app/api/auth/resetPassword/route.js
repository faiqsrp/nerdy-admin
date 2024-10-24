// Next Imports
import { NextResponse } from 'next/server'


export async function POST(req) {
  try {
    const { uniqueID, password, confirmPassword } = await req.json()

    const Response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uniqueID, password, confirmPassword }),
    })

    if (Response.ok) {
      const data = await Response.json()
      return NextResponse.json(data)

    } else {
      const errorData = await Response.json()
      return NextResponse.json(
        {
          message: errorData.message || ['Failed to reset password'],
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
