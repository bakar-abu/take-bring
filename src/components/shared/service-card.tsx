"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import type { AppPathname } from "@/config/navigation";

interface ServiceCardProps {
    image: string;
    icon: React.ReactNode;
    category: string;
    title: string;
    href: AppPathname;
}

export function ServiceCard({ image, icon, category, title, href }: ServiceCardProps) {
    const thumbLineRef = useRef<HTMLDivElement>(null);
    const contentOverlayRef = useRef<HTMLDivElement>(null);
    const categorySpanRef = useRef<HTMLSpanElement>(null);
    const categoryLineRef = useRef<HTMLSpanElement>(null);
    const titleLinkRef = useRef<HTMLSpanElement>(null);
    const btnLinkRef = useRef<HTMLSpanElement>(null);
    const btnTriangleRef = useRef<HTMLSpanElement>(null);

    const handleMouseEnter = () => {
        if (thumbLineRef.current) thumbLineRef.current.style.width = '100%';
        if (contentOverlayRef.current) contentOverlayRef.current.style.width = '100%';

        if (categorySpanRef.current) categorySpanRef.current.style.color = '#ffffff';
        if (titleLinkRef.current) titleLinkRef.current.style.color = '#ffffff';
        if (categoryLineRef.current) categoryLineRef.current.style.background = '#ffffff';

        if (btnLinkRef.current) btnLinkRef.current.style.background = '#343432';
        if (btnTriangleRef.current) btnTriangleRef.current.style.background = '#343432';
    };

    const handleMouseLeave = () => {
        if (thumbLineRef.current) thumbLineRef.current.style.width = '0%';

        if (contentOverlayRef.current) {
            contentOverlayRef.current.style.left = '100%';
            contentOverlayRef.current.style.width = '0%';

            setTimeout(() => {
                if (contentOverlayRef.current) {
                    contentOverlayRef.current.style.transition = 'none';
                    contentOverlayRef.current.style.left = '0';

                    setTimeout(() => {
                        if (contentOverlayRef.current) {
                            contentOverlayRef.current.style.transition = '0.5s';
                        }
                    }, 50);
                }
            }, 500);
        }

        if (categorySpanRef.current) categorySpanRef.current.style.color = '#343432';
        if (titleLinkRef.current) titleLinkRef.current.style.color = '#343432';
        if (categoryLineRef.current) categoryLineRef.current.style.background = '#343432';

        if (btnLinkRef.current) btnLinkRef.current.style.background = '#abc629';
        if (btnTriangleRef.current) btnTriangleRef.current.style.background = '#abc629';
    };

    return (
        <Link
            href={href}
            style={{ position: 'relative', display: 'block', width: '100%', textDecoration: 'none' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Service Thumbnail */}
            <div style={{ position: 'relative', zIndex: 1, transition: '0.5s', overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        style={{ objectFit: 'cover', display: 'block' }}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    />
                </div>

                {/* Hover line at bottom */}
                <div
                    ref={thumbLineRef}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '0%',
                        height: '10px',
                        background: '#343432',
                        zIndex: 1,
                        transition: '1s',
                    }}
                />

                {/* Icon with decorative shape background */}
                <div style={{ position: 'absolute', top: '30px', left: '25px', zIndex: 2 }}>
                    {/* Decorative diagonal shape */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '100px',
                            height: '100px',
                            background: '#abc629',
                            opacity: 0,
                            top: '-5px',
                            left: '-5px',
                            transform: 'rotate(45deg)',
                            zIndex: -1,
                        }}
                    />

                    {/* Icon container */}
                    <div
                        style={{
                            background: '#ffffff',
                            width: '200px',
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            left: '-65%',
                            marginTop: '-50px',
                            zIndex: 1,
                            transform: 'rotate(50deg)',
                            padding: '12px',
                        }}
                    >
                        <div
                            style={{
                                transform: 'rotate(-50deg) scale(2)',
                                marginTop: '-100px',
                                marginLeft: '100px',
                            }}
                        >
                            {icon}
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Content Box */}
            <div
                style={{
                    background: '#ffffff',
                    padding: '21px 40px 52px',
                    filter: 'drop-shadow(0px 1px 20px rgba(109,109,109,0.11))',
                    position: 'relative',
                    left: '25px',
                    bottom: '50px',
                    width: '89%',
                    borderLeft: '5px solid #343432',
                    zIndex: 1,
                }}
            >
                {/* Background overlay - slides from left to right */}
                <div
                    ref={contentOverlayRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        background: '#343432',
                        width: '0%',
                        height: '100%',
                        transition: '0.5s',
                        zIndex: -1,
                    }}
                />

                {/* Category label with line */}
                <span
                    ref={categorySpanRef}
                    style={{
                        fontSize: '18px',
                        color: '#343432',
                        fontWeight: 500,
                        position: 'relative',
                        left: '46px',
                        display: 'inline-block',
                        transition: '0.5s',
                    }}
                >
                    <span
                        ref={categoryLineRef}
                        style={{
                            position: 'absolute',
                            top: '12px',
                            left: '-46px',
                            width: '34px',
                            height: '2px',
                            background: '#abc629',
                            transition: '0.5s',
                            display: 'block',
                        }}
                    />
                    {category}
                </span>

                {/* Title */}
                <h2 style={{ margin: '18px 0 0 0', padding: 0 }}>
                    <span
                        ref={titleLinkRef}
                        style={{
                            fontSize: '24px',
                            color: '#343432',
                            fontWeight: 500,
                            display: 'inline-block',
                            transition: '0.5s',
                            textDecoration: 'none',
                            lineHeight: 1.2,
                        }}
                    >
                        {title}
                    </span>
                </h2>

                {/* Arrow Button */}
                <div style={{ position: 'absolute', right: 0, bottom: '-27px', zIndex: 1 }}>
                    <span
                        ref={btnLinkRef}
                        style={{
                            display: 'inline-block',
                            padding: '12px 29px',
                            background: '#abc629',
                            color: '#ffffff',
                            fontSize: '30px',
                            position: 'relative',
                            transition: '0.5s',
                            textDecoration: 'none',
                            lineHeight: 1,
                        }}
                    >
                        <ArrowRight style={{ display: 'inline-block' }} strokeWidth={2} />
                        {/* Triangle shape pointing left */}
                        <span
                            ref={btnTriangleRef}
                            style={{
                                position: 'absolute',
                                top: '25px',
                                right: '80px',
                                background: '#abc629',
                                width: '32px',
                                height: '29px',
                                zIndex: 1,
                                clipPath: 'polygon(0 0, 100% 0%, 100% 100%)',
                                transition: '0.5s',
                            }}
                        />
                    </span>
                </div>
            </div>
        </Link>
    );
}

