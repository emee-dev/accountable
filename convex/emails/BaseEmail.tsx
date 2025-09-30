// components/BaseEmail.tsx
import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
} from "@react-email/components";

interface BaseEmailProps {
  children: React.ReactNode;
  previewText?: string;
  brandName?: string;
  brandTagline?: string;
  brandLogoUrl?: string;
}

export const styles = {
  h1: {
    fontSize: "24px",
    fontWeight: "600",
    margin: "0 0 16px",
    color: "#111111",
  },
  text: {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#333333",
    margin: "0",
  },
  link: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#0070f3",
    textDecoration: "underline",
  },
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #eaeaea",
    borderRadius: "8px",
    padding: "24px",
  },
  footer: {
    fontSize: "12px",
    color: "#888888",
    marginTop: "32px",
  },
} as const;

export function BaseEmail({
  children,
  previewText,
  brandName = "Bookmark Io",
  brandTagline,
  brandLogoUrl,
}: BaseEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f6f6f6", fontFamily: "sans-serif" }}>
        <Container style={{ margin: "40px auto", maxWidth: "600px" }}>
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            {brandLogoUrl && (
              <Img src={brandLogoUrl} alt={brandName} width="60" height="60" />
            )}
            <Text
              style={{ fontSize: "18px", fontWeight: "600", margin: "8px 0" }}
            >
              {brandName}
            </Text>
            {brandTagline && (
              <Text style={{ fontSize: "14px", color: "#666" }}>
                {brandTagline}
              </Text>
            )}
          </Section>

          <Section style={styles.container}>{children}</Section>

          <Section style={{ textAlign: "center" }}>
            <Text style={styles.footer}>
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
