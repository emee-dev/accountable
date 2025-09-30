// ResetPasswordEmail.tsx
import * as React from "react";
import { Heading, Link, Text } from "@react-email/components";
import { BaseEmail, styles } from "./BaseEmail";

interface ResetPasswordEmailProps {
  url: string;
  brandName?: string;
  brandTagline?: string;
  brandLogoUrl?: string;
}

export default function ResetPasswordEmail({
  url,
  brandName,
  brandTagline,
  brandLogoUrl,
}: ResetPasswordEmailProps) {
  return (
    <BaseEmail
      previewText="Reset your password"
      brandName={brandName}
      brandTagline={brandTagline}
      brandLogoUrl={brandLogoUrl}
    >
      <Heading style={styles.h1}>Reset Your Password</Heading>
      <Link
        href={url}
        target="_blank"
        style={{
          ...styles.link,
          display: "inline-block",
          margin: "16px 0",
          padding: "12px 20px",
          borderRadius: "6px",
          backgroundColor: "#0070f3",
          color: "#ffffff",
          textDecoration: "none",
        }}
      >
        Click here to reset your password
      </Link>
      <Text
        style={{
          ...styles.text,
          color: "#666666",
          marginTop: "20px",
        }}
      >
        If you didn&apos;t request a password reset, you can safely ignore this
        email.
      </Text>
    </BaseEmail>
  );
}
