'use client';

import React, { Suspense } from 'react';
import Checkout from '../components/Checkout/Checkout';

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading checkout data...</div>}>
            <Checkout />
        </Suspense>
    );
}