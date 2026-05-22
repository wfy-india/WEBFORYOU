import React from 'react';

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
      "name": "WebForYou",
      "url": "https://www.wfy.co.in",
      "logo": "https://www.wfy.co.in/logo.jpeg",
      "description": "Premium web development agency building high-conversion, trust-focused websites.",
    "sameAs": [
      "https://twitter.com/webforyou",
      "https://linkedin.com/company/webforyou"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+918106532307",
      "contactType": "customer service",
      "url": "https://wa.me/918106532307"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "WebForYou",
"url": "https://www.wfy.co.in",
"potentialAction": {
"@type": "SearchAction",
"target": "https://www.wfy.co.in/search?q={search_term_string}",
"query-input": "required name=search_term_string"
}
};

return (
<script
type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
);
}

export function BreadcrumbSchema({ items }: { items: { name: string, item: string }[] }) {
const schema = {
"@context": "https://schema.org",
"@type": "BreadcrumbList",
"itemListElement": items.map((item, index) => ({
"@type": "ListItem",
"position": index + 1,
"name": item.name,
"item": `https://www.wfy.co.in${item.item}`
}))
};

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: { question: string, answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
