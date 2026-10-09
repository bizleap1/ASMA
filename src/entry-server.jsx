import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { blogPosts } from './blogData.js';
import { serviceData } from './data.jsx';
import { ALL_EXISTING_PUBLIC_ROUTES, APPROVED_INDEXABLE_ROUTES } from './routes/routeManifest.js';

export { ALL_EXISTING_PUBLIC_ROUTES, APPROVED_INDEXABLE_ROUTES };

export function render(url) {
  const helmetContext = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </StaticRouter>
    </HelmetProvider>
  );
  return { html, helmet: helmetContext.helmet };
}

export function getMetadata(pathname) {
  // 1. Core Hub & Legal Pages
  if (pathname === '/') {
    return {
      title: 'Stock Market Classes in Nagpur | Advait Stock Market Academy',
      description: 'Learn trading with live-market practice at ASMA, Besa–Pipla Road, Nagpur. Beginner to advanced courses, offline & online batches. Book a free demo.',
      canonical: 'https://www.asmaonline.in/',
      keywords: 'stock market classes in Nagpur, share market institute Nagpur, trading courses Nagpur, ASMA Nagpur, technical analysis classes',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        'name': 'Advait Stock Market Academy',
        'alternateName': 'ASMA',
        'url': 'https://www.asmaonline.in',
        'logo': 'https://www.asmaonline.in/logo-dark.png',
        'description': 'Stock market and trading institute in Nagpur founded by Satish Bobade, offering practical live-market training, technical analysis, and derivatives courses.',
        'founder': {
          '@type': 'Person',
          'name': 'Satish Bobade',
          'jobTitle': 'Founder'
        },
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Plot No. 20, Near Pipla Fata, Besa-Pipla Road',
          'addressLocality': 'Nagpur',
          'addressRegion': 'Maharashtra',
          'postalCode': '440034',
          'addressCountry': 'IN'
        },
        'telephone': '+919156953895'
      }
    };
  }

  if (pathname === '/about') {
    return {
      title: 'About ASMA – Stock Market Trainers in Nagpur',
      description: 'Meet founder Satish Bobade and trainers behind Advait Stock Market Academy, Nagpur — our story, teaching approach and 20+ years of market experience.',
      canonical: 'https://www.asmaonline.in/about',
      keywords: 'about advait academy, stock market experts, trading academy background',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': 'About Advait Stock Market Academy',
        'mainEntity': {
          '@type': 'EducationalOrganization',
          'name': 'Advait Stock Market Academy',
          'founder': {
            '@type': 'Person',
            'name': 'Satish Bobade',
            'jobTitle': 'Founder'
          }
        }
      }
    };
  }

  if (pathname === '/courses') {
    return {
      title: 'Stock Market Courses in Nagpur – Fees & Batches | ASMA',
      description: "Compare ASMA's Advanced Foundation and Professional Master Program: syllabus, duration, fees and upcoming offline and online batches in Nagpur.",
      canonical: 'https://www.asmaonline.in/courses',
      keywords: 'technical analysis course, options trading course, learn stock market'
    };
  }

  if (pathname === '/services') {
    return {
      title: 'Trading & Investment Education Services | ASMA Nagpur',
      description: 'Explore comprehensive trading and investment education services in Nagpur: technical analysis, derivatives, market psychology, and portfolio guidance.',
      canonical: 'https://www.asmaonline.in/services',
      keywords: 'portfolio management, stock advisory, trading services India'
    };
  }

  if (pathname === '/analysis') {
    return {
      title: 'Live Nifty & Sensex Charts and Market News | ASMA',
      description: "Track Nifty, Bank Nifty and Sensex on live charts and read today's market news, curated by Advait Stock Market Academy, Nagpur.",
      canonical: 'https://www.asmaonline.in/analysis'
    };
  }

  if (pathname === '/gallery') {
    return {
      title: 'Trading Floor & Awards Gallery | ASMA Nagpur',
      description: 'Take a look inside Advait Stock Market Academy: live trading floors, computer terminals, faculty mentorship sessions and award ceremonies in Nagpur.',
      canonical: 'https://www.asmaonline.in/gallery'
    };
  }

  if (pathname === '/blog') {
    return {
      title: 'Stock Market Learning Blog | ASMA Nagpur',
      description: 'Practical guides on technical analysis, risk management, F&O and investing from the mentors at Advait Stock Market Academy.',
      canonical: 'https://www.asmaonline.in/blog'
    };
  }

  if (pathname === '/contact') {
    return {
      title: 'Contact ASMA Nagpur – Class Location, Phone & Timings',
      description: 'Visit Advait Stock Market Academy near Pipla Fata, Besa-Pipla Road, Nagpur. Call +91 91569 53895 or send an enquiry to book your free demo session.',
      canonical: 'https://www.asmaonline.in/contact',
      keywords: 'stock market classes near me, trading institute nagpur address, contact ASMA'
    };
  }

  if (pathname === '/privacy') {
    return {
      title: 'Privacy Policy | Advait Stock Market Academy',
      description: 'Privacy policy for Advait Stock Market Academy website visitors and students.',
      canonical: 'https://www.asmaonline.in/privacy'
    };
  }

  if (pathname === '/terms') {
    return {
      title: 'Terms & Conditions | Advait Stock Market Academy',
      description: 'Terms and conditions for enrolling and using Advait Stock Market Academy services.',
      canonical: 'https://www.asmaonline.in/terms'
    };
  }

  // 2. Course details
  if (pathname === '/course/advanced-foundation') {
    return {
      title: 'Beginner Stock Market Course in Nagpur | ASMA',
      description: 'Advanced Foundation: technical analysis, candlesticks, risk management and live-market practice for beginners. Syllabus, duration and fees.',
      canonical: 'https://www.asmaonline.in/course/advanced-foundation',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        'name': 'Advanced Foundation',
        'description': 'Stock market foundation program covering technical analysis, candlesticks, chart patterns and live trading practice.',
        'provider': {
          '@type': 'EducationalOrganization',
          'name': 'Advait Stock Market Academy',
          'sameAs': 'https://www.asmaonline.in'
        }
      }
    };
  }

  if (pathname === '/course/professional-master-program') {
    return {
      title: 'Options Trading Course in Nagpur – Master Program | ASMA',
      description: 'Futures & options, advanced strategies, fundamental analysis and trading psychology. Syllabus, batch dates and fees for ASMA Professional Master Program.',
      canonical: 'https://www.asmaonline.in/course/professional-master-program',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        'name': 'Professional Master Program',
        'description': 'Comprehensive professional trading program covering advanced technicals, futures, options trading, risk management and live floor practice.',
        'provider': {
          '@type': 'EducationalOrganization',
          'name': 'Advait Stock Market Academy',
          'sameAs': 'https://www.asmaonline.in'
        }
      }
    };
  }

  // 3. Blog articles
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '');
    const post = blogPosts.find(p => p.id === slug);
    if (post) {
      return {
        title: `${post.title} | ASMA Nagpur`,
        description: post.excerpt,
        canonical: `https://www.asmaonline.in/blog/${post.id}`,
        image: post.image?.startsWith('http') ? post.image : `https://www.asmaonline.in${post.image}`,
        type: 'article',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': post.title,
          'description': post.excerpt,
          'image': post.image?.startsWith('http') ? post.image : `https://www.asmaonline.in${post.image}`,
          'author': {
            '@type': 'Person',
            'name': post.author?.name || 'ASMA Academy',
            'jobTitle': post.author?.role || 'Trainer'
          },
          'publisher': {
            '@type': 'EducationalOrganization',
            'name': 'Advait Stock Market Academy',
            'url': 'https://www.asmaonline.in',
            'founder': {
              '@type': 'Person',
              'name': 'Satish Bobade',
              'jobTitle': 'Founder'
            }
          }
        }
      };
    }
  }

  // 4. Service details
  if (pathname.startsWith('/service/')) {
    const serviceId = pathname.replace('/service/', '');
    const service = serviceData.find(s => s.id === serviceId);
    if (service) {
      return {
        title: `${service.title} in Nagpur | Advait Stock Market Academy`,
        description: service.desc ? service.desc.slice(0, 160) : 'Professional stock market and financial education services in Nagpur by Advait Stock Market Academy.',
        canonical: `https://www.asmaonline.in/service/${service.id}`,
        image: service.image?.startsWith('http') ? service.image : 'https://www.asmaonline.in/logo-dark.png'
      };
    }
  }

  // Fallback 404
  return {
    title: '404: Page Not Found | ASMA Nagpur',
    description: 'The page you are looking for does not exist on Advait Stock Market Academy.',
    canonical: 'https://www.asmaonline.in/404',
    noindex: true
  };
}
