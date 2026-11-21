# Asha Vaani

## Introduction

<p align="center">
<img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781443006/asha_logo_nix7n7.jpg" width="50%" align="center" style="border-radius: 8px;">
</p>

**Problem statement:** India has more than a million ASHA (Accredited Social Health Activist) workers. They still use paper registers to track maternal health, child nutrition, vaccinations, disease surveillance and the welfare of orphaned and vulnerable children in rural villages. The result is late detection of high-risk cases, double data entry, no real-time view for supervisors, and loose coordination with the NGOs that care for vulnerable children. (Google Solution Challenge 2026 theme: Data Driven Volunteer Coordination For Social Impact.)

**Solution:** Asha Vaani moves ASHA work from paper to the phone, in Marathi, Hindi and English. Workers fill 12 health registers by voice, photograph paper registers for OCR import, and screen children for malnutrition using a photo and a ₹5 coin as a size reference. A fixed-formula risk engine scores every child and flags high-risk pregnancies. Supervisors use a web portal to review flags, verify and close referrals, and follow each case through a care loop view. NGOs register through Google Forms, and supervisors book visits, assign workers and email the NGO from the app. Everything works offline and syncs when the phone reconnects. AI only drafts and suggests. A person confirms before anything is saved or closed.

Asha Vaani was built for Google Solution Challenge 2026, where it was selected in the Global Top 100. It is also entered in the Future Health Digital Innovation Challenge (Population Health: Closing the Screening-to-Care Loop). Built by Team Asha Vaani.

## Intro To Asha Vaani Video

[![Intro To AshaAI](https://res.cloudinary.com/drb4gctam/image/upload/v1781581550/Empowering_ASHAs_Elevating_Healthcare_1_pe40sk.png)](https://youtu.be/ZbqG6uUldfI?si=LarbruBTeVuaWRxU)

A short walkthrough of the voice-first, offline-first platform for ASHA workers. Click the image to watch.

### Our Target SDG Goals

<p align="center">
  <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781363044/E_PRINT_03_hnvufu.jpg" width="200"/>
  <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781362667/E_PRINT_10_xruhrt.jpg" width="200"/>
  <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781519319/E_PRINT_17_k36bty.jpg" width="200"/>
</p>

<ins>**SDG 3, Good Health and Well-being.**</ins> Risk scoring and live supervisor monitoring help find high-risk mothers and children earlier.

<ins>**SDG 10, Reduced Inequalities.**</ins> The NGO and orphanage module connects orphaned and vulnerable children to coordinated health visits, wherever they live and whoever cares for them.

<ins>**SDG 17, Partnerships for the Goals.**</ins> ASHA workers, government supervisors and NGOs work in one system. Registration, scheduling and email that used to be handled by hand are now automated.

## Global Recognition for ASHA Workers

The Government of India and the WHO have both recognised ASHA workers publicly. Three examples are below.

<br>

<table style="width: 100%; text-align: center;">
  <tr>
    <td style="width: 33%; padding: 15px;">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVJGdHjeqAg-GnIIqEVjdMYz9qnvbVzNDmUA&s" width="100%" style="border-radius: 8px;">
      <br><br>
      <b>Narendra Modi</b><br>
      <i>Prime Minister, India</i>
    </td>
    <td style="width: 33%; padding: 15px;">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKvGH2pS1yFfwy4X2twnYuivQPMaiCF03F3A&s" width="100%" style="border-radius: 8px;">
      <br><br>
      <b>World Health Organization</b><br>
      <i>Global Health Leaders Award</i>
    </td>
    <td style="width: 33%; padding: 15px;">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSepURZt-f112wNUGblzXPMA_2fAGMKHVDZUg&s" width="100%" style="border-radius: 8px;">
      <br><br>
      <b>Bill Gates</b><br>
      <i>Praise for ASHAs, as recalled by the Prime Minister</i>
    </td>
  </tr>
  <tr style="vertical-align: top;">
    <td style="padding: 10px;">
      <p><i>"They are at the forefront of ensuring a healthy India. Their dedication and determination is admirable."</i></p>
      <a href="https://www.pmindia.gov.in/en/news_updates/pm-expresses-happiness-on-the-entire-team-of-asha-workers-getting-who-director-generals-global-health-leaders-award/?comment=disable" target="_blank"><b>Read the statement</b></a>
    </td>
    <td style="padding: 10px;">
      <p>In May 2022 the WHO Director-General's Global Health Leaders Award was given to India's ASHA workers.</p>
      <a href="https://x.com/WHO/status/1528411437332369408" target="_blank"><b>View the WHO post</b></a>
    </td>
    <td style="padding: 10px;">
      <p>In 2018 the Prime Minister told a group of ASHA representatives that Bill and Melinda Gates had praised ASHAs for their work against kala-azar.</p>
      <a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=1546792&reg=48&lang=2" target="_blank"><b>Read the press release</b></a>
    </td>
  </tr>
</table>

## Technical Architecture & Documentation

A separate technical document covers the design in more detail. It includes:

* The full tech stack across the frontend, backend, AI service and database.
* How data sync, offline support, the risk engine and orphan flagging work.
* How the ASHA app, the supervisor portal and the NGO network talk to each other.
* How we built the system, step by step.

<br>

<p align="center">
  <a href="https://drive.google.com/file/d/1z8rv3p6vAUzPKhGIpnf9wki-_R4Bv7rg/view?usp=sharing" target="_blank">
    <img src="https://img.shields.io/badge/View_Full_Project_Documentation-0052CC?style=for-the-badge&logo=googledrive&logoColor=white" alt="View Documentation Button" />
  </a>
</p>

## Repository Structure

```
asha-ai/
├── frontend/     React 19 PWA: ASHA app and Admin/Supervisor portal   (see frontend/README.md)
├── backend/      Spring Boot 3 (Java 21), the only write path to the database   (see backend/README.md)
├── ai-service/   Python FastAPI: provider chain, malnutrition pipeline, voice and agent   (see ai-service/README.md)
├── scripts/      Azure provisioning, auth seeding and the MUAC validation script
└── .github/workflows/   CI and deploy workflows (frontend, backend, ai-service, cron)
```

**How the pieces talk to each other**

```
React PWA (ASHA + Admin)  -->  Spring Boot backend  -->  Supabase PostgreSQL (row-level security)
        |                            |
   IndexedDB offline queue           +-->  FastAPI ai-service  -->  near.ai (optional)
                                                                 > Hugging Face models
                                                                 > Gemini / Groq (final fallback)
Google Form -> Apps Script webhook -->  Spring Boot  /api/ngo/form-submission  -->  Gmail SMTP
```

One rule shapes the design: React to Spring Boot to Postgres is the only write path. The frontend never writes application data to Supabase directly (only `supabase.auth.*` calls). No AI feature can submit, publish, delete or send on its own.

## Local Development Setup

Each service has its own setup guide:

| Service | Setup guide | Default local port |
|---|---|---|
| Backend (Spring Boot) | [`backend/README.md`](backend/README.md) | `8080` |
| AI service (FastAPI) | [`ai-service/README.md`](ai-service/README.md) | `8000` |
| Frontend (React + Vite) | [`frontend/README.md`](frontend/README.md) | `5173` |

Start them in this order: backend, ai-service, frontend.

```bash
git clone https://github.com/Rohan45create/asha-ai.git
cd asha-ai
```

> [!WARNING]
> Never commit `.env` or `.env.local` files, and never paste real keys into workflow files. Secrets belong in local env files, GitHub Actions secrets and Azure app settings.

## Deployment (all free tier)

| Component | Hosted on | Deployed by |
|---|---|---|
| Frontend | Azure Static Web Apps (Free) | `.github/workflows/deploy-frontend.yml` |
| Backend | Azure App Service (F1 Free) | `.github/workflows/deploy-backend.yml` |
| AI service | Azure Container Apps (scale to zero) | `.github/workflows/deploy-ai-service.yml` |
| Database and Auth | Supabase | Schema managed in Supabase |
| Scheduled jobs | GitHub Actions cron | `.github/workflows/cron-jobs.yml` |

Deploy in this order: ai-service, backend, frontend. Then point the NGO Apps Script webhooks at the backend URL.

## Getting Started

> [!IMPORTANT]
> AshaAI is offline-first. It works without a connection and syncs when the phone is back online.

1. Open the live prototype: [https://lemon-sand-022ee5b00.8.azurestaticapps.net](https://lemon-sand-022ee5b00.8.azurestaticapps.net)
2. ASHA worker login: phone number and OTP (test credentials available on web app).
3. Admin and supervisor login:
   Email: *admin@asha.gov.in*
   Password: *(provided in the demo video or web app)*

## Initial Survey and Problem Statement Research

<table style="width: 100%;">
  <tr>
    <td align="center" width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781433793/img_5355.mov_2026-06-14_13-07-04.187_orqa2v.jpg" alt="Asha Center" width="350"/><br>
      <p>Asha Center, Satara</p>
    </td>
    <td align="center" width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781434866/img_5358_1_.mov_2026-06-14_16-23-44.861_lrhavt.jpg" alt="Asha Center" width="350"/><br>
      <p>Asha Center, Satara</p>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1792221473/WhatsApp_Image_2026-10-17_at_12.46.14_PM_o241hf.jpg" alt="Asha Center" width="350"/><br>
      <p>Organized session for ASHA workers</p>
    </td>
    <td align="center" width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1792221473/WhatsApp_Image_2026-10-17_at_12.46.13_PM_ixoyuf.jpg" alt="MNC Letter" width="350"/><br>
      <p>Session at Maulana Azad Research Centre</p>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1792222478/WhatsApp_Image_2026-10-17_at_1.04.24_PM_pb1qm7.jpg" alt="Asha Center" width="350"/><br>
      <p>Session team</p>
    </td>
    <td align="center" width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1792222244/imgonline-com-ua-twotoone-ws7yMwqBUxot_pgfsv0.jpg" alt="MNC Letter" width="350"/><br>
      <p>Municipal Corporation letters</p>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <p>We interviewed practising ASHA workers in the Marathwada region and photographed their physical diary registers. The register is a 128-page book covering 75 task types across village health surveys, family surveys, performance tasks and training records.</p>
      <p>Five problems came up repeatedly. Data cannot be edited once it is written, so one mistake is permanent. Apps crash without internet. Workers do the job twice, first in the paper diary and then again in an app. Low digital literacy makes typing slow. And there is no structured way to coordinate with local NGOs that care for orphaned children. These findings moved AshaAI away from a narrow malnutrition tracker and toward a digital platform for the full set of 75 tasks, with NGO coordination built in.</p>
    </td>
  </tr>
</table>

## Real User Research

#### In-person interviews with ASHA workers, plus analysis of physical register pages from villages in Beed district, Maharashtra.

<hr>

<table style="width: 100%;">
  <tr>
    <p>Existing digital health apps for ASHA workers are English-only, need typing, depend on an internet connection, and have no link to the NGOs and orphanages that support vulnerable children in the same villages.</p>
    <p>We mapped every column of two paper registers field by field: the Family Survey Register (कुटुंब पाहणी सर्वेक्षण) and the Village Health Survey Register (ग्राम आरोग्य सर्वेक्षण). The digital forms are a 1:1 replacement for the paper ones workers already know. We added an orphan and vulnerable-child flag that feeds the NGO module.</p>
  </tr>
</table>

### Public Opinion and Community Needs

We surveyed more than 1,000 community members and health workers across Maharashtra about the main challenges in the field.

The results pointed to offline data entry as the most urgent problem, and to Marathi and Hindi support as something workers want built in. We also asked which features people wanted most. The results are below.

<table style="width: 100%;">
  <tr>
    <td width="100%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436523/Screenshot_14-6-2026_165742_docs.google.com_souyhg.jpg" alt="Survey Result: Overview" style="width: 100%;">
    </td>
  </tr>
</table>
<table style="width: 100%;">
  <tr>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436513/Screenshot_14-6-2026_165532_docs.google.com_yrerdl.jpg" alt="Survey Result 1" style="width: 100%;">
    </td>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436514/Screenshot_14-6-2026_165542_docs.google.com_hc97hz.jpg" alt="Survey Result 2" style="width: 100%;">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436513/Screenshot_14-6-2026_16572_docs.google.com_jaa2fm.jpg" alt="Survey Result 3" style="width: 100%;">
    </td>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436514/Screenshot_14-6-2026_165553_docs.google.com_a3tzn5.jpg" alt="Survey Result 4" style="width: 100%;">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436515/Screenshot_14-6-2026_165625_docs.google.com_tgf4i8.jpg" alt="Survey Result 5" style="width: 100%;">
    </td>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436514/Screenshot_14-6-2026_165617_docs.google.com_jbf5py.jpg" alt="Survey Result 6" style="width: 100%;">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436516/Screenshot_14-6-2026_165641_docs.google.com_fytydj.jpg" alt="Survey Result 7" style="width: 100%;">
    </td>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436517/Screenshot_14-6-2026_165652_docs.google.com_nn0ut2.jpg" alt="Survey Result 8" style="width: 100%;">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436518/Screenshot_14-6-2026_165712_docs.google.com_csiboj.jpg" alt="Survey Result 9" style="width: 100%;">
    </td>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436518/Screenshot_14-6-2026_165633_docs.google.com_weuall.jpg" alt="Survey Result 10" style="width: 100%;">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436520/Screenshot_14-6-2026_165725_docs.google.com_p041o4.jpg" alt="Survey Result 11" style="width: 100%;">
    </td>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436520/Screenshot_14-6-2026_165733_docs.google.com_aj77qr.jpg" alt="Survey Result 12" style="width: 100%;">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436522/Screenshot_14-6-2026_16561_docs.google.com_t9mil1.jpg" alt="Survey Result 13" style="width: 100%;">
    </td>
    <td width="50%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781436522/Screenshot_14-6-2026_16569_docs.google.com_iqpbwp.jpg" alt="Survey Result 14" style="width: 100%;">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <a href="https://docs.google.com/spreadsheets/d/1U9nKSXWsRMeCXmQv4kX1wksEwEVVB6ZDDZEPAmejlRk/edit?usp=sharing" target="_blank">
        <img src="https://i.ibb.co/pvF3sTkm/image.png" alt="AshaAI Feedbacks Excel Sheet" style="width: 100%;">
      </a>
      <br>
      <b>AshaAI feedback spreadsheet</b>
    </td>
  </tr>
</table>

## User Guide

### Walkthrough

<table style="width: 100%;">
  <tr>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360961/Galaxy-Note20-Ultra-ashaai-prod.web.app_wj0zdt.png" width="120"/><br>
      <b>ASHA Login Screen</b><br>
      Phone OTP login. The EN / मर / हि language toggle is always visible.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360956/Galaxy-Note20-Ultra-ashaai-prod.web.app_1_clwpwf.png" width="120"/><br>
      <b>ASHA Home Dashboard</b><br>
      Today's families, critical cases, the priority list, and shortcuts to all 12 health modules.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360960/Galaxy-Note20-Ultra-ashaai-prod.web.app_9_a7y8uk.png" width="120"/><br>
      <b>Voice Dictation</b><br>
      Tap the mic and speak in Marathi or Hindi. The AI fills the form fields and the worker reviews them.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781431028/Galaxy-Note20-Ultra-ashaai-prod.web.app2_2_lb3rwz.png" width="120"/><br>
      <b>Register OCR Import</b><br>
      Photograph a paper register page. Every row is extracted, and low-confidence fields are flagged for review before import.
    </td>
  </tr>
  <tr>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360961/Galaxy-Note20-Ultra-ashaai-prod.web.app_13_e8b9dk.png" width="120"/><br>
      <b>AI Malnutrition Scan</b><br>
      Photograph a child with a ₹5 coin for scale. Three models estimate the measurement, classify the photo and draft a SAM, MAM or Normal report. The worker confirms it.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360956/Galaxy-Note20-Ultra-ashaai-prod.web.app_6_lgk9n0.png" width="120"/><br>
      <b>Ask AshaAI</b><br>
      A question-and-answer assistant for health protocols, danger signs and guidance.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360960/Galaxy-Note20-Ultra-ashaai-prod.web.app_14_dthump.png" width="120"/><br>
      <b>Download Survey Registers</b><br>
      Export any register as a report for a date range of the worker's choice.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360961/Macbook-Air-ashaai-prod.web.app_1_f6jbmc.png" width="300"/><br>
      <b>Admin Dashboard</b><br>
      Live view of all ASHA workers, families covered, critical cases and survey completion.
    </td>
  </tr>
  <tr>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360968/Macbook-Air-ashaai-prod.web.app_7_bu3xri.png" width="300"/><br>
      <b>Pending Review Queue</b><br>
      Supervisors approve or reject flagged items such as validation flags, high-risk ANC cases and NGO registrations.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360969/Macbook-Air-ashaai-prod.web.app_8_akgzck.png" width="300"/><br>
      <b>Survey Builder</b><br>
      Supervisors create survey fields, which are translated to Marathi and Hindi automatically, and publish them to all workers.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360964/Macbook-Air-ashaai-prod.web.app_4_lrhvky.png" width="300"/><br>
      <b>NRC Referral Tracking</b><br>
      Follow malnutrition referrals from pending to admitted to discharged, with the full case history.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360967/Macbook-Air-ashaai-prod.web.app_9_jrzweo.png" width="300"/><br>
      <b>Coverage Map</b><br>
      A Google Maps view of village coverage and critical cases across the district.
    </td>
  </tr>
  <tr>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360964/Macbook-Air-ashaai-prod.web.app_6_xwtevu.png" width="300"/><br>
      <b>NGO Management</b><br>
      Supervisors see every registered NGO and orphanage, approve new registrations and edit their details.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781360956/Galaxy-Note20-Ultra-ashaai-prod.web.app_3_yeteie.png" width="120"/><br>
      <b>NGO Appointment Booking</b><br>
      Book a visit to an NGO or orphanage, assign workers, and send an email confirmation automatically.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781431029/Galaxy-Note20-Ultra-docs.google.com_d6mht4.png" width="120"/><br>
      <b>NGO Self-Registration (Google Forms)</b><br>
      New NGOs register through a Google Form. Each submission lands in the admin's pending review queue.
    </td>
    <td align="center" width="25%">
      <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1781431015/Screenshot_2026-06-14_152019_tz3943.png" width="300"/><br>
      <b>Automated NGO Emails</b><br>
      NGOs get an email for each scheduled visit, with a one-click reschedule link.
    </td>
  </tr>
</table>

## Key Features

- **Offline first.** Every module works with no connection. An IndexedDB queue and a service worker sync the data when the phone is back online.
- **Voice dictation in Marathi and Hindi** on every form. The speech provider chain is near.ai (optional), then a Hugging Face model, then Gemini.
- **Conversational agent.** One tap starts a spoken session. The worker can fill a survey by talking (draft only) or ask for a PDF report by voice.
- **Register OCR import.** Handwritten paper registers are digitised row by row, with a confidence score on each field.
- **Malnutrition scanner with three models.** MediaPipe and the ₹5 coin give a size estimate, a custom ONNX classifier checks the photo, and Gemini and Groq write a combined report. The worker confirms the grade before it is saved. The measurement is an estimate and the UI says to confirm it with a tape.
- **Risk engine without AI guesses.** Every child gets a 0 to 100 score from a fixed formula, with a separate uplift when a sibling has a SAM or MAM record, and a supervisor-confirmed high-risk ANC flag.
- **Priority list.** Risk scores, overdue visits and vaccines, and supervisor flags are merged into one ranked list per worker.
- **12 modules, one form renderer.** All modules, and any survey a supervisor builds, are database-driven schemas shown by a single dynamic form.
- **Full edit capability** on every field, with an append-only audit trail.
- **Survey Builder.** Supervisors publish new surveys without code, translated to Marathi and Hindi.
- **Permanent identity.** Every person has a permanent UUID. Aadhaar or a temporary ID is only a lookup key. Aadhaar card scanning is on-device OCR, so the image never leaves the phone, and Aadhaar and ABHA fields are encrypted with AES-256-GCM.
- **Human in the loop.** AI features draft and suggest. No agent has a submit, publish, delete or send tool.
- **NGO and orphanage integration.** NGOs self-register through Google Forms. Supervisors approve them, book visits, assign ASHA workers, and the system emails the NGO the visit details and a pre-filled reschedule link.
- **Supervisor portal.** Dashboard, worker activity, NRC referral tracking, coverage map, and PDF and CSV reports.

**Added after organiser feedback (Future Health Digital Innovation Challenge)**

- **Referral closure needs a supervisor.** An ASHA can only request closure. A supervisor closes it, and must enter an evidence note of at least 10 characters. Each closure is written to the audit trail.
- **Care loop view for supervisors.** A desktop page lists open cases with days since flagged, the assigned ASHA, appointment status and overdue days. It shows a rule-based drop-off risk (low, medium or high) with the reasons: no appointment booked after 7 days, appointment rescheduled or missed, referral rejected, or no ASHA visit in 14 days. It is not a prediction model.
- **Family reminder drafts** in English, Marathi and Hindi. A person copies the text or opens it in WhatsApp and sends it. Nothing is sent automatically.
- **"AI-assisted screening, not a diagnosis"** label on the scanner result, the ANC flag, the risk score, reports and the chatbot.
- **FHIR-ready export.** Read-only, supervisor-only endpoints return FHIR R4 Patient, Observation and ServiceRequest resources. The data is synthetic and the export is not connected to any live health record system.
- **MUAC validation script** for comparing app readings with tape readings (see the scanner notes below).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Zustand, PWA (vite-plugin-pwa), IndexedDB offline queue |
| Backend | Spring Boot 3.5, Java 21, Spring Data JPA, Spring Security (Supabase JWKS) |
| AI microservice | Python FastAPI, Pydantic v2, onnxruntime, MediaPipe |
| AI providers | near.ai (optional), then Hugging Face models (Whisper for speech, Sarvam-30B for text, IndicTrans2 for translation), then Gemini and Groq |
| Database and Auth | Supabase PostgreSQL with row-level security. Supabase Auth: phone OTP for ASHA workers, email and password for admins |
| NGO automation | Google Forms and Apps Script webhook, Gmail SMTP |
| Maps | Google Maps JavaScript API |
| Hosting and CI/CD | Azure Static Web Apps, App Service and Container Apps; GitHub Actions |

# Implementation Overview

1. **Stack.** A React 19 PWA (Vite, Tailwind CSS, Zustand), a Spring Boot 3 backend on Java 21 as the only write path, a Python FastAPI AI service, and Supabase PostgreSQL with row-level security.

2. **AI layer.** Speech-to-text, text reasoning and translation each use a chain of providers. The chain tries near.ai only if a key is set, then Hugging Face models, then Gemini or Groq. Register OCR and the malnutrition report use Gemini for vision. For critical outputs, two providers are compared, and a disagreement goes to a supervisor for review.

3. **Language.** Marathi, Hindi and English across the UI, voice dictation, survey translation and the conversational agent (browser voice activity detection and on-device text-to-speech).

4. **Offline.** A service worker and an IndexedDB write queue keep every module working without a connection. Queued writes replay on reconnect, and the sync status is visible.

5. **Risk engine.** A weighted formula, not an AI call, scores every child from 0 to 100. A SAM case is forced to CRITICAL. A separate uplift applies when a sibling has a SAM or MAM record.

6. **Security.** JWTs are checked against Supabase's signing keys (JWKS). Row-level security policies protect the database. Aadhaar and ABHA fields use AES-256-GCM, and Aadhaar OCR runs only on the device. The phone-number check has a rate limiter. Logs contain no personal health data. The design follows the principles of the DPDP Act.

7. **Supervisor portal.** An `/admin` area with a dashboard, worker management, NRC referrals, a care loop view, NGO management, pending review, a no-code Survey Builder, a coverage map and reports. Closing a referral takes a supervisor and an evidence note.

8. **User research.** Interviews with practising ASHA workers and photographs of their paper registers set the architecture and feature priorities.

9. **NGO integration.** Google Forms and Apps Script webhooks let NGOs register and ask for appointment changes. The backend queues them for admin approval, books visits and sends Gmail SMTP notifications with reschedule links.

10. **Cost.** Azure Static Web Apps, App Service F1, Container Apps with scale to zero, and the Supabase free tier. The platform runs at no cost for demos and pilots.

## Resources & References

### ASHA Worker Domain Research
These sources shaped the data model, the module list and the feature priorities.

- [About ASHA, National Health Mission](https://nhm.gov.in/index1.php?lang=1&level=1&sublinkid=150&lid=226): the official role, selection criteria and responsibilities.
- [Guidelines on Accredited Social Health Activists (ASHA), NHM PDF](https://nhm.gov.in/images/pdf/communitisation/task-group-reports/guidelines-on-asha.pdf): the government guideline on ASHA tasks, training and incentives.
- [ASHA Scheme, NHM Maharashtra](https://nhm.maharashtra.gov.in/en/scheme/accredited-social-health-activist-asha/): how the scheme runs in Maharashtra, including the programmes ASHAs support (immunisation, NCD, HBNC and HBYC).
- [ANMOL App, RCH Portal, NHM Maharashtra](https://nhm.maharashtra.gov.in/en/scheme/reproductive-child-health-rch-portal/): the government's digital health app for ANM and ASHA workers. AshaAI is meant to complement it with an offline-first design.
- [Reimagining Maternal Health Record Keeping for ASHA Workers, a UX case study](https://medium.com/@surbhisardana/reimagining-maternal-health-record-keeping-for-asha-workers-1113551866b0): documents the problem of more than 10 paper registers plus ANMOL, which motivated our offline, voice-first design.
- [Knowledge of ASHAs in India, a systematic review (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11724453/): a peer-reviewed summary of ASHA training gaps across India, 2005 to 2022.

### Malnutrition and Nutrition Standards
- [WHO Child Growth Standards and identification of SAM (NCBI Bookshelf)](https://www.ncbi.nlm.nih.gov/books/NBK200776/): defines the MUAC cut-off below 115 mm for SAM and the weight-for-height criteria. AshaAI uses 115 mm for SAM and 125 mm for MAM.
- [Community-Based Management of Acute Malnutrition, FHI360 Module 2](https://www.fhi360.org/wp-content/uploads/2012/12/CMAM_Training_Mod2_ENGLISH_Nov2008.pdf): clinical signs of SAM and MAM, including bilateral pitting oedema and the MUAC bands.
- [Mission Poshan 2.0 / Saksham Anganwadi, Ministry of Women and Child Development](https://wcd.gov.in/offerings/nutrition-mission-saksham-anganwadi-and-poshan-2-0-mission-saksham-anganwadi-poshan-2-0): the national nutrition and NRC referral framework our referral flow follows.

### Scanner Notes and Validation
- **Arm measurement.** In `ai-service/services/gemini_service.py`, the camera measurement takes the pixel distance between the MediaPipe elbow and wrist landmarks as a stand-in for arm size. This is not mid-upper-arm circumference as measured with a Shakir tape, so the app shows it as "Estimated MUAC (confirm with tape)" with a screening disclaimer.
- **Reference coin.** The same file sets the reference coin diameter to 25.0 mm, with a comment calling it a 1 rupee coin. The on-screen guide asks for a ₹5 coin. We have not changed the number, and we list the mismatch here so reviewers know about it.
- **Validation script.** [`scripts/validate_muac.py`](scripts/validate_muac.py) and the sample file [`scripts/sample_muac_validation.csv`](scripts/sample_muac_validation.csv) compare app readings with tape readings. The script reports mean absolute error, bias, Bland-Altman 95% limits of agreement, and sensitivity and specificity for SAM. The sample rows only show the file format.
- **Status.** The scanner has not been validated against clinician measurements. It is a screening aid, not a diagnosis.

### Platform and AI Documentation
- [Spring Boot reference](https://docs.spring.io/spring-boot/index.html): backend framework
- [Supabase documentation](https://supabase.com/docs): Postgres, Auth, row-level security, Storage
- [FastAPI documentation](https://fastapi.tiangolo.com/): AI microservice
- [ONNX Runtime](https://onnxruntime.ai/docs/): CPU inference for the malnutrition classifier
- [MediaPipe Tasks](https://ai.google.dev/edge/mediapipe/solutions/guide): pose landmarks for the arm measurement
- [Hugging Face, AI4Bharat](https://huggingface.co/ai4bharat): open models for Indian languages, including IndicTrans2
- [Hugging Face, Sarvam AI](https://huggingface.co/sarvamai): open-weight Sarvam models
- [Gemini API documentation](https://ai.google.dev/gemini-api/docs): vision and final fallback provider
- [Google Maps Platform, Maps JavaScript API](https://developers.google.com/maps/documentation/javascript): coverage map
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/): service worker and PWA manifest

### Hosting and CI/CD
- [Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/): frontend hosting
- [Azure App Service](https://learn.microsoft.com/azure/app-service/): backend hosting
- [Azure Container Apps](https://learn.microsoft.com/azure/container-apps/): AI microservice hosting
- [GitHub Actions](https://docs.github.com/actions): CI/CD workflows

### Data Privacy and Compliance (India)
- [Digital Personal Data Protection Act, 2023, official text (MeitY)](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf): the basis for our consent, minimisation and retention design.
- [DPDP Rules 2025, PIB press release](https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=156054&ModuleId=3&reg=3&lang=2): the core principles of consent, purpose limitation and data minimisation.

### NGO Integration: Forms and Automation
- [Apps Script, installable triggers (onFormSubmit)](https://developers.google.com/apps-script/guides/triggers/installable): the trigger behind the NGO registration webhook.
- [Apps Script, UrlFetchApp](https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app): used to POST form submissions to the backend's `/api/ngo/form-submission` endpoint.

# Hi, We are Team Asha Vaani

## Contributors

We are two Computer Engineering students at [Maharashtra Institute of Technology](https://www.linkedin.com/school/mit-csn/posts/?feedView=all), Chhatrapati Sambhajinagar, Maharashtra.

| [Rohan Gangawane](https://www.linkedin.com/in/rohan-gangawane/) | [Akshay Chaudhari](https://www.linkedin.com/in/akshay-chaudhari-31b4b4264/) |
| -------------------------------------- | ---------------------------------- |
| <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1782743962/1769608412988_tun4ta.png" width="300"> | <img src="https://res.cloudinary.com/drb4gctam/image/upload/v1782743949/1764447703320_wwkboz.png" width="300"> |
| Team Lead / Full-Stack & AI | Frontend Dev / Researcher |

Asha Vaani aims to take paperwork off ASHA workers and bring early risk scoring and coordinated child welfare support to the villages that need them.
