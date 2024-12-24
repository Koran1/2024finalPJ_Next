import Link from 'next/link';
import React from 'react';

function Page() {
    return (
        <div>
            <h2>Error page here</h2>
            <Link href="/user/login">Go back to login</Link>
        </div>
    );
}

export default Page;