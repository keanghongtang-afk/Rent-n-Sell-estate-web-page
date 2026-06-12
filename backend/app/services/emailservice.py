import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from dotenv import load_dotenv

# ── Always resolve the .env file relative to THIS file's location ──────────
# emailservice.py lives at:  backend/app/services/emailservice.py
# .env lives at:             backend/.env
# So we go up 3 levels:      services/ → app/ → backend/
_ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=os.path.abspath(_ENV_PATH))

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587


def send_email(owner_email: str, email_customer: str, username: str):
    """
    Send an email notification to the property owner when a customer places an order.

    Args:
        owner_email:    Recipient – the property owner's email address
        email_customer: The customer's email address (shown in the email body)
        username:       The customer's display name
    """

    # Read credentials fresh every call so hot-reloading the .env works
    sender_email = os.getenv("EMAIL_ADDRESS", "").strip()
    sender_password = os.getenv("EMAIL_PASSWORD", "").strip()

    if not sender_email or not sender_password:
        raise RuntimeError(
            "Email credentials are not configured. "
            f"Set EMAIL_ADDRESS and EMAIL_PASSWORD in {os.path.abspath(_ENV_PATH)}"
        )

    subject = "Someone ordered your property on H&R Estate"
    sent_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    html_body = f"""
    <html>
      <body style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <div style="text-align:center;margin-bottom:20px;">
            <h1 style="color:#2c3e50;">H&amp;R Estate</h1>
        </div>
        <hr/>
        <h2>Dear Property Owner,</h2>
        <p>
          Great news! <strong>Mr/Ms. {username}</strong> has placed an order for your property
          listed on H&amp;R Estate.
        </p>
        <p>Please reach out to them at your earliest convenience:</p>
        <p style="background:#f0f4ff;padding:12px;border-radius:6px;">
          <strong>Customer email:</strong>
          <a href="mailto:{email_customer}">{email_customer}</a>
        </p>
        <p>Thank you for listing your property with us!</p>
        <hr/>
        <p style="color:#999;font-size:11px;">
          This is an automated message sent on {sent_time}.
          Please do not reply directly to this email.
        </p>
      </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = owner_email
    msg.attach(MIMEText(html_body, "html"))

    print(f"[EmailService] Connecting to {SMTP_HOST}:{SMTP_PORT} as {sender_email} ...")
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, owner_email, msg.as_string())
    print(f"[EmailService] ✅ Notification sent to {owner_email}")