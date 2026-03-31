import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SocialMeta({ 
    title, 
    description, 
    image, 
    url, 
    type = 'website' 
}) {
    const siteUrl = 'https://ancorarportodegalinhas.com';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const defaultImage = `${siteUrl}/images/social-share.jpg`;

    return (
        <Helmet>
            {/* Meta tags padrão */}
            <title>{title} | Ancorar Flat Resort</title>
            <meta name="description" content={description} />
            
            {/* Open Graph (Facebook, LinkedIn) */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="Ancorar Flat Resort" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image || defaultImage} />
        </Helmet>
    );
}