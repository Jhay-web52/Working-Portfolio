"""Generate Joel Oguntade Timilehin's portfolio CV.

Source of truth for public/Joel_Oguntade_CV.pdf. Rebuilt 2026-09-11 after the
previous uncommitted local copy (Harvard format, monochrome, Helvetica; see
~/.claude/projects/-Users-jhay/memory/joel_cv_location.md for the full styling
history) was accidentally overwritten. Content reconstructed from a full text
extraction of that file taken immediately before the accident; styling rebuilt
to match the documented spec exactly.

Fixes the real ATS bug the old script had: bullet points were previously
rendered via reportlab's ListFlowable/bulletText mechanism, which produced
unmapped (cid:127) glyphs when the PDF's text layer was extracted (confirmed
via pdfminer.six). Bullets here are instead literal "-" characters typed as
part of each paragraph's text, which extracts cleanly as plain ASCII.

Run: uv run --with reportlab python3 generate_cv.py
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether,
)
from reportlab.lib import colors

OUT = "Joel_Oguntade_CV.pdf"
BLACK = colors.black

doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    topMargin=1 * inch, bottomMargin=1 * inch,
    leftMargin=1 * inch, rightMargin=1 * inch,
    title="Joel Oguntade Timilehin - CV",
)

styles = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=20, leading=24,
                            alignment=TA_CENTER, spaceAfter=6, textColor=BLACK),
    "role": ParagraphStyle("role", fontName="Helvetica", fontSize=12, leading=15,
                            alignment=TA_CENTER, spaceAfter=6, textColor=BLACK),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=9.5,
                               alignment=TA_CENTER, spaceAfter=1, textColor=BLACK),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=11,
                               spaceBefore=8, spaceAfter=1, textColor=BLACK),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.3,
                            leading=12, spaceAfter=3, textColor=BLACK),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=9.3,
                              leading=12, leftIndent=12, spaceAfter=1.5, textColor=BLACK),
    "entrytitle": ParagraphStyle("entrytitle", fontName="Helvetica-Bold", fontSize=9.6,
                                  textColor=BLACK),
    "entrydate": ParagraphStyle("entrydate", fontName="Helvetica-Oblique", fontSize=9.3,
                                 alignment=2, textColor=BLACK),
    "skillline": ParagraphStyle("skillline", fontName="Helvetica", fontSize=9.3,
                                 leading=12.5, spaceAfter=2, textColor=BLACK),
}

LINK = 'color="black"'  # keep hyperlinks visually black, per the monochrome spec


def rule():
    return HRFlowable(width="100%", thickness=0.75, color=BLACK, spaceBefore=1, spaceAfter=5)


def section_flowables(title):
    return [Paragraph(title.upper(), styles["section"]), rule()]


def entry_row_flowable(title, date):
    t = Table(
        [[Paragraph(f"<b>{title}</b>", styles["entrytitle"]),
          Paragraph(date, styles["entrydate"])]],
        colWidths=[4.7 * inch, 1.8 * inch],
    )
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


def bullet_flowables(items):
    return [Paragraph(f"- {it}", styles["bullet"]) for it in items]


story = []

# ---------------------------------------------------------------- HEADER
story.append(Paragraph("Joel Oguntade Timilehin", styles["name"]))
story.append(Paragraph("Frontend Developer", styles["role"]))
story.append(Paragraph(
    f'<link href="tel:+447345127068" {LINK}>+44 7345 127068</link> | '
    f'<link href="mailto:oguntadejoel65@gmail.com" {LINK}>oguntadejoel65@gmail.com</link> | '
    f'United Kingdom | '
    f'Portfolio: <link href="https://joeloguntade.vercel.app" {LINK}>joeloguntade.vercel.app</link>',
    styles["contact"]))
story.append(Paragraph(
    f'GitHub: <link href="https://github.com/Jhay-web52" {LINK}>github.com/Jhay-web52</link> | '
    f'LinkedIn: <link href="https://www.linkedin.com/in/joel-oguntade" {LINK}>linkedin.com/in/joel-oguntade</link>',
    styles["contact"]))
story.append(Spacer(1, 6))

# ---------------------------------------------------------------- PERSONAL STATEMENT
story += section_flowables("Personal Statement")
story.append(Paragraph(
    "Frontend Developer with hands-on experience building and shipping production web applications "
    "in React, Next.js, and TypeScript, from Figma handoff through deployment. Delivered client work "
    "in an agency internship, an interactive platform for a trading academy, and independent products, "
    "including FlashPromote, a SaaS integrating Stripe, Resend, and Supabase, and an e-commerce app "
    "handling live Paystack payments. Certified Frontend Engineer (AltSchool Africa), currently "
    "completing an MSc in Computing. Seeking frontend and remote opportunities in the UK.",
    styles["body"]))

# ---------------------------------------------------------------- TECHNICAL SKILLS
story += section_flowables("Technical Skills")
skills = [
    ("Frontend", "React.js, Next.js, TypeScript, JavaScript (ES6+), Vue.js, Nuxt.js, HTML5, CSS3"),
    ("Mobile", "React Native, Expo, Expo Router"),
    ("Styling &amp; UI", "Tailwind CSS, CSS Modules, SASS/SCSS, Bootstrap, Shadcn/UI, Responsive Design, Figma"),
    ("Backend &amp; DB", "Supabase (PostgreSQL, Auth, Storage, Edge Functions), Node.js, REST APIs"),
    ("Payments &amp; Email", "Stripe, Paystack, Resend"),
    ("3D &amp; Graphics", "Three.js, React Three Fiber"),
    ("State &amp; Data", "Zustand, React Query, React Hook Form, Zod, Axios, Fetch API"),
    ("Tools", "Git, GitHub, Vite, Vitest, Vercel, Postman, Chrome DevTools, VS Code"),
]
for label, value in skills:
    story.append(Paragraph(f"<b>{label}:</b> {value}", styles["skillline"]))

# ---------------------------------------------------------------- WORK EXPERIENCE
trueminds_block = (
    section_flowables("Work Experience")
    + [entry_row_flowable("Trueminds Innovations Ltd — Frontend Developer Internship", "Feb 2026 – Apr 2026")]
    + bullet_flowables([
        "Delivered 5+ production client websites end-to-end in React.js, HTML5, CSS3, and JavaScript, "
        "covering layout, responsive behaviour, and deployment.",
        "Converted Figma designs into production-ready components, catching design/implementation "
        "mismatches during handoff before they reached development.",
        "Debugged UI issues and reviewed code alongside senior developers as part of daily sprint workflow.",
        "Managed feature branches, commits, and pull requests across live client codebases using Git.",
    ])
)
story.append(KeepTogether(trueminds_block))
story.append(Spacer(1, 4))
story.append(entry_row_flowable("JhayFx Trading Academy — Frontend Engineer", "2024 – 2025"))
story += bullet_flowables([
    "Built and maintained the company's public web presence in HTML5, CSS3, and JavaScript across "
    "desktop and mobile breakpoints.",
    "Developed interactive Vue.js features for daily-use course content, used by enrolled students.",
    "Integrated social media and third-party APIs to extend platform functionality.",
    "Refactored JavaScript and compressed assets to cut page load time, improving usability on "
    "slower connections.",
])

# ---------------------------------------------------------------- KEY PROJECTS
flashpromote_block = (
    section_flowables("Key Projects")
    + [Paragraph(
        "<b>FlashPromote</b> (React · TypeScript · Supabase · PostgreSQL · Stripe · Resend · Vite)",
        styles["entrytitle"])]
    + bullet_flowables([
        "Built an influencer-marketing SaaS connecting brands with creators, using React/Next.js "
        "with Stripe, Resend, and Supabase for payments, email, and data.",
        "Designed dual-role dashboards: campaign creation and creator marketplace for brands; "
        "applications, pricing, and workspaces for influencers.",
        "Integrated Stripe for payment flows and Resend for transactional email, with Supabase "
        "handling auth, storage, and the real-time database.",
    ])
)
story.append(KeepTogether(flashpromote_block))
story.append(Spacer(1, 3))

story.append(Paragraph(
    "<b>OrbitTrack</b> (Next.js · TypeScript · Three.js · React Three Fiber · Tailwind CSS)",
    styles["entrytitle"]))
story += bullet_flowables([
    "Built a live satellite tracker on Next.js App Router, rendering real-time orbital positions for "
    "the ISS and other satellites on an interactive 3D globe with Three.js and React Three Fiber.",
    "Designed a server-side API proxy layer to keep third-party keys secure, with polling-based live "
    "updates and visible-pass predictions from browser geolocation.",
    "Implemented dynamic Open Graph share images per satellite via Next.js's image generation API "
    "for real social preview cards.",
])
story.append(Spacer(1, 3))

story.append(Paragraph(
    "<b>OrbitTrack Mobile</b> (React Native · Expo · Expo Router · TypeScript)",
    styles["entrytitle"]))
story += bullet_flowables([
    "Built a React Native companion to OrbitTrack with Expo Router, reusing the existing web app's "
    "API as its backend with zero new server infrastructure.",
    "Added live satellite tracking on a native map (react-native-maps) with location-based "
    "visible-pass predictions via device GPS (expo-location).",
    "Implemented local, client-scheduled push notifications (expo-notifications) ahead of visible "
    "passes, with AsyncStorage deduplication to prevent double-scheduling on re-fetch.",
])
story.append(Spacer(1, 3))

story.append(Paragraph(
    "<b>E-Commerce App</b> (React.js · TypeScript · Tailwind CSS · Zustand · Vite)",
    styles["entrytitle"]))
story += bullet_flowables([
    "Built a full e-commerce application with cart, checkout, and live Paystack payment integration "
    "handling real transactions.",
    "Used Zustand for cart state, React Query for product data, and Zod with React Hook Form for "
    "API-ready form validation.",
    "Wrote unit tests with Vitest, used Shadcn/UI components, and deployed to Vercel.",
])
story.append(Spacer(1, 3))

story.append(Paragraph(
    "<b>CinaVault</b> (React.js · React Router DOM · Vite)",
    styles["entrytitle"]))
story += bullet_flowables([
    "Built a movie discovery app pulling live data from a third-party API, letting users browse "
    "current and upcoming releases.",
    "Implemented client-side routing with React Router for a fast, SPA-style experience without "
    "full page reloads.",
    "Handled loading states and API error responses to keep the UI stable when data is delayed or "
    "unavailable.",
])

# ---------------------------------------------------------------- EDUCATION
sunderland_block = (
    section_flowables("Education")
    + [entry_row_flowable("University of Sunderland, UK — MSc Computing", "Expected 2027")]
)
story.append(KeepTogether(sunderland_block))
story.append(Spacer(1, 2))
story.append(entry_row_flowable("Oduduwa University, Nigeria — BSc Industrial Chemistry", "2018 – 2023"))

# ---------------------------------------------------------------- CERTIFICATIONS
cert_block = (
    section_flowables("Certifications")
    + [entry_row_flowable(
        "AltSchool Africa, School of Engineering — Certificate in Frontend Engineering",
        "March 2026")]
)
story.append(KeepTogether(cert_block))

# ---------------------------------------------------------------- ADDITIONAL INFORMATION
addinfo_block = section_flowables("Additional Information") + [
    Paragraph("<b>Languages:</b> English (Fluent)", styles["skillline"]),
    Paragraph("<b>Availability:</b> Full-time, Part-time, Contract, Remote", styles["skillline"]),
    Paragraph("<b>Interests:</b> Open-source contribution, building side projects, frontend architecture",
              styles["skillline"]),
]
story.append(KeepTogether(addinfo_block))

doc.build(story)
print(f"Wrote {OUT}")
