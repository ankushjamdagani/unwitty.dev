import { BsCalendar2Date } from "react-icons/bs";

import { BreadCrumb } from "@/app/_components/Breadcrumb";

import Image from "next/image";

export default function Article() {
  return (
    <main className="-mt-2">
      <section className="h-full max-h-[500px] w-full overflow-hidden">
        <Image
          src="/images/projects/gameboy_tetris.jpeg"
          alt="some text"
          width="1024"
          height="400"
          className="h-full w-full object-cover"
        />
      </section>

      <header className="px-[var(--horizontal-gap)] py-4">
        <BreadCrumb
          options={[
            { path: "/", label: "Home" },
            { path: "/#words", label: "Words" },
            { label: "Current" },
          ]}
        />

        <h1 className="my-8 leading-tight font-bold">
          Beware!! This is going to be a randomly generated blog.
        </h1>

        <ul className="flex items-center gap-8">
          <li className="flex items-center gap-2">
            <Image
              src="/images/projects/gameboy_tetris.jpeg"
              alt="some text"
              width="32"
              height="32"
              className="h-8 w-8 rounded-full"
            />
            <a href="/work/about" className="hover:underline">
              Ankush Jamdagani
            </a>
          </li>

          <li className="flex items-center gap-2">
            <BsCalendar2Date /> <time>{new Date().toDateString()}</time>
          </li>
        </ul>
      </header>

      <section className="px-[var(--horizontal-gap)] py-4 text-[1.2em] leading-[1.75em]">
        <blockquote
          className={`relative italic px-[3em] my-[4em] text-left before:absolute before:left-0 before:top-0 before:text-[4em] before:content-['"']`}
          cite="https://www.huxley.net/bnw/four.html"
        >
          <h3 className="mb-2 mt-4 text-[2em]">TLDR;</h3>
          <p className="mb-6">
            Words can be like X-rays, if you use them properly—they’ll go
            through anything. You read and you’re pierced. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Nisl nunc mi ipsum
            faucibus vitae aliquet. risus nec feugiat in fermentum posuere.
            Neque sodales ut etiam sit. Vulputate eu scelerisque felis imperdiet
            proin fermentum leo vel. Consectetur purus ut faucibus pulvinar
            elementum. Enim sit amet venenatis urna cursus. Porta non pulvinar
            neque laoreet
          </p>
        </blockquote>

        <div className="bg-fg-contrast my-8 h-[1px] w-full opacity-20"></div>

        <p className="mb-6">
          Lorem ipsum dolor sit amet,{" "}
          <code className="bg-fg-contrast text-canvas-contrast rounded px-2 font-mono overflow-auto whitespace-pre [tab-size:4]">
            conse c t et ur
          </code>{" "}
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Nisl nunc mi ipsum faucibus vitae aliquet. risus nec
          feugiat in fermentum posuere. Neque sodales ut etiam sit. Vulputate eu
          scelerisque felis imperdiet proin fermentum leo vel. Consectetur purus
          ut faucibus pulvinar elementum. Enim sit amet venenatis urna cursus.
          Porta non pulvinar neque laoreet suspendisse interdum consectetur.
          Auctor urna nunc id cursus metus aliquam eleifend. Quam
          <a className="border-dashed border-b border-fg-muted bg-accent/20 px-1 mx-1">
            pellentesque
          </a>
          nec nam aliquam sem et tortor consequat id.
        </p>

        <code className="bg-fg-contrast text-canvas-contrast rounded-lg mx-[-2em] my-8 block overflow-auto whitespace-pre px-8 py-4 font-mono [tab-size:4]">
          def test(): print(&quot;this is block code&quot;)
        </code>

        <p className="mb-6">
          Mauris in aliquam sem fringilla ut morbi tincidunt augue interdum.
          Nibh mauris cursus mattis molestie a iaculis at erat. Enim neque
          volutpat ac tincidunt vitae semper quis lectus. Tellus mauris a diam
          maecenas sed enim ut sem. Imperdiet nulla malesuada pellentesque elit
          eget gravida cum. Laoreet id donec ultrices tincidunt arcu non sodales
          neque. Lacus vel facilisis volutpat est velit. Tellus orci ac auctor
          augue. Mattis nunc sed blandit libero
        </p>

        <h2 className="my-4 leading-tight">Some random heading</h2>

        <figure className="mx-[-2em] mb-[1.4em]">
          <Image
            src="/images/projects/gameboy_tetris.jpeg"
            alt="some text"
            width="400"
            height="400"
            className="border-fg-contrast rounded-lg block w-full border-2 border-dashed"
          />
          <figcaption className="text-center text-sm italic">
            An elephant at sunset
          </figcaption>
        </figure>

        <p className="mb-6">
          Mauris in aliquam sem fringilla ut morbi tincidunt augue interdum.
          Nibh mauris cursus mattis molestie a iaculis at erat. Enim neque
          volutpat ac tincidunt vitae semper quis lectus. Tellus mauris a diam
          maecenas sed enim ut sem. Imperdiet nulla malesuada pellentesque elit
          eget gravida cum. Laoreet id donec ultrices tincidunt arcu non sodales
          neque. Lacus vel facilisis volutpat est velit. Tellus orci ac auctor
          augue. Mattis nunc sed blandit libero
        </p>

        <blockquote
          className={`relative italic px-[3em] my-[4em] text-left before:absolute before:left-0 before:top-0 before:text-[4em] before:content-['"']`}
          cite="https://www.huxley.net/bnw/four.html"
        >
          <p className="mb-6">
            Words can be like X-rays, if you use them properly—they’ll go
            through anything. You read and you’re pierced.
          </p>
          <footer>
            —Aldous Huxley, <cite>Brave New World</cite>
          </footer>
        </blockquote>

        <p className="mb-6">
          volutpat sed cras ornare. Amet mattis vulputate enim nulla aliquet
          porttitor lacus luctus. Bibendum ut tristique et egestas quis ipsum
          suspendisse ultrices. Imperdiet sed euismod nisi porta lorem mollis
          aliquam ut porttitor. Eget lorem dolor sed viverra ipsum nunc aliquet
          bibendum enim. Velit sed ullamcorper morbi tincidunt ornare massa.
          Phasellus faucibus scelerisque eleifend donec. Purus sit amet luctus
          venenatis lectus magna fringilla urna porttitor. Tempor nec feugiat
          nisl pretium fusce id. Tortor posuere ac ut consequat semper. Tellus
          in metus vulputate eu scelerisque.
        </p>

        <ul className="mb-6 ml-16 list-inside list-[square] leading-[1.5em]">
          <li className="mb-1">This is a bulleted list</li>
          <li className="mb-1">This is a bulleted list</li>
          <li className="mb-1">This is a bulleted list</li>
          <li className="mb-1">This is a bulleted list</li>
        </ul>

        <p className="mb-6">
          Ut tellus elementum sagittis vitae. Pretium nibh ipsum consequat nisl
          vel pretium lectus. Rhoncus urna neque viverra justo nec ultrices dui.
          Nunc lobortis mattis aliquam faucibus purus in massa tempor. Morbi
          tristique senectus et netus. Id nibh tortor id aliquet. Mattis
          molestie a iaculis at erat. Dictum non consectetur a erat nam at
          lectus. Dolor sit amet cons
        </p>

        <ol className="mb-6 ml-16 list-outside list-[decimal] leading-[1.5em]">
          <li className="mb-1">This is a numbered list</li>
          <li className="mb-1">This is a numbered list</li>
          <li className="mb-1">This is a numbered list</li>
          <li className="mb-1">This is a numbered list</li>
        </ol>

        <p className="mb-6">
          Ut tellus elementum sagittis vitae. Pretium nibh ipsum consequat nisl
          vel pretium lectus. Rhoncus urna neque viverra justo nec ultrices dui.
          Nunc lobortis mattis aliquam faucibus purus in massa tempor. Morbi
          tristique senectus et netus. Id nibh tortor id aliquet. Mattis
          molestie a iaculis at erat. Dictum non consectetur a erat nam at
          lectus. Dolor sit amet cons
        </p>

        <ol className="mb-6 ml-16 list-outside list-[upper-alpha] leading-[1.5em]">
          <li className="mb-1">This is a alphabetical list</li>
          <li className="mb-1">This is a alphabetical list</li>
          <li className="mb-1">This is a alphabetical list</li>
          <li className="mb-1">This is a alphabetical list</li>
        </ol>

        <p className="mb-6">
          Ut tellus elementum sagittis vitae. Pretium nibh ipsum consequat nisl
          vel pretium lectus. Rhoncus urna neque viverra justo nec ultrices dui.
          Nunc lobortis mattis aliquam faucibus purus in massa tempor. Morbi
          tristique senectus et netus. Id nibh tortor id aliquet. Mattis
          molestie a iaculis at erat. Dictum non consectetur a erat nam at
          lectus. Dolor sit amet consectetur adipiscing. Accumsan lacus vel
          facilisis volutpat est velit egestas dui. Tempor commodo ullamcorper a
          lacus vestibulum sed arcu. Odio tempor orci dapibus ultrices in. Arcu
          odio ut sem nulla pharetra diam sit amet. Malesuada fames ac turpis
          egestas maecenas pharetra convallis posuere morbi. Adipiscing enim eu
          turpis egestas pretium aenean. Posuere lorem ipsum dolor sit. Odio ut
          sem nulla pharetra diam sit amet nisl suscipit. Ornare arcu dui
          vivamus arcu. Habitant morbi tristique senectus et netus et.
        </p>

        <p className="mb-6">
          Convallis convallis tellus id interdum velit laoreet. Aliquam nulla
          facilisi cras fermentum. Id interdum velit laoreet id donec. Id diam
          vel quam elementum pulvinar. Consequat nisl vel pretium lectus. Eu
          augue ut lectus arcu bibendum at varius vel. Eget duis at tellus at.
          Vestibulum lectus mauris ultrices eros in cursus turpis massa
          tincidunt. Lorem ipsum dolor sit amet consectetur adipiscing elit ut
          aliquam. Dolor purus non enim praesent elementum facilisis leo. Neque
          viverra justo nec ultrices dui sapien eget. Quis varius quam quisque
          id diam vel quam. Velit egestas dui id ornare arcu odio ut sem. In
          pellentesque massa placerat duis ultricies lacus sed. Vestibulum
          lectus mauris ultrices eros in cursus turpis. Aliquam id diam maecenas
          ultricies.
        </p>

        <p className="mb-6">
          Eget nullam non nisi est. Ut pharetra sit amet aliquam id. Aliquam ut
          porttitor leo a diam sollicitudin tempor. Urna id volutpat lacus
          laoreet non curabitur. Neque viverra justo nec ultrices dui sapien
          eget mi proin. Risus in hendrerit gravida rutrum quisque. Elementum
          tempus egestas sed sed risus pretium quam vulputate dignissim. Cras
          semper auctor neque vitae tempus quam pellentesque nec nam. Turpis
          egestas maecenas pharetra convallis. Mollis aliquam ut porttitor leo a
          diam. Vestibulum lorem sed risus ultricies tristique nulla aliquet
          enim. Convallis aenean et tortor at. Nibh tortor id aliquet lectus
          proin nibh.
        </p>
      </section>

      <footer className="px-[var(--horizontal-gap)] py-4">
        <ul className="mb-8 flex gap-2">
          <li className="text-xs border-fg-contrast rounded-[2px] border-thin border-solid p-1 font-bold">
            Typescript
          </li>
          <li className="text-xs border-fg-contrast rounded-[2px] border-thin border-solid p-1 font-bold">
            Web Security
          </li>
          <li className="text-xs border-fg-contrast rounded-[2px] border-thin border-solid p-1 font-bold">
            DDOS attack
          </li>
          <li className="text-xs border-fg-contrast rounded-[2px] border-thin border-solid p-1 font-bold">
            CSRF Attacks
          </li>
          <li className="text-xs border-fg-contrast rounded-[2px] border-thin border-solid p-1 font-bold">
            Content Security Policies
          </li>
        </ul>
      </footer>
    </main>
  );
}
