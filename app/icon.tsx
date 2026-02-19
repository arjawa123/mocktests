import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          background: "#111827",
          color: "#F9FAFB",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8
        }}
      >
        JFT
      </div>
    ),
    {
      ...size
    }
  );
}
