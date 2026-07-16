# Builds a polished, client-friendly PDF overview of the ABGCC website.
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem,
    HRFlowable, Image, Table, TableStyle,
)
from reportlab.lib.enums import TA_CENTER

NAVY = colors.HexColor("#10243f")
NAVY_SOFT = colors.HexColor("#1f5f93")
GOLD = colors.HexColor("#c8870a")
GOLD_SOFT = colors.HexColor("#c8a76a")
INK = colors.HexColor("#33425a")
MUTED = colors.HexColor("#6b7a90")

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "ABGCC-Website-Overview.pdf")

styles = getSampleStyleSheet()

h_section = ParagraphStyle(
    "Section", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=14, textColor=NAVY, spaceBefore=16, spaceAfter=4, leading=18,
)
intro = ParagraphStyle(
    "Intro", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10.5, textColor=INK, leading=16, spaceAfter=6,
)
bullet = ParagraphStyle(
    "Bullet", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10.5, textColor=INK, leading=15,
)
note = ParagraphStyle(
    "Note", parent=styles["Normal"], fontName="Helvetica-Oblique",
    fontSize=10, textColor=MUTED, leading=15, spaceBefore=4,
)
title_style = ParagraphStyle(
    "BigTitle", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=30, textColor=NAVY, leading=34, spaceAfter=2, alignment=TA_CENTER,
)
sub_style = ParagraphStyle(
    "Sub", parent=styles["Normal"], fontName="Helvetica",
    fontSize=12, textColor=GOLD, leading=16, alignment=TA_CENTER, spaceAfter=2,
)
eyebrow = ParagraphStyle(
    "Eyebrow", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=9, textColor=GOLD_SOFT, leading=12, alignment=TA_CENTER, spaceAfter=10,
)

story = []


def section(title, intro_text, bullets, closing=None):
    story.append(Paragraph(title, h_section))
    story.append(HRFlowable(width="100%", thickness=1.2, color=GOLD_SOFT,
                            spaceBefore=2, spaceAfter=8))
    if intro_text:
        story.append(Paragraph(intro_text, intro))
    if bullets:
        items = [ListItem(Paragraph(b, bullet), leftIndent=10, value="•")
                 for b in bullets]
        story.append(ListFlowable(items, bulletType="bullet", bulletColor=GOLD,
                                  bulletFontSize=9, leftIndent=12, spaceAfter=2))
    if closing:
        story.append(Paragraph(closing, note))
    story.append(Spacer(1, 4))


# ---- Cover header ----
logo_path = os.path.join(HERE, "public", "abgcc.webp")
try:
    from PIL import Image as PILImage
    png_logo = os.path.join(HERE, "scripts", "_logo.png")
    PILImage.open(logo_path).convert("RGBA").save(png_logo)
    img = Image(png_logo, width=70, height=70)
    img.hAlign = "CENTER"
    story.append(Spacer(1, 6))
    story.append(img)
    story.append(Spacer(1, 6))
except Exception:
    story.append(Spacer(1, 12))

story.append(Paragraph("AMERICAN BALKAN GLOBAL CHAMBER OF COMMERCE", eyebrow))
story.append(Paragraph("Website Overview", title_style))
story.append(Paragraph("A plain-language guide to everything the website does", sub_style))
story.append(Spacer(1, 6))
story.append(HRFlowable(width="40%", thickness=1.5, color=GOLD,
                        spaceBefore=6, spaceAfter=16, hAlign="CENTER"))

# ---- Sections ----
section(
    "1.  The Public Website",
    "These are the pages anyone can visit. The website automatically looks great on "
    "<b>phones, tablets, laptops, and large screens</b>.",
    [
        "<b>Home</b> — introduces ABGCC, its mission, and a call to become a member.",
        "<b>About</b> — the organization's story, leadership team, and values.",
        "<b>Services</b> — what ABGCC offers (B2B meetings, conferences, cultural events).",
        "<b>Membership</b> — the membership levels and their prices.",
        "<b>Events</b> — a list of upcoming events.",
        "<b>News</b> — articles and announcements from ABGCC.",
        "<b>Contact</b> — a form to get in touch.",
    ],
)

section(
    "2.  What Visitors Can Do",
    None,
    [
        "Create an account and confirm it by email.",
        "Log in securely.",
        "Become a member — choosing a level and paying online.",
        "Register for events, free or paid.",
        "Read news articles.",
        "Send a message through the contact form.",
    ],
)

section(
    "3.  Membership &amp; Payments",
    "Members can join in <b>two ways</b>:",
    [
        "<b>Pay by Card</b> — instant, secure online payment. Membership activates automatically.",
        "<b>Pay by Bank Transfer</b> — the system creates an invoice with ABGCC's bank "
        "details and a reference number. Once ABGCC confirms the payment, the membership activates.",
    ],
    "Everything is tracked: each member's level, status (active, pending, expired), "
    "renewal date, and full payment history.",
)

section(
    "4.  The Member Area (&ldquo;My Profile&rdquo;)",
    "Once logged in, members get their own private portal:",
    [
        "A personal <b>digital membership card</b> showing their name, tier, and status.",
        "Their <b>profile</b> — name, organization, position, phone, biography, and photo (all editable).",
        "Their <b>membership status</b> and <b>renewal date</b>.",
        "Their <b>payment history</b>.",
        "The ability to <b>change their password</b> and <b>update their photo</b> anytime.",
    ],
)

section(
    "5.  Events",
    None,
    [
        "<b>Free events:</b> visitors register with name and email and instantly receive a confirmation.",
        "<b>Paid events:</b> visitors pay online and receive their ticket.",
        "<b>Every attendee gets a unique QR code ticket</b> by email — used as their entry pass.",
        "Events can have a <b>capacity limit</b> and show <b>&ldquo;Sold Out&rdquo;</b> when full.",
        "At the door, staff can <b>scan the QR code to check people in</b>.",
    ],
)

section(
    "6.  News &amp; Articles",
    None,
    [
        "ABGCC can publish <b>news articles and blog posts</b> with images and rich formatting.",
        "Each article gets its own page, and all articles appear on the News page.",
        "Everything is managed by ABGCC — no developer needed.",
    ],
)

section(
    "7.  Automatic Emails",
    "The website sends professional emails automatically when someone:",
    [
        "<b>Registers</b> — to confirm their email.",
        "<b>Forgets their password</b> — a secure reset link.",
        "<b>Sends a contact message</b> — a confirmation to them and a notification to ABGCC.",
        "<b>Registers for an event</b> — their QR ticket, plus a heads-up to ABGCC.",
        "<b>Pays for a membership</b> — a payment confirmation.",
        "<b>Chooses bank transfer</b> — an invoice with the bank details.",
    ],
)

section(
    "8.  The Admin Panel (for ABGCC staff only)",
    "A private, password-protected control center where ABGCC manages everything — "
    "<b>no technical knowledge required</b>:",
    [
        "<b>Dashboard</b> — total revenue, number of members, and recent activity at a glance.",
        "<b>Members</b> — view every member, their details, and membership status.",
        "<b>Membership Levels</b> — create and edit tiers, prices, and descriptions.",
        "<b>Bank Transfers</b> — see pending requests and confirm payments with one click.",
        "<b>Events</b> — create/edit events, view who registered, add attendees, download the guest list.",
        "<b>Check-in</b> — scan attendee QR codes at events.",
        "<b>News</b> — write, edit, and publish articles.",
        "<b>Messages</b> — read all contact form submissions.",
        "<b>Payments</b> — a complete record of every membership and event payment.",
    ],
)

section(
    "9.  Security &amp; Quality (behind the scenes)",
    None,
    [
        "<b>Passwords are encrypted</b> — no one, not even ABGCC, can see them.",
        "<b>Email verification</b> confirms members are real.",
        "<b>Spam protection</b> on the contact form keeps out junk messages.",
        "<b>Secure payments</b> handled by Stripe, a trusted global payment provider.",
        "<b>Search-engine friendly</b> — built so the site can appear properly on Google.",
        "<b>Fully responsive</b> — works smoothly on every device.",
    ],
)

story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=1, color=GOLD_SOFT, spaceAfter=8))
story.append(Paragraph(
    "This website gives ABGCC everything it needs to manage members, events, news, "
    "and payments in one place — professionally and independently.", note))


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(GOLD_SOFT)
    canvas.setLineWidth(0.5)
    canvas.line(20 * mm, 14 * mm, 190 * mm, 14 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(20 * mm, 9 * mm, "ABGCC — American Balkan Global Chamber of Commerce")
    canvas.drawRightString(190 * mm, 9 * mm, "Page %d" % doc.page)
    canvas.restoreState()


doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=20 * mm, rightMargin=20 * mm,
    topMargin=18 * mm, bottomMargin=20 * mm,
    title="ABGCC Website Overview",
    author="ABGCC",
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("PDF written to:", OUT)
