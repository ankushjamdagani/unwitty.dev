import Image from "next/image";

export type RotatingCardsItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * @todo
 * - Support styles for dynamic images
 *
 */
export function RotatingCards({ list }: { list: RotatingCardsItem[] }) {
  return (
    <ul className="rotating-cards">
      {list.map((image) => (
        <li key={image.alt}>
          <figure>
            <figcaption>{image.alt}</figcaption>
            <Image {...image} alt={image.alt} />
          </figure>
        </li>
      ))}
    </ul>
  );
}
