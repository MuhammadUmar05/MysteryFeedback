## Mystery Feedback

Mystery Feedback is a full stack anonymous messaging platform built with modern web technologies.
It allows users to create a public profile link and receive anonymous messages securely without exposing their identity.

The project focuses on clean architecture, real world authentication flows and scalable API design.


## Overview

Mystery Feedback enables anyone to share a personal profile link and receive honest anonymous feedback.
Visitors can send messages without logging in.
Profile owners manage messages through a protected dashboard.

## Technology Stack

1. Next.js 14 App Router
1. TypeScript
1. Tailwind CSS
1. ShadCN UI
1. NextAuth Authentication
1. MongoDB with Mongoose
1. Zod validation
1. Axios API client
1. Gemini API based message suggestions


## Application Flow

* Users register and verify their email
* Each user receives a unique public profile link
* Anyone can send anonymous messages using that link
* Users log in to their dashboard
* Users can enable or disable message receiving
* Users can delete messages securely
* AI suggestions help visitors write meaningful feedback