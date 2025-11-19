const Contact = () => {
  return (
    <div className="space-y-24 border rounded-sm mt-5">
      {/* Intro Section */}
      <section className="max-w-3xl mx-auto text-center pt-16 pb-24 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Let’s Connect</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          I’d love to hear from you — whether you have a question, a project
          idea, or just want to chat about web development. Feel free to drop me
          a message anytime!
        </p>

        {/* Contact Details */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-lg">
          <a
            href="mailto:furkan@example.com"
            className="text-primary hover:underline"
          >
            furkan@example.com
          </a>
          <span className="hidden sm:block text-muted-foreground">•</span>
          <div className="flex gap-4">
            <a
              href="https://github.com/furkansari"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/furkansari"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Send a Message
        </h2>

        <form className="flex flex-col space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Your name"
            className="border rounded-md p-3 bg-background focus:ring-2 focus:ring-primary outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            className="border rounded-md p-3 bg-background focus:ring-2 focus:ring-primary outline-none"
          />
          <textarea
            name="message"
            rows={5}
            placeholder="Your message"
            className="border rounded-md p-3 bg-background focus:ring-2 focus:ring-primary outline-none"
          ></textarea>
          <button
            type="submit"
            className="bg-primary text-primary-foreground font-medium py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
