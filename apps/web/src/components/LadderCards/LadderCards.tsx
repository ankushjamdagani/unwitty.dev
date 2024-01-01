import Image from "next/image";

import "./LadderCards.styles.css";

export type LadderCardsItem = {
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
export function LadderCards({ list }: { list: LadderCardsItem[] }) {
  return (
    <div className="ladder-cards">
      <ul>
        {list.map((image) => (
          <li key={image.alt}>
            <figure>
              <Image {...image} alt={image.alt} loading="eager" />
              <figcaption>{image.alt}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
