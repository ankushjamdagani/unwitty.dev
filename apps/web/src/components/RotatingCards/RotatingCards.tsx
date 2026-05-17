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
    <ul className="group absolute inset-0">
      {list.map((image) => (
        <li
          key={image.alt}
          className="bg-background rounded border-foreground hover:z-base absolute left-0 right-0 mx-auto aspect-[1/1.5] w-[240px] cursor-pointer p-4 grayscale transition-all duration-[250ms] origin-bottom-left border-2 border-dashed hover:-translate-y-5 hover:grayscale-0
          [&:nth-child(1)]:-translate-x-[10px] [&:nth-child(1)]:translate-y-0 [&:nth-child(1)]:-rotate-[7deg] 
          [&:nth-child(2)]:-translate-x-[5px] [&:nth-child(2)]:-translate-y-[10px] [&:nth-child(2)]:rotate-0 
          [&:nth-child(3)]:translate-x-[5px] [&:nth-child(3)]:-translate-y-[20px] [&:nth-child(3)]:rotate-[6deg]
          group-hover:[&:nth-child(1)]:-translate-x-[10px] group-hover:[&:nth-child(1)]:translate-y-0 group-hover:[&:nth-child(1)]:-rotate-[15deg]
          group-hover:[&:nth-child(2)]:-translate-x-[5px] group-hover:[&:nth-child(2)]:-translate-y-[20px] group-hover:[&:nth-child(2)]:rotate-0
          group-hover:[&:nth-child(3)]:translate-x-[10px] group-hover:[&:nth-child(3)]:-translate-y-[10px] group-hover:[&:nth-child(3)]:rotate-[15deg]"
        >
          <figure className="flex h-full w-full flex-col gap-4">
            <figcaption className="text-center font-bold">{image.alt}</figcaption>
            <Image
              {...image}
              alt={image.alt}
              className="bg-background flex-1 rounded border-b-2 object-cover w-full"
            />
          </figure>
        </li>
      ))}
    </ul>
  );
}
