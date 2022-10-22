const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

module.exports = {
  title: "Docusaurus Plugin Search Local",
  tagline: "Making local search easier and looking great!",
  url: "https://gabrielcsapo.github.io",
  baseUrl: "/docusaurus-plugin-search-local/",
  trailingSlash: true,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "gabrielcsapo",
  projectName: "docusaurus-plugin-search-local",
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/gabrielcsapo/docusaurus-plugin-search-local/edit/main",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/gabrielcsapo/docusaurus-plugin-search-local/edit/main",
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve("../"),
      /** @type {import('docusaurus-plugin-search-local').Options} */
      ({
        highlightSearchTermsOnTargetPage: true,
        externalSearchSources: [
          {
            heading: "Dummy External Source 1",
            uri: "/docusaurus-plugin-search-local/fixtures/index-1/",
          },
          {
            heading: "Dummy External Source 2",
            uri: "/docusaurus-plugin-search-local/fixtures/index-2/",
          },
        ],
      }),
    ],
  ],
  themeConfig: {
    navbar: {
      title: "docusaurus-plugin-search-local",
      logo: {
        alt: "docusaurus-plugin-search-local logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "/docs/getting-started",
          position: "left",
          label: "Documentation",
        },
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/gabrielcsapo/docusaurus-plugin-search-local",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Configuration",
              to: "/docs/getting-started",
            },
          ],
        },
        {},
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/gabrielcsapo/docusaurus-plugin-search-local",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Gabriel J. Csapo. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};
