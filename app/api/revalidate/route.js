import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST() {

    revalidateTag('article:guardian');
    revalidateTag('article:guardian:hits');
    revalidateTag('category:guardian');

    return NextResponse.json({ now: Date.now(), revalidated: true });
}
