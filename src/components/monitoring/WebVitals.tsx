'use client';

import * as Sentry from '@sentry/nextjs';
import { useReportWebVitals } from 'next/web-vitals';

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

const reportWebVitals: ReportWebVitalsCallback = (metric) => {
  const tags = {
    metric: metric.name,
    rating: metric.rating ?? 'unknown',
    navigationType: metric.navigationType ?? 'unknown',
  };

  const sentryWithMetrics = Sentry as typeof Sentry & {
    metrics?: {
      distribution: (
        name: string,
        value: number,
        options?: { unit?: string; tags?: Record<string, string> }
      ) => void;
    };
  };

  if (sentryWithMetrics.metrics?.distribution) {
    sentryWithMetrics.metrics.distribution('web_vital', metric.value, {
      unit: metric.name === 'CLS' ? 'none' : 'millisecond',
      tags,
    });
    return;
  }

  Sentry.addBreadcrumb({
    category: 'web-vitals',
    message: metric.name,
    level: metric.rating === 'poor' ? 'warning' : 'info',
    data: {
      id: metric.id,
      value: metric.value,
      delta: metric.delta,
      ...tags,
    },
  });

  if (metric.rating === 'poor') {
    Sentry.captureMessage(`Poor Web Vital: ${metric.name}`, {
      level: 'warning',
      tags,
      extra: {
        id: metric.id,
        value: metric.value,
        delta: metric.delta,
      },
    });
  }
};

export default function WebVitals() {
  useReportWebVitals(reportWebVitals);
  return null;
}
