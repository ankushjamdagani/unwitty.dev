import Image from "next/image";

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
    <div className="bg-canvas-contrast rounded border-fg-contrast relative h-full w-full overflow-hidden px-4 border-2 border-dashed after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0 after:bg-gradient-to-t after:from-background after:from-10% after:to-transparent after:z-base before:absolute before:top-0 before:left-0 before:right-0 before:h-0 before:bg-gradient-to-b before:from-background before:from-10% before:to-transparent before:z-base">
      <ul className="animate-[slide_15s_linear_alternate_infinite] hover:[animation-play-state:paused] absolute left-0 right-0 flex flex-col items-center gap-4">
        {list.map((image) => (
          <li
            key={image.alt}
            className="w-full cursor-pointer p-4 themed-filter"
          >
            <figure className="flex h-full w-full flex-col gap-4">
              <Image
                {...image}
                alt={image.alt}
                loading="eager"
                className="bg-canvas-contrast flex-1 rounded border-b-2 object-cover w-full"
              />
              <figcaption>{image.alt}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
