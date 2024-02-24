import { BsCalendar2Date } from "react-icons/bs";

import { BreadCrumb } from "@/app/_components/Breadcrumb";

import "./Article.styles.css";
import Image from "next/image";

export default function Article() {
  return (
    <main className="article-wrapper">
      <section className="article-cover">
        <Image
          src="/images/projects/gameboy_tetris.jpeg"
          alt="some text"
          width="1024"
          height="400"
        />
      </section>

      <header className="article-header">
        <BreadCrumb
          options={[
            { path: "/", label: "Home" },
            { path: "/#words", label: "Words" },
            { label: "Current" },
          ]}
        />

        <h1>This is going to be a randomly generated blog. Beware!!</h1>

        <ul className="article-meta">
          <li className="article-author">
            <Image
              src="/images/projects/gameboy_tetris.jpeg"
              alt="some text"
              width="32"
              height="32"
            />
            <a href="/about">Ankush Jamdagani</a>
          </li>

          <li className="article-date">
            <BsCalendar2Date /> <time>{new Date().toDateString()}</time>
          </li>
        </ul>
      </header>

      <section className="article-content">
        <blockquote cite="https://www.huxley.net/bnw/four.html">
          <h3>TLDR;</h3>
          <p>
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

        <div className="line-seperator"></div>

        <p>
          Lorem ipsum dolor sit amet,{" "}
          <code className="code-inline">conse c t et ur</code> adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Nisl nunc mi ipsum faucibus vitae aliquet. risus nec feugiat in
          fermentum posuere. Neque sodales ut etiam sit. Vulputate eu
          scelerisque felis imperdiet proin fermentum leo vel. Consectetur purus
          ut faucibus pulvinar elementum. Enim sit amet venenatis urna cursus.
          Porta non pulvinar neque laoreet suspendisse interdum consectetur.
          Auctor urna nunc id cursus metus aliquam eleifend. Quam{" "}
          <a>pellentesque</a>
          nec nam aliquam sem et tortor consequat id.
        </p>

        <code className="code-block">
          def test(): print("this is block code")
        </code>

        <p>
          Mauris in aliquam sem fringilla ut morbi tincidunt augue interdum.
          Nibh mauris cursus mattis molestie a iaculis at erat. Enim neque
          volutpat ac tincidunt vitae semper quis lectus. Tellus mauris a diam
          maecenas sed enim ut sem. Imperdiet nulla malesuada pellentesque elit
          eget gravida cum. Laoreet id donec ultrices tincidunt arcu non sodales
          neque. Lacus vel facilisis volutpat est velit. Tellus orci ac auctor
          augue. Mattis nunc sed blandit libero
        </p>

        <h2>Some random heading</h2>

        <figure>
          <Image
            src="/images/projects/gameboy_tetris.jpeg"
            alt="some text"
            width="400"
            height="400"
          />
          <figcaption>An elephant at sunset</figcaption>
        </figure>

        <p>
          Mauris in aliquam sem fringilla ut morbi tincidunt augue interdum.
          Nibh mauris cursus mattis molestie a iaculis at erat. Enim neque
          volutpat ac tincidunt vitae semper quis lectus. Tellus mauris a diam
          maecenas sed enim ut sem. Imperdiet nulla malesuada pellentesque elit
          eget gravida cum. Laoreet id donec ultrices tincidunt arcu non sodales
          neque. Lacus vel facilisis volutpat est velit. Tellus orci ac auctor
          augue. Mattis nunc sed blandit libero
        </p>

        <blockquote cite="https://www.huxley.net/bnw/four.html">
          <p>
            Words can be like X-rays, if you use them properly—they’ll go
            through anything. You read and you’re pierced.
          </p>
          <footer>
            —Aldous Huxley, <cite>Brave New World</cite>
          </footer>
        </blockquote>

        <p>
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

        <ul className="list-bullet">
          <li>This is a bulleted list</li>
          <li>This is a bulleted list</li>
          <li>This is a bulleted list</li>
          <li>This is a bulleted list</li>
        </ul>

        <p>
          Ut tellus elementum sagittis vitae. Pretium nibh ipsum consequat nisl
          vel pretium lectus. Rhoncus urna neque viverra justo nec ultrices dui.
          Nunc lobortis mattis aliquam faucibus purus in massa tempor. Morbi
          tristique senectus et netus. Id nibh tortor id aliquet. Mattis
          molestie a iaculis at erat. Dictum non consectetur a erat nam at
          lectus. Dolor sit amet cons
        </p>

        <ol className="list-numbered">
          <li>This is a numbered list</li>
          <li>This is a numbered list</li>
          <li>This is a numbered list</li>
          <li>This is a numbered list</li>
        </ol>

        <p>
          Ut tellus elementum sagittis vitae. Pretium nibh ipsum consequat nisl
          vel pretium lectus. Rhoncus urna neque viverra justo nec ultrices dui.
          Nunc lobortis mattis aliquam faucibus purus in massa tempor. Morbi
          tristique senectus et netus. Id nibh tortor id aliquet. Mattis
          molestie a iaculis at erat. Dictum non consectetur a erat nam at
          lectus. Dolor sit amet cons
        </p>

        <ol className="list-alpha">
          <li>This is a alphabetical list</li>
          <li>This is a alphabetical list</li>
          <li>This is a alphabetical list</li>
          <li>This is a alphabetical list</li>
        </ol>

        <p>
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

        <p>
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

        <p>
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

      <footer className="article-footer">
        <ul className="tags-wrapper">
          <li className="tag">Typescript</li>
          <li className="tag">Web Security</li>
          <li className="tag">DDOS attack</li>
          <li className="tag">CSRF Attacks</li>
          <li className="tag">Content Security Policies</li>
        </ul>
      </footer>
    </main>
  );
}
