// Copied from the live app (book.tripket.ph): FAQs, Privacy Policy, Terms of Service — full text. Legal strings contain trusted inline HTML (<strong>, one mailto link).

export type FaqSection = { title: string; items: { q: string; a: string }[] }
export const FAQS: Record<'passengers' | 'partners', FaqSection[]> = {
  "passengers": [
    {
      "title": "Booking Process",
      "items": [
        {
          "q": "How to book tickets online?",
          "a": "On the Tripket PH web app, choose your origin, your destination and your travel date, then book an available trip and complete payment online. Your booked trip and ticket details then appear in My Tickets. The Tripket PH mobile app is coming soon."
        },
        {
          "q": "What information do I need to provide while booking?",
          "a": "You must provide accurate personal information including your full name, contact details, and a valid ID type. Ensure all information is correct to avoid issues with your booking."
        },
        {
          "q": "Can I book tickets for someone else?",
          "a": "Yes, you can book tickets for someone else using your account, provided you enter precise and correct information. The booked trip and its ticket details stay available in My Tickets on the booking account."
        },
        {
          "q": "How can I get discounts?",
          "a": "Discounts are available for students with valid school IDs, senior citizens, and children. Select the correct passenger type during booking and present the required identification when boarding."
        },
        {
          "q": "How far in advance can I book tickets?",
          "a": "It depends on the shipping line. Each operator sets its own booking window and its own cut-off for last-minute bookings, so how early you can reserve and how close to departure you can still book varies by route. Search your route and travel date and the app will show the trips currently open for booking."
        }
      ]
    },
    {
      "title": "Payment & Tickets",
      "items": [
        {
          "q": "How will I receive my ticket after booking?",
          "a": "After a successful booking, a confirmation is emailed to the address on the booking, and your booked trip and ticket details are also available in My Tickets."
        },
        {
          "q": "Are there additional fees for booking online?",
          "a": "Yes, a convenience fee applies to cover administrative and processing costs. This will be shown as a separate line item during checkout before you confirm your booking."
        },
        {
          "q": "Can I print my ticket or show it on my phone?",
          "a": "You may either print your ticket or display it on your mobile device — as long as you have a valid and paid ticket."
        },
        {
          "q": "Can I get a refund if I cancel?",
          "a": "If you cancel due to personal reasons, an 8% deduction applies to cover transaction fees. If the trip is cancelled by the shipping line due to weather or operational reasons, you are entitled to a full refund or free rebooking."
        },
        {
          "q": "How long does a refund take?",
          "a": "Refund processing typically takes 5–10 business days depending on your payment method. GCash and PayMaya refunds may be faster than card refunds."
        }
      ]
    },
    {
      "title": "Booking Issues & Support",
      "items": [
        {
          "q": "What happens if I miss my departure?",
          "a": "If you miss your scheduled departure, your ticket may be used for future travel. However, priority rescheduling may not be guaranteed. Contact our support team for assistance."
        },
        {
          "q": "What should I do if I made a mistake while booking?",
          "a": "If you notice an error before completing payment, restart the booking process and re-enter the correct information. Double-check all details before confirming to avoid complications."
        },
        {
          "q": "How can I check the status of my booking?",
          "a": "Open My Tickets to view your booked trips and ticket details."
        },
        {
          "q": "What should I do if I encounter technical issues?",
          "a": "If you experience technical issues during booking, contact our technical support team for prompt assistance and resolution."
        },
        {
          "q": "What ID do I need when boarding?",
          "a": "Present a valid government-issued ID along with your e-ticket (printed or digital) when boarding. Minors must also present a copy of their birth certificate."
        }
      ]
    }
  ],
  "partners": [
    {
      "title": "Dashboard Information",
      "items": [
        {
          "q": "What information is displayed on the dashboard?",
          "a": "The dashboard provides a concise summary of weekly sales, passengers, tickets, users, and vehicles. It offers insights into revenue, customer demand, ticket volume, user growth, and transportation resource utilization."
        },
        {
          "q": "How often is the dashboard updated?",
          "a": "The dashboard is updated in real-time, ensuring that the displayed information continuously reflects the most current data available. This enables immediate responsiveness to changes in sales, passengers, and ticket availability."
        }
      ]
    },
    {
      "title": "Payments & Verification",
      "items": [
        {
          "q": "How do we receive payouts?",
          "a": "Payments collected through Tripket PH are settled to your designated bank account on a weekly payout schedule. Our team will provide full details during onboarding."
        },
        {
          "q": "How do we verify tickets?",
          "a": "Ticket verification is facilitated through the conductor scanner app. Scan the ticket barcode or QR code to instantly authenticate it by cross-referencing with the ticketing system database."
        }
      ]
    },
    {
      "title": "Platform & Operations",
      "items": [
        {
          "q": "Can I manage multiple vessels and routes?",
          "a": "Yes. The Tripket PH client portal allows you to manage multiple vessels, routes, and schedules from a single dashboard."
        },
        {
          "q": "Can I update schedules in real time?",
          "a": "Yes. You can update departure schedules, seat availability, and fares in real time through the client management portal."
        }
      ]
    },
    {
      "title": "Data & Reporting",
      "items": [
        {
          "q": "Can I filter or customize the data displayed?",
          "a": "Yes. You can apply filters based on date, schedule, and route to narrow down the information presented and focus on the data most relevant to your analysis."
        },
        {
          "q": "Is there a way to export the data?",
          "a": "Yes. The dashboard supports exporting data in Excel format. You can also export the customer manifest and print data directly from the dashboard."
        },
        {
          "q": "How can I generate reports based on dashboard data?",
          "a": "Use the date filters to narrow your data to a specific time range, then extract and analyze it to generate comprehensive reports or summaries."
        },
        {
          "q": "Can I view historical data or trends?",
          "a": "Yes. The dashboard provides the capability to view historical data and track trends over time across sales, bookings, customer behavior, and other relevant metrics."
        }
      ]
    },
    {
      "title": "Support & Security",
      "items": [
        {
          "q": "What support is available for shipping line clients?",
          "a": "We provide dedicated account management, technical support, and onboarding assistance for all our shipping line partners. Our support team is available to help with any inquiries or issues related to the dashboard."
        },
        {
          "q": "Are there security measures to protect dashboard data?",
          "a": "Yes. User-level permissions are implemented to restrict dashboard access to authorized users only. Each user is assigned a specific permission level, ensuring they can only access data and actions relevant to their role."
        },
        {
          "q": "What should I do if I notice discrepancies on the dashboard?",
          "a": "First verify your internet connection is stable. If the issue persists, contact our technical support team who will help identify and rectify any data discrepancies."
        }
      ]
    },
    {
      "title": "Partnerships",
      "items": [
        {
          "q": "How do I partner with Tripket PH?",
          "a": "Visit our Partners page or contact us at support@tripketph.com to express your interest. Our team will walk you through the onboarding process for your shipping line."
        },
        {
          "q": "What does it cost to list my shipping line?",
          "a": "We offer flexible partnership arrangements. Contact our team to discuss a plan that fits your business size and booking volume."
        }
      ]
    }
  ]
}

export type LegalBlock = { p: string } | { ul: 'disc' | 'alpha'; items: string[] }
export type LegalSection = { title: string; blocks: LegalBlock[] }
export const PRIVACY: LegalSection[] = [
  {
    "title": "Introduction",
    "blocks": [
      {
        "p": "Tripket PH (referred to as \"we,\" \"our,\" or \"us\") is dedicated to safeguarding your privacy. This Privacy Policy explains how we collect, use, and disclose your personal information. This Privacy Policy is applicable to our website, https://TripketPH.com, and its associated subdomains (collectively, our \"Services\") in addition to our application, Tripket PH. By accessing or using our Services, you acknowledge that you have read, comprehended, and agreed to the collection, storage, use, and disclosure of your personal information, as described in this Privacy Policy and our Terms of Service."
      },
      {
        "p": "Please note that once a ticket’s status is marked as \"used,\" it can no longer be refunded."
      }
    ]
  },
  {
    "title": "Definitions and key terms",
    "blocks": [
      {
        "p": "To ensure clarity in this Privacy Policy, the following terms have been strictly defined:"
      },
      {
        "ul": "disc",
        "items": [
          "<strong class=\"text-slate-700\">Cookie:</strong> A small piece of data created by a website and stored by your web browser. Its purpose is to identify your browser, analyze your behavior on the website, and retain your preferences, such as language selection or login credentials.",
          "<strong class=\"text-slate-700\">Company:</strong> Refers to Tripket PH, located at 2nd floor, Mats Place, Hibbard Avenue, Piapi, Dumaguete City, Philippines.",
          "<strong class=\"text-slate-700\">Country:</strong> Refers to the Philippines, where Tripket PH or its owners/founders are located.",
          "<strong class=\"text-slate-700\">Customer:</strong> The individual, organization or company that registers to use the Tripket PH Service.",
          "<strong class=\"text-slate-700\">Device:</strong> Any device that connects to the internet, such as a computer, phone, or tablet.",
          "<strong class=\"text-slate-700\">IP address:</strong> A unique number assigned to every device that connects to the internet.",
          "<strong class=\"text-slate-700\">Personnel:</strong> Individuals who are either employed by Tripket PH or have a contract to provide services on behalf of the company.",
          "<strong class=\"text-slate-700\">Personal Data:</strong> Any information that directly or indirectly allows the identification of a natural person.",
          "<strong class=\"text-slate-700\">Service:</strong> The service provided by Tripket PH as described on the website and in the relevant terms and conditions.",
          "<strong class=\"text-slate-700\">Third-Party Service:</strong> Any content, product or service provided by advertisers, promotional partners, or other third parties.",
          "<strong class=\"text-slate-700\">Website:</strong> The Tripket PH website accessible at https://TripketPH.com.",
          "<strong class=\"text-slate-700\">You:</strong> Any person or entity that registers with Tripket PH to use its services."
        ]
      }
    ]
  },
  {
    "title": "How do we use the information we collect?",
    "blocks": [
      {
        "p": "We collect various types of information from our customers, including their name, username, phone numbers, email address, billing address, debit/credit card number or other payment methods, age, password, and vehicle details. We use this information for several purposes such as personalizing the customer experience, improving our services, and enhancing customer service. Additionally, we use the information to process transactions, administer contests or promotions, conduct surveys, and send periodic emails."
      }
    ]
  },
  {
    "title": "When do we use customer information for third parties?",
    "blocks": [
      {
        "p": "Sometimes, we may share customer information with third parties such as automated fraud detection services. We also collect information that is publicly available on social media websites. Customers can control the amount of information they share on these platforms by changing their service privacy settings."
      }
    ]
  },
  {
    "title": "Do we share the information we collect with third parties?",
    "blocks": [
      {
        "p": "We may share the personal and non-personal information we collect with third parties, such as advertisers, promotional partners, and other content providers, who we believe may be of interest to you. We may also share it with our affiliated companies and business partners, and if we undergo a merger or asset sale, we may transfer your information to our successors."
      },
      {
        "p": "We may use trusted third-party service providers for functions such as hosting and maintaining our servers, email management, credit card processing, and customer service. We may share your personal information with these third parties to enable them to provide their services."
      },
      {
        "p": "We may share portions of our log file data, including IP addresses, with third parties for analytics purposes, such as web analytics partners, application developers, and ad networks. We may also disclose personal and non-personal information about you to government or law enforcement officials or private parties as required by law."
      }
    ]
  },
  {
    "title": "Where and when is information collected?",
    "blocks": [
      {
        "p": "We collect personal information from you when you provide it to us. Additionally, we may receive personal information about you from third parties, as described earlier."
      }
    ]
  },
  {
    "title": "How do we use your email address?",
    "blocks": [
      {
        "p": "By giving us your email address, you agree to receive emails from us. You can opt-out of these email lists at any time by clicking on the opt-out link included in the respective email. We do not send unsolicited commercial emails. By providing your email address, you also permit us to use it for customer audience targeting on platforms like Facebook, where we show customized advertising to specific individuals who have opted-in to receive communication from us."
      }
    ]
  },
  {
    "title": "Could my information be transferred to other countries?",
    "blocks": [
      {
        "p": "As a Philippine-based company, the information we collect through our website, direct interactions with you, or help services may be transferred to our offices or personnel, or third parties, located worldwide. By using our services, you voluntarily consent to the transfer and hosting of your information across borders, to the fullest extent permitted by applicable law."
      }
    ]
  },
  {
    "title": "Is the information collected through our service secure?",
    "blocks": [
      {
        "p": "We take appropriate measures to ensure the security and protection of your information. We employ physical, electronic, and managerial safeguards to prevent unauthorized access, maintain data security, and ensure the proper use of your information. However, we cannot guarantee that our security measures will be completely foolproof."
      }
    ]
  },
  {
    "title": "Can I update or correct my information?",
    "blocks": [
      {
        "p": "You have the right to restrict the usage and disclosure of personally identifiable information. If you want to update, correct, change or delete your personally identifiable information, you can contact us. We may take reasonable steps to verify your identity before granting access to your profile or making any corrections to protect your privacy and security."
      }
    ]
  },
  {
    "title": "How long do we keep your information?",
    "blocks": [
      {
        "p": "We retain your information for the period necessary to fulfill the purposes for which we collected it and to provide you with our services. Once we no longer need your information and have no legal or regulatory obligation to keep it, we will either delete it from our system or anonymize it."
      }
    ]
  },
  {
    "title": "How do we protect your information?",
    "blocks": [
      {
        "p": "To ensure the safety of your personal information, we use a secure server and Secure Socket Layer (SSL) technology to encrypt and transmit sensitive information. Access to this information is only given to authorized personnel who are required to keep the information confidential."
      }
    ]
  },
  {
    "title": "Governing law",
    "blocks": [
      {
        "p": "This Agreement and your use of our service are subject to the laws of the Philippines, without taking into account any conflicts of law rules."
      }
    ]
  },
  {
    "title": "Your consent",
    "blocks": [
      {
        "p": "If you use our service, create an account, or buy something from us, you agree to this Privacy Policy."
      }
    ]
  },
  {
    "title": "Links to other websites",
    "blocks": [
      {
        "p": "This Privacy Policy pertains solely to our Services. When you click on a link to leave our Services and visit another website, our Privacy Policy no longer applies. Third-party websites may use their own cookies or other methods to collect information about you."
      }
    ]
  },
  {
    "title": "Cookies",
    "blocks": [
      {
        "p": "We use \"Cookies\" to recognize which parts of our website you have visited. A cookie is a small data file that your web browser stores on your computer or mobile device. We use Cookies to customize the content that you see on our website. We do not place any Personally Identifiable Information in Cookies."
      }
    ]
  },
  {
    "title": "Children's privacy",
    "blocks": [
      {
        "p": "Our service is not intended for individuals under the age of 13, and we do not knowingly collect any personal information from anyone under the age of 13. If you are a parent or guardian and are aware that your child has provided us with personal data, please contact us immediately."
      }
    ]
  },
  {
    "title": "Changes to our Privacy Policy",
    "blocks": [
      {
        "p": "In the event that we make any changes to our Privacy Policy, we will update the modification date and post the updated policy on this page."
      }
    ]
  },
  {
    "title": "Contact us",
    "blocks": [
      {
        "p": "Please feel free to reach out to us if you have any inquiries or concerns. You can contact us via email at <a href=\"mailto:support@tripketph.com\" class=\"text-orange-500 hover:underline\">support@tripketph.com</a>."
      }
    ]
  }
]

export const TERMS: LegalSection[] = [
  {
    "title": "1. Introduction",
    "blocks": [
      {
        "p": "Welcome to our online application. These Terms of Use (\"Terms\") are a legal agreement between you and our company regarding your use of this app (Tripket). By accessing or using this app, you agree to be bound by these Terms. If you disagree with any of these Terms or do not agree to abide by them, please do not use this app."
      },
      {
        "p": "You agree not to use this site for any unlawful or fraudulent purposes, and you agree to comply with all applicable laws and regulations. You further agree not to engage in any activities that may harm or interfere with the operation of this site or any related servers or networks."
      },
      {
        "p": "You agree to indemnify and hold harmless the owner and operators of this site, as well as any related affiliates, contractors, agents, and employees, from any third-party claims, damages, or expenses arising out of or relating to your use of this site."
      },
      {
        "p": "The owner and operators of this site reserve the right to terminate or suspend your account at any time, without notice, if you violate these terms and conditions."
      }
    ]
  },
  {
    "title": "2. User conduct",
    "blocks": [
      {
        "p": "You are solely responsible for the content you upload to or share through the app. You agree not to use the app in a way that:"
      },
      {
        "ul": "alpha",
        "items": [
          "Is illegal or promotes illegal activities.",
          "Harms, threatens or otherwise offends other users.",
          "Duplicates, licenses, sells or exploits any part of the app for any commercial purpose without our prior consent.",
          "Impersonates or misrepresents your relationship with any person, organization or authority.",
          "Collects user data or violates our users' privacy in any way."
        ]
      }
    ]
  },
  {
    "title": "3. Fares and general information",
    "blocks": [
      {
        "p": "The cost of a trip is influenced by several factors, including the number of passengers, the route, dates, and times of travel. Clients must adhere to the booking specifications and accommodations, including travel dates and times, or they may be denied travel, face additional fees, or lose any special rates."
      },
      {
        "p": "Vehicle and passenger space on board are subject to availability and may not always be guaranteed. Special terms apply to promotional tickets, and fees may be charged for unused sections of the itinerary. Advertised fares may be adjusted by us or the operator due to various reasons, including changes in currency exchange rates, oil prices, or legal requirements."
      }
    ]
  },
  {
    "title": "4. Departure schedules",
    "blocks": [
      {
        "p": "The departure and arrival timings provided in your booking confirmation are the best estimates of the operator and are given in local times. It is recommended that you verify with the operator for any changes before starting your travel. Sailing schedules may be modified, postponed, or cancelled due to bad weather, tidal conditions, or other situations."
      },
      {
        "p": "The operator may also need to use other ships or change departure or arrival locations for operational, technical, or scheduling reasons. We are not responsible for any expenses or inconvenience caused by these situations, but we will try to inform you if possible, using the contact information you provided during booking."
      }
    ]
  },
  {
    "title": "5. Animals",
    "blocks": [
      {
        "p": "Transportation of animals is allowed only if the customer informs us in advance while making the reservation, and the transportation must comply with the Operator's criteria and applicable legislative requirements. There may be an additional fee and additional restrictions for animal transportation. You are responsible for obtaining all necessary paperwork, permissions, and licenses."
      }
    ]
  },
  {
    "title": "6. Freight and commercial passenger vehicles",
    "blocks": [
      {
        "p": "There are special terms and fees for the transportation of freight and commercial passenger vehicles, and the Operator will determine whether a special tariff applies to each case. It is recommended that you contact the shipping company directly at the numbers listed on https://tripketph.com/ for more information on freight tariffs and rates."
      },
      {
        "p": "If a vehicle is booked as a private car but is actually a commercial passenger vehicle, the full tariff will be charged, and the carriage may be refused without any refund."
      }
    ]
  },
  {
    "title": "7. Hazardous materials",
    "blocks": [
      {
        "p": "The Company and the Operator do not accept bookings for cars carrying dangerous or hazardous products, including LPG-powered vehicles under certain conditions. Carriage may be refused without a refund if you try to transport such products."
      }
    ]
  },
  {
    "title": "8. Confirmation and payment",
    "blocks": [
      {
        "p": "To receive a confirmation for your reservation, you must pay the full amount at the time of booking, unless you have an established credit account with us. After you make a booking and complete full payment for all clients included in the booking, we will provide a confirmation advice note that includes information about your reservation."
      },
      {
        "p": "If you haven't received an email confirmation within 24 hours of making the reservation, you should contact our customer support team. A minimal booking fee may be added to the ticket price depending on the type of ticket and number of passengers."
      }
    ]
  },
  {
    "title": "9. Prices",
    "blocks": [
      {
        "p": "The prices displayed on the website for bookings are generally accurate, and will only be changed in the case of obvious errors. While the prices are subject to change, bookings that have already been accepted will not be affected by such changes, unless explicitly stated otherwise."
      }
    ]
  },
  {
    "title": "10. Separability clause",
    "blocks": [
      {
        "p": "If any part of these booking conditions is found to be invalid or unenforceable by a court or other competent authority, that part will be considered void and will not be included in the agreement with you. The remaining clauses will still be valid and enforceable."
      }
    ]
  },
  {
    "title": "11. Service availability",
    "blocks": [
      {
        "p": "Our company makes every effort to ensure the app remains accessible and reliable. However, we do not guarantee the app will be available or error-free at all times. We may discontinue, modify or restrict access to the app without notice at any time, for any reason."
      }
    ]
  },
  {
    "title": "12. Intellectual property",
    "blocks": [
      {
        "p": "All trademarks, logos, copyrights and other intellectual property rights on this app belong to our company or our licensors. You agree not to reproduce or distribute such content without our prior written consent."
      }
    ]
  },
  {
    "title": "13. Disclaimer of warranties and limitation of liability",
    "blocks": [
      {
        "p": "The app is provided \"as-is\" and \"as available\" and we disclaim all warranties, express or implied, including but not limited to those relating to merchantability, fitness for a particular purpose, non-infringement, and to the app’s accuracy, timeliness, and completeness. We shall not be responsible for any damage or loss incurred as a result of using the app."
      }
    ]
  },
  {
    "title": "14. Indemnification",
    "blocks": [
      {
        "p": "You agree to indemnify and hold our company and its affiliates, directors, officers, employees and agents harmless from and against any liability, claim, damage or expense arising from your use of the app or your breach of these Terms."
      }
    ]
  },
  {
    "title": "15. Changes to the Terms",
    "blocks": [
      {
        "p": "We reserve the right to change these Terms at any time without notice to you. Such changes will be effective immediately upon posting on our app. Your continued use of the app constitutes your acceptance of such changes."
      }
    ]
  },
  {
    "title": "16. Governing law",
    "blocks": [
      {
        "p": "These Terms shall be interpreted and enforced under the laws of the Philippines."
      }
    ]
  },
  {
    "title": "17. Dispute resolution",
    "blocks": [
      {
        "p": "If a dispute arises related to these Terms or the use of the app, the parties will first attempt to resolve the dispute in good faith. In the event that negotiations fail, the parties will submit the dispute to binding arbitration as permitted under the laws of the Philippines."
      }
    ]
  },
  {
    "title": "18. Miscellaneous provisions",
    "blocks": [
      {
        "p": "These Terms constitute the entire agreement between you and our company regarding your use of the app. If any provision of these Terms is found to be unenforceable, that provision shall be severed from these Terms and the remaining provisions shall remain in full force and effect."
      }
    ]
  },
  {
    "title": "19. Responsibility",
    "blocks": [
      {
        "p": "You have the responsibility of keeping your account information and password confidential. You must take accountability for all actions taken under your account or password. You confirm your legal age to use this site and accept that you may be liable for any financial obligations resulting from its use."
      }
    ]
  },
  {
    "title": "20. Cancellation",
    "blocks": [
      {
        "p": "If you wish to cancel a booking and get a refund, it must comply with both our booking rules and the terms of the Operator. A cancellation fee will be applied, and additional fees from the Operator may also be charged. Promotional or special offer tickets may be non-refundable."
      }
    ]
  },
  {
    "title": "Conditions: application",
    "blocks": [
      {
        "p": "TRIPKET PH operates as an online ticketing platform that enables customers to purchase tickets online. Our aim is to make sea travel easier and more convenient for our customers by offering a comprehensive booking portal that covers multiple shipping lines."
      }
    ]
  },
  {
    "title": "Conditions: general information",
    "blocks": [
      {
        "p": "Always read the terms and conditions carefully before booking and make sure to understand any fees or restrictions that may apply."
      }
    ]
  },
  {
    "title": "Conditions: payments",
    "blocks": [
      {
        "p": "Options for payment include Paymaya, GrabPay, GCash and possibly Credit/Debit Cards. Discounts or promotions may be available for passengers 9 years old and below, students, and seniors."
      }
    ]
  },
  {
    "title": "Conditions: boarding guidelines",
    "blocks": [
      {
        "ul": "disc",
        "items": [
          "When boarding, be sure to produce a valid ID and a printed copy of your e-ticket.",
          "Please obtain a copy of the child's birth certificate for minors.",
          "Travelers who are pregnant or ill must board the vessel bearing a signed waiver attesting to their fitness to travel by sea and a medical certificate issued no less than five days prior to departure."
        ]
      }
    ]
  },
  {
    "title": "Refunds: cancellation by the shipping line",
    "blocks": [
      {
        "ul": "disc",
        "items": [
          "If a trip is cancelled by the shipping line due to weather or operational reasons, the passenger is entitled to a full refund of the ticket fare and cancellation fees are waived.",
          "Only the ticket fare is refunded. Service fees are non-refundable."
        ]
      }
    ]
  },
  {
    "title": "Refunds: cancellation by the passenger",
    "blocks": [
      {
        "ul": "disc",
        "items": [
          "Passengers who are unable to take their scheduled trip may request cancellation of their booking but are subject to an 8% cancellation fee to cover the transaction fees.",
          "Only the ticket fare is refunded. Service fees are non-refundable.",
          "All cancellation and refund requests are subject to verification and approval."
        ]
      }
    ]
  },
  {
    "title": "Refunds: processing timeline",
    "blocks": [
      {
        "p": "Tripket PH standard processing time is 5-10 business days or longer, depending on the payment provider and circumstances of the transaction. GCash and PayMaya refunds may be faster than card refunds."
      }
    ]
  },
  {
    "title": "Refunds: non-refundable situations",
    "blocks": [
      {
        "p": "Refunds may not be granted for the following circumstances:"
      },
      {
        "ul": "disc",
        "items": [
          "Failure to arrive at the terminal (No Show)",
          "Incorrect passenger information",
          "Invalid or Expired Ticket"
        ]
      }
    ]
  },
  {
    "title": "Refunds: rebooking process",
    "blocks": [
      {
        "p": "Tripket PH does not directly rebook cancelled tickets. If a passenger wishes to travel on a different date:"
      },
      {
        "ul": "disc",
        "items": [
          "The passenger must first request cancellation of the original booking through Tripket PH.",
          "The applicable refund will be processed after the cancellation has been approved.",
          "Once the refund has been processed, the passenger may make a new booking through the Tripket PH app or website."
        ]
      }
    ]
  },
  {
    "title": "Refunds: bookings made on your behalf",
    "blocks": [
      {
        "p": "Tripket PH Admin cannot initiate or process a new booking on behalf of the passenger."
      }
    ]
  },
  {
    "title": "Refunds: important reminders",
    "blocks": [
      {
        "ul": "disc",
        "items": [
          "All cancellation and refund requests are subject to verification and approval.",
          "Shipping line-specific cancellation and refund policies may apply and may take priority over this policy.",
          "A new booking made after cancellation is treated as a separate transaction and is subject to the fare, availability, and applicable fees at the time of booking.",
          "Passengers are responsible for ensuring that their booking details and travel date are correct before completing a booking."
        ]
      }
    ]
  }
]
