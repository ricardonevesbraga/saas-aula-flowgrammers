import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

interface Props {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  const { slug } = await params
  const format = request.nextUrl.searchParams.get('format') ?? 'png'

  const publicUrl = process.env.NEXT_PUBLIC_PUBLIC_URL ?? ''
  const qrUrl = `${publicUrl}/a/${slug}`

  try {
    if (format === 'svg') {
      const svg = await QRCode.toString(qrUrl, { type: 'svg', width: 400, margin: 2 })
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 's-maxage=86400',
          'Content-Disposition': `attachment; filename="qr-${slug}.svg"`,
        },
      })
    }

    if (format === 'pdf') {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([297, 420]) // A6 em pontos
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      const qrBuffer = await QRCode.toBuffer(qrUrl, { width: 240, margin: 2 })
      const qrImage = await pdfDoc.embedPng(qrBuffer)

      page.drawText('Avalie nosso atendimento!', {
        x: 30,
        y: 360,
        size: 16,
        font,
        color: rgb(0.118, 0.227, 0.545),
      })

      page.drawImage(qrImage, {
        x: 30,
        y: 90,
        width: 237,
        height: 237,
      })

      page.drawText('Escaneie o QR Code', {
        x: 65,
        y: 68,
        size: 12,
        font,
        color: rgb(0.28, 0.34, 0.46),
      })

      page.drawText('com a câmera do celular', {
        x: 53,
        y: 50,
        size: 12,
        font,
        color: rgb(0.28, 0.34, 0.46),
      })

      const pdfBytes = await pdfDoc.save()
      return new NextResponse(pdfBytes.buffer as ArrayBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Cache-Control': 's-maxage=86400',
          'Content-Disposition': `attachment; filename="qr-${slug}.pdf"`,
        },
      })
    }

    // Default: PNG
    const buffer = await QRCode.toBuffer(qrUrl, {
      type: 'png',
      width: 600,
      margin: 2,
      color: { dark: '#0F172A', light: '#FFFFFF' },
    })

    return new NextResponse(buffer.buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 's-maxage=86400',
        'Content-Disposition': `inline; filename="qr-${slug}.png"`,
      },
    })
  } catch (err) {
    console.error('[qr]', err)
    return NextResponse.json({ error: 'Erro ao gerar QR Code' }, { status: 500 })
  }
}
