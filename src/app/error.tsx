'use client';

import { useEffect } from 'react';

interface ErrorBoundaryProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalErrorBoundary({ error, reset }: ErrorBoundaryProps) {
    useEffect(() => {
        // Log the error securely to an upstream tracking service like Sentry or LogRocket
        console.error('Captured Runtime Exception:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
                {/* Visual indicator (Pizza slice box acting as an alert) */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-2">
                    Oops! Something went wrong
                </h2>

                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    We encountered an unexpected error processing this page view. This might be a temporary database hiccup or connection issue.
                </p>

                <div className="flex flex-col gap-3">
                    {/* Recover button calls Next.js's native segment reset router */}
                    <button
                        onClick={() => reset()}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow-md shadow-red-100"
                    >
                        Try Again
                    </button>

                    <a
                        href="/"
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition duration-200 text-sm block text-center"
                    >
                        Return to Homepage
                    </a>
                </div>
            </div>
        </div>
    );
}