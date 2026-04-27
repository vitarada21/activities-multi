import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
  const SIZE = 1024;
  const text = "AKTIVITY";
  const accent = "#7CB7B0";

  // approximate width per char at weight 900: ~0.65 of fontSize
  const targetWidth = SIZE - 80;
  const fontSize = Math.floor(targetWidth / (text.length * 0.65));

  return new ImageResponse(
    (
      <div
        style={{
          width: SIZE,
          height: SIZE,
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize,
            fontWeight: 900,
            color: accent,
            letterSpacing: -fontSize * 0.05,
            lineHeight: 1,
            display: "flex",
          }}
        >
          {text}
        </div>
      </div>
    ),
    {
      width: SIZE,
      height: SIZE,
      headers: {
        "Content-Disposition": 'attachment; filename="aktivity-logo.png"',
      },
    },
  );
}
