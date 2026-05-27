import React from "react";

const articles = [
  {
    id: "001",
    title: "This is the title for blog 1",
    date: "Apr 2026",
    duration: "9 min",
  },
  {
    id: "002",
    title: "This is the title for blog 2",
    date: "Feb 2026",
    duration: "6 min",
  },
  {
    id: "003",
    title: "This is the title for blog 3 and this can be long too",
    date: "Nov 2025",
    duration: "14 min",
  },
  {
    id: "004",
    title: "This is the title for blog 4 and this can be long too",
    date: "Aug 2025",
    duration: "5 min",
  },
  {
    id: "005",
    title: "This is the title for blog 5 and this can be long too",
    date: "May 2025",
    duration: "8 min",
  },
  {
    id: "006",
    title: "This is the title for blog 6",
    date: "Mar 2025",
    duration: "7 min",
  },
];

export const LedgerWriting = () => {
  return (
    <section className="mb-24 scroll-mt-32 relative" id="writing">
      <div className="absolute -left-72 opacity-[0.03] pointer-events-none select-none">
        <span className="text-[14rem] font-serif leading-none italic">02</span>
      </div>

      <div className="flex items-center gap-4 mb-6 relative z-base">
        <span className="text-[11px] font-medium text-fg-muted opacity-40">
          /
        </span>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.4em] text-fg-contrast">
          Writing
        </h2>
        {/* <div className="flex-grow h-px bg-ledger-outline opacity-30 [filter:url(#ledger-rough)]"></div> */}
      </div>
      <div className="space-y-0 relative z-base">
        {articles.map((article) => (
          <div
            key={article.id}
            className="group flex justify-between items-center py-4 dot-line hover:translate-x-2 transition-transform duration-300"
          >
            <div className="flex items-center gap-8">
              <span className="text-[11px] font-medium text-fg-muted opacity-30">
                {article.id}
              </span>
              <a
                className="text-xl md:text-2xl text-fg-contrast italic font-ledger-serif hover:text-fg transition-colors"
                href={`/work/articles/${article.id}`}
              >
                {article.title}
              </a>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-medium text-fg-muted">
              <span className="hidden md:inline">{article.date}</span>
              <span className="opacity-30">/</span>
              <span>{article.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
