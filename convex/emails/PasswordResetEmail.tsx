import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  url: string;
  brandName?: string; // e.g. "Bookmarker"
  brandTagline?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const ResetPasswordEmail = ({
  url,
  brandName = "Our App",
  brandTagline,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Reset your {brandName} password</Preview>
        <Container style={container}>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>Hello,</Text>
            <Text style={paragraph}>
              We received a request to reset your {brandName} account password.
            </Text>
            <Text style={paragraph}>
              Click the link below to securely reset your password:
            </Text>
            <Section style={{ textAlign: "center", margin: "20px 0" }}>
              <Link href={url} style={button}>
                Reset Password
              </Link>
            </Section>
            <Text style={paragraph}>
              If you didn’t request this, you can safely ignore this email.
            </Text>
            <Text style={paragraph}>
              Thanks,
              <br />
              The {brandName} Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Text style={{ textAlign: "center", color: "#706a7b", fontSize: 12 }}>
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </Text>
        </Section>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main: React.CSSProperties = {
  backgroundColor: "#f4f4f7",
  fontFamily,
};

const container: React.CSSProperties = {
  maxWidth: "580px",
  margin: "30px auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
};

const content: React.CSSProperties = {
  padding: "20px",
};

const paragraph: React.CSSProperties = {
  lineHeight: 1.5,
  fontSize: 14,
  color: "#333333",
};

const logo: React.CSSProperties = {
  padding: "30px 0",
  textAlign: "center",
};

const logoImg: React.CSSProperties = {
  margin: "0 auto",
};

const sectionsBorders: React.CSSProperties = {
  width: "100%",
};

const sectionBorder: React.CSSProperties = {
  borderBottom: "1px solid #e5e5e5",
  width: "249px",
};

const sectionCenter: React.CSSProperties = {
  borderBottom: "1px solid #6b46c1",
  width: "102px",
};

const button: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "#6b46c1",
  color: "#ffffff",
  fontWeight: "bold",
  borderRadius: "6px",
  textDecoration: "none",
};

const footer: React.CSSProperties = {
  maxWidth: "580px",
  margin: "20px auto 0 auto",
};
