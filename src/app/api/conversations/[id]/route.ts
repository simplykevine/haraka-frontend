import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Missing authorization" }, { status: 401 });
  }
  if (!BASE_URL) {
    return NextResponse.json({ message: "Backend not configured" }, { status: 500 });
  }

  try {
    const { id } = await params;

    const backendRes = await fetch(`${BASE_URL}/conversations/${id}/`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await backendRes.json().catch(() => ({}));
    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Missing authorization" }, { status: 401 });
  }
  if (!BASE_URL) {
    return NextResponse.json({ message: "Backend not configured" }, { status: 500 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title } = body;

    const backendRes = await fetch(`${BASE_URL}/conversations/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ title }),
    });

    const data = await backendRes.json().catch(() => ({}));
    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ message: "Missing authorization" }, { status: 401 });
  }
  if (!BASE_URL) {
    return NextResponse.json({ message: "Backend not configured" }, { status: 500 });
  }

  try {
    const { id } = await params;

    const backendRes = await fetch(`${BASE_URL}/conversations/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await backendRes.json().catch(() => ({}));
    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }
    return NextResponse.json({ message: "Conversation deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}