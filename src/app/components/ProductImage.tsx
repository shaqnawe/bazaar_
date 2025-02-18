import Image from 'next/image';

interface ProductImageProps {
    src: string;
    alt?: string;
}

export default function ProductImage({ src, alt = 'Product image' }: ProductImageProps) {
    if (!src) return null; // Prevent rendering if no image is provided

    return (
        <Image
            src={src}
            alt={alt}
            width={150}
            height={150}
            priority // Ensures faster loading
        />
    );
}
