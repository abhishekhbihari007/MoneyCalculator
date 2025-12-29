import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://manageyoursalary.com'
  
  const calculatorRoutes = [
    'in-hand-salary',
    'tax-regime',
    'epf',
    'gratuity',
    'nps',
    'eps',
    'sip',
    'retirement',
    'term-insurance',
    'health-insurance',
    'salary-growth',
    'offer-analyzer',
    'fd',
    'rd',
    'rent-vs-own',
  ]

  const contentRoutes = [
    'about',
    'faq',
    'contact',
    'privacy',
    'terms',
    'blog',
  ]

  const blogPosts = [
    'old-vs-new-tax-regime-2024',
    'epf-vs-nps-which-is-better',
    'how-to-calculate-in-hand-salary',
    'term-insurance-coverage-calculator',
    'sip-investment-guide-2024',
    'retirement-planning-india',
  ]

  const contentRoutesEntries: MetadataRoute.Sitemap = contentRoutes.map(route => {
    const changeFreq: 'daily' | 'monthly' = route === 'blog' ? 'daily' : 'monthly';
    return {
      url: `${baseUrl}/${route}`,
      lastModified: new Date(),
      changeFrequency: changeFreq,
      priority: route === 'faq' || route === 'about' ? 0.9 : 0.8,
    };
  });

  const calculatorRoutesEntries: MetadataRoute.Sitemap = calculatorRoutes.map(route => ({
    url: `${baseUrl}/calculator/${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const blogPostsEntries: MetadataRoute.Sitemap = blogPosts.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...contentRoutesEntries,
    ...calculatorRoutesEntries,
    ...blogPostsEntries,
  ]

  return routes
}

