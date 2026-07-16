# Builds a detailed, plain-language PDF "Functionality Guide" of the ABGCC
# website — public site, member area, and (in depth) the admin panel.
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem,
    HRFlowable, Image, PageBreak,
)
from reportlab.lib.enums import TA_CENTER

NAVY = colors.HexColor("#10243f")
NAVY_SOFT = colors.HexColor("#1f5f93")
GOLD = colors.HexColor("#c8870a")
GOLD_SOFT = colors.HexColor("#c8a76a")
INK = colors.HexColor("#33425a")
MUTED = colors.HexColor("#6b7a90")

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "ABGCC-Functionality-Guide.pdf")

styles = getSampleStyleSheet()

h_section = ParagraphStyle(
    "Section", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=15, textColor=NAVY, spaceBefore=14, spaceAfter=4, leading=19,
)
h_sub = ParagraphStyle(
    "Sub", parent=styles["Heading3"], fontName="Helvetica-Bold",
    fontSize=11.5, textColor=NAVY_SOFT, spaceBefore=10, spaceAfter=3, leading=15,
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
    "SubTitle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=12, textColor=GOLD, leading=16, alignment=TA_CENTER, spaceAfter=2,
)
eyebrow = ParagraphStyle(
    "Eyebrow", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=9, textColor=GOLD_SOFT, leading=12, alignment=TA_CENTER, spaceAfter=10,
)

story = []


def section(title):
    story.append(Paragraph(title, h_section))
    story.append(HRFlowable(width="100%", thickness=1.2, color=GOLD_SOFT,
                            spaceBefore=2, spaceAfter=8))


def sub(title):
    story.append(Paragraph(title, h_sub))


def para(text):
    story.append(Paragraph(text, intro))


def bullets(items):
    li = [ListItem(Paragraph(b, bullet), leftIndent=10, value="•") for b in items]
    story.append(ListFlowable(li, bulletType="bullet", bulletColor=GOLD,
                              bulletFontSize=9, leftIndent=12, spaceAfter=2))


def steps(items):
    li = [ListItem(Paragraph(b, bullet), leftIndent=12) for b in items]
    story.append(ListFlowable(li, bulletType="1", bulletColor=NAVY_SOFT,
                              bulletFontName="Helvetica-Bold",
                              leftIndent=16, spaceAfter=2))


def note_text(text):
    story.append(Paragraph(text, note))


def gap(h=4):
    story.append(Spacer(1, h))


# ---- Cover ----
logo_path = os.path.join(HERE, "public", "abgcc.webp")
try:
    from PIL import Image as PILImage
    png_logo = os.path.join(HERE, "scripts", "_logo.png")
    PILImage.open(logo_path).convert("RGBA").save(png_logo)
    img = Image(png_logo, width=72, height=72)
    img.hAlign = "CENTER"
    story.append(Spacer(1, 6))
    story.append(img)
    story.append(Spacer(1, 6))
except Exception:
    story.append(Spacer(1, 12))

story.append(Paragraph("AMERICAN BALKAN GLOBAL CHAMBER OF COMMERCE", eyebrow))
story.append(Paragraph("Website Functionality Guide", title_style))
story.append(Paragraph("What every part of the website does &amp; how staff use it", sub_style))
story.append(Spacer(1, 6))
story.append(HRFlowable(width="40%", thickness=1.5, color=GOLD,
                        spaceBefore=6, spaceAfter=14, hAlign="CENTER"))
para(
    "This guide explains, in plain language, everything the ABGCC website does — "
    "the public pages, the member area, and the staff <b>Admin Panel</b> in detail. "
    "It is written for non-technical readers: each feature is described by <b>what it "
    "does</b> and <b>how it is used</b>. The website works smoothly on phones, tablets, "
    "laptops, and large screens."
)

# ====================================================================
# PART A — PUBLIC WEBSITE
# ====================================================================
section("1.  The Public Website")
para("These pages are visible to anyone. All content is managed by ABGCC.")
bullets([
    "<b>Home</b> — introduces ABGCC, its mission, highlighted content, and a clear call to become a member.",
    "<b>About</b> — the organization's story, leadership, and values.",
    "<b>Services</b> — what ABGCC offers.",
    "<b>Membership</b> — the five membership levels with prices, a full benefits comparison table, and a “Join Now” button per level.",
    "<b>Events</b> — upcoming and past events, in two tabs.",
    "<b>News</b> — articles and announcements, each with its own page.",
    "<b>Members Directory</b> — a private directory of members (visible only to logged-in members and staff).",
    "<b>Contact</b> — a contact form plus ABGCC's contact details.",
    "<b>Join Our Team</b> — a careers form where applicants can submit details and upload a CV.",
    "<b>Newsletter sign-up</b> — in the footer, visitors can subscribe with their email.",
])

section("2.  What Visitors Can Do")
bullets([
    "Create an account and confirm it through a verification email.",
    "Log in securely; reset a forgotten password by email.",
    "Become a member — choose a level and pay by card or bank transfer.",
    "Register for events — free or paid.",
    "Read news articles and browse events.",
    "Send a message through the contact form.",
    "Subscribe to the newsletter.",
    "Apply through the “Join Our Team” page.",
])

# ====================================================================
# MEMBERSHIP & PAYMENTS
# ====================================================================
section("3.  Membership &amp; Payments")
para("There are five membership levels: <b>Presidential Circle, Patron, Corporate, "
     "Professional, and Individual</b>. A visitor can join in two ways:")
bullets([
    "<b>Pay by card</b> — instant, secure online payment (via Stripe). The membership activates automatically.",
    "<b>Pay by bank transfer</b> — the system generates an invoice with ABGCC's bank details and a reference number. "
    "The membership stays “Pending” until a staff member confirms the payment in the Admin Panel, then it activates.",
])
para("Every membership is tracked with a <b>status</b> (Active, Pending, Expired, Cancelled), "
     "a <b>renewal date</b>, and a full <b>payment history</b>. When a membership is activated, the "
     "member is automatically given a permanent <b>member number</b>.")
sub("Automatic renewal reminders")
para("The website checks daily and emails members automatically <b>30 days</b> and again "
     "<b>7 days</b> before their membership expires, with a link to renew. Each reminder is sent "
     "only once per term, and the cycle resets automatically when a member renews.")

# ====================================================================
# MEMBER PORTAL
# ====================================================================
section("4.  The Member Area (Portal)")
para("After logging in, each member gets a private portal:")
bullets([
    "A <b>digital membership card</b> showing their name, membership level, status, and member number.",
    "Their <b>profile</b> — name, organization, position, phone, biography, and photo (all editable).",
    "Their <b>company / directory profile</b> — logo, description, website, industry, key contact, and more (this is what appears in the Members Directory).",
    "Their <b>membership status</b> and <b>renewal date</b>.",
    "Their full <b>payment history</b>.",
    "The ability to <b>renew or upgrade</b> their membership directly.",
    "The ability to <b>change their password</b> and <b>update their photo</b> at any time.",
    "If a bank-transfer payment is pending, a link to view the <b>invoice</b>.",
])

# ====================================================================
# EVENTS
# ====================================================================
section("5.  Events")
bullets([
    "<b>Free events</b> — a visitor registers with name and email and instantly receives a confirmation.",
    "<b>Paid events</b> — the visitor pays securely online and receives their ticket by email.",
    "<b>Member vs non-member pricing</b> — an event can have two prices. Logged-in active members automatically "
    "get the member price (shown with the standard price crossed out); a member who isn't logged in can enter "
    "their member number to unlock it. Member price can even be free.",
    "<b>QR-code tickets</b> — every attendee receives a unique QR code by email, used as their entry pass.",
    "<b>Capacity limits</b> — an event can cap attendance and shows “Sold Out” when full.",
    "<b>Photo gallery</b> — events can show a gallery; clicking a photo opens it full-screen.",
])

# ====================================================================
# MEMBERS DIRECTORY
# ====================================================================
section("6.  Members Directory")
para("A private directory available only to logged-in members and staff.")
bullets([
    "Members are <b>organized by industry sector</b> (13 sectors), not by price level.",
    "<b>Presidential Circle</b> members are featured at the top.",
    "Each member shows a <b>colored tier badge</b> (a different color per membership level).",
    "Visitors can <b>search by name/company</b> and <b>filter by industry</b>.",
    "Clicking a member opens a <b>full profile</b> — logo, company description, website, industry tags, key contact, and featured projects.",
])

# ====================================================================
# NEWS & EDITOR
# ====================================================================
section("7.  News &amp; Articles")
bullets([
    "ABGCC can publish <b>news articles and blog posts</b>, each with its own page.",
    "Articles are written in a <b>Word-like editor</b> (described in the Admin Panel section).",
    "Everything is managed by ABGCC — no developer needed.",
])

story.append(PageBreak())

# ====================================================================
# PART B — ADMIN PANEL (DETAILED)
# ====================================================================
section("8.  The Admin Panel — for ABGCC Staff")
para("A private, password-protected control center. Only staff accounts can open it. "
     "There are two staff roles: <b>Super Admin</b> (full access) and <b>Editor</b> (content). "
     "No technical knowledge is required to use it.")

sub("8.1  Dashboard")
para("The first screen gives an at-a-glance overview:")
bullets([
    "<b>Total revenue</b> (membership payments + event ticket sales combined).",
    "<b>Total users</b>, <b>active members</b>, and <b>total events</b>.",
    "<b>Recent payments</b> and <b>recent sign-ups</b>.",
    "Shortcut buttons to every management area.",
])

sub("8.2  Membership Levels")
para("Manage the membership tiers shown on the website.")
steps([
    "Open <b>Memberships</b> to see all levels.",
    "Click <b>New</b> to add a level — set its title, description, price, billing period, and whether it's active.",
    "Edit any level's price or description at any time; changes appear on the site immediately.",
    "Activate or deactivate a level, or delete it (deletion is blocked if members are using it, to protect data).",
])

sub("8.3  Members &amp; Users")
para("A complete record of everyone with an account.")
bullets([
    "Search the member list and open any member to see their profile, membership, payment history, and event registrations.",
    "<b>Manually assign or change</b> a membership (level, status, dates) — useful for offline or comped memberships.",
    "Edit a member's <b>Directory Profile</b> (company logo, description, industry, key contact, etc.) on their behalf.",
    "Each member's permanent <b>member number</b> is shown here.",
])

sub("8.4  Bank-Transfer Confirmations")
para("When a member chooses to pay by bank transfer, their membership waits as “Pending”.")
steps([
    "ABGCC receives the transfer in its bank account and matches it by the invoice reference.",
    "In the Admin Panel, open the pending membership and click <b>Confirm payment</b>.",
    "The membership activates instantly, the payment is recorded, the member number is assigned, and a confirmation email is sent automatically.",
])

sub("8.5  Events")
para("Create and manage events end-to-end.")
steps([
    "Click <b>New Event</b> and fill in the details: title (with an optional <b>custom title color</b> for readability over the photo), "
    "a rich description, location, date/time, hero image, capacity, and pricing.",
    "Set <b>pricing</b>: a non-member price and an optional (lower or free) member price.",
    "Add a <b>photo gallery</b> — upload up to 10 images at once, or paste image URLs; all images are stored on the fast image service.",
    "Save. The event appears on the public Events page.",
])
para("For each event, staff can also:")
bullets([
    "See the full <b>list of registrations</b> and who has paid.",
    "<b>Add an attendee manually</b> (e.g. someone who registered by phone).",
    "<b>Download the guest list</b> as a spreadsheet (CSV).",
    "Mark people as <b>attended</b>, or use <b>Check-in</b> to scan QR tickets at the door.",
])

sub("8.6  News &amp; Blog — the Editor")
para("Articles (and event descriptions) are written in a <b>Word-like editor</b>. No coding needed. It supports:")
bullets([
    "Headings, <b>bold</b>, <i>italic</i>, underline, strikethrough, and text color.",
    "Font family and font size.",
    "Bullet and numbered lists, quotes, and dividers.",
    "Links, and <b>images</b> — upload from the computer or paste a URL — which can be <b>resized by dragging</b>.",
    "<b>Resizable columns</b> for side-by-side layouts.",
    "A cover image, short summary, and “Published / Featured” switches per article.",
])

sub("8.7  Contact Messages")
bullets([
    "Every contact-form submission is saved here and can be read in the Admin Panel.",
    "Messages can be marked as read.",
    "Each message is also emailed to ABGCC's chosen address.",
])

sub("8.8  Payments")
bullets([
    "A complete, searchable record of every payment — both memberships and event tickets.",
    "Shows who paid, for what, how much, and when.",
])

sub("8.9  Newsletter Subscribers")
bullets([
    "The list of everyone who subscribed via the footer sign-up, available for export/use by ABGCC.",
])

# ====================================================================
# AUTOMATIC EMAILS
# ====================================================================
section("9.  Automatic Emails")
para("The website sends professional, branded emails automatically when someone:")
bullets([
    "<b>Registers</b> — to verify their email address.",
    "<b>Forgets their password</b> — a secure reset link.",
    "<b>Sends a contact message</b> — a confirmation to them, and a notification to ABGCC.",
    "<b>Registers for an event</b> — their QR-code ticket, plus a notification to ABGCC.",
    "<b>Pays for a membership</b> — a payment confirmation and a receipt.",
    "<b>Chooses bank transfer</b> — an invoice with ABGCC's bank details.",
    "<b>Is nearing renewal</b> — reminder emails 30 and 7 days before expiry.",
    "<b>Applies through “Join Our Team”</b> — a confirmation to them and the application to ABGCC.",
])

# ====================================================================
# SECURITY & QUALITY
# ====================================================================
section("10.  Security &amp; Quality (behind the scenes)")
bullets([
    "<b>Passwords are encrypted</b> — no one, not even ABGCC, can read them.",
    "<b>Email verification</b> confirms that members are real.",
    "<b>Spam protection</b> on the contact form keeps out junk.",
    "<b>Secure payments</b> are handled by Stripe, a trusted global payment provider; ABGCC never stores card numbers.",
    "<b>Fast images</b> — all uploaded images are served from a global image network for quick loading.",
    "<b>Search-engine friendly</b> — built so the site appears properly on Google.",
    "<b>Always encrypted (HTTPS)</b> and <b>fully responsive</b> on every device.",
])

gap(8)
story.append(HRFlowable(width="100%", thickness=1, color=GOLD_SOFT, spaceAfter=8))
note_text(
    "In short: ABGCC can manage members, memberships, payments, events, news, and the "
    "member directory entirely on its own — professionally and independently — while the "
    "website handles payments, tickets, emails, and renewal reminders automatically."
)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(GOLD_SOFT)
    canvas.setLineWidth(0.5)
    canvas.line(20 * mm, 14 * mm, 190 * mm, 14 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(20 * mm, 9 * mm, "ABGCC — Website Functionality Guide")
    canvas.drawRightString(190 * mm, 9 * mm, "Page %d" % doc.page)
    canvas.restoreState()


doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=20 * mm, rightMargin=20 * mm,
    topMargin=18 * mm, bottomMargin=20 * mm,
    title="ABGCC Website Functionality Guide",
    author="ABGCC",
)
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("PDF written to:", OUT)
