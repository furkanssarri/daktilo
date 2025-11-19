import { FaGithub } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t py-6 text-center text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-5"
      role="contentinfo"
    >
      <a
        href="https://github.com/furkanssarri"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open GitHub profile of furkanssarri in a new tab"
        className="flex items-center gap-2 hover:text-foreground transition-colors"
      >
        <FaGithub className="w-4 h-4" aria-hidden="true" />
        <span className="font-medium">furkanssarri</span>
      </a>
      <span className="text-muted-foreground">•</span>
      <span>© Daktilo Blog {currentYear}</span>
    </footer>
  );
};

export default Footer;
