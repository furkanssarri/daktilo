import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SocialButtons } from "@/components/custom/SocialButtons";
import { useScrollFadeIn } from "../../hooks/useScrollFadeIn.ts";

const About = () => {
  const background = useScrollFadeIn();
  const skills = useScrollFadeIn();
  const interests = useScrollFadeIn();
  const contact = useScrollFadeIn();

  return (
    <div className="mx-auto mt-5 max-w-4xl space-y-24 rounded-sm border px-6 py-16">
      {/* Hero / Intro Section */}
      <section className="flex flex-col items-center space-y-6 text-center">
        <div className="group relative">
          <img
            src="/src/assets/me.jpg"
            alt="Furkan portrait"
            className="border-muted fade-in h-40 w-40 rounded-full border-4 object-cover"
          />
          <div className="group-hover:ring-primary/40 absolute inset-0 rounded-full ring-2 ring-transparent transition-all duration-300" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold sm:text-5xl">About Me</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            I’m Furkan — an aspiring full-stack web developer who loves turning
            ideas into interactive experiences. This page is a little glimpse
            into who I am, what I do, and what I’m learning along the way.
          </p>
        </div>
      </section>

      {/* Quick Facts Section */}
      <section className="mt-10 flex flex-wrap justify-center gap-6">
        <div className="bg-muted/50 hover-float fade-in flex items-center space-x-2 rounded-md px-4 py-2 shadow-sm transition delay-1 hover:shadow">
          <span className="text-xl">🌍</span>
          <p className="text-muted-foreground text-sm font-medium">
            Based in Istanbul
          </p>
        </div>

        <div className="bg-muted/50 hover-float fade-in flex items-center space-x-2 rounded-md px-4 py-2 shadow-sm transition delay-2 hover:shadow">
          <span className="text-xl">⚛️</span>
          <p className="text-muted-foreground text-sm font-medium">
            Learning React & TypeScript
          </p>
        </div>

        <div className="bg-muted/50 hover-float fade-in flex items-center space-x-2 rounded-md px-4 py-2 shadow-sm transition delay-3 hover:shadow">
          <span className="text-xl">☕</span>
          <p className="text-muted-foreground text-sm font-medium">
            Fueled by coffee
          </p>
        </div>

        <div className="bg-muted/50 hover-float fade-in flex items-center space-x-2 rounded-md px-4 py-2 shadow-sm transition delay-4 hover:shadow">
          <span className="text-xl">🎮</span>
          <p className="text-muted-foreground text-sm font-medium">
            Gamer & puzzle enthusiast
          </p>
        </div>
      </section>

      <Separator />

      {/* Background Section */}
      <section
        ref={background.ref}
        className={`scroll-fade space-y-6 ${background.isVisible ? "visible" : ""}`}
      >
        <h2 className="text-2xl font-semibold">My Journey</h2>
        <p className="text-muted-foreground leading-relaxed">
          I started coding out of curiosity — wondering how websites actually
          *worked*. What began as tweaking HTML templates quickly turned into a
          love for building things from scratch. Since then, I’ve been learning
          React, Node.js, TypeScript, and other modern tools that make the web
          come alive.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Beyond the code, I enjoy problem-solving and teaching myself new
          skills through projects. This blog is where I share those lessons and
          document my progress as I grow into a full-stack developer.
        </p>
      </section>

      <Separator />

      {/* Skills Section */}
      <section
        ref={skills.ref}
        className={`scroll-fade space-y-6 ${skills.isVisible ? "visible" : ""}`}
      >
        <h2 className="text-2xl font-semibold">Tech Stack</h2>
        <p className="text-muted-foreground">
          These are some of the technologies I’m currently learning and using:
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary">JavaScript (ESNext)</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">React + Vite</Badge>
          <Badge variant="secondary">Node.js</Badge>
          <Badge variant="secondary">Express</Badge>
          <Badge variant="secondary">Prisma ORM</Badge>
          <Badge variant="secondary">Tailwind CSS</Badge>
          <Badge variant="secondary">Shadcn UI</Badge>
        </div>
      </section>

      <Separator />

      {/* Personal Interests Section */}
      <section
        ref={interests.ref}
        className={`scroll-fade space-y-6 ${interests.isVisible ? "visible" : ""}`}
      >
        <h2 className="text-2xl font-semibold">Outside of Code</h2>
        <p className="text-muted-foreground leading-relaxed">
          When I’m not building or learning, I like to step away from the
          keyboard — you’ll often find me reading, hiking, or rock climbing.
          Exploring new challenges keeps my creativity fresh and my problem
          solving sharp.
        </p>
      </section>

      <Separator />

      {/* Contact / CTA Section */}
      <section
        ref={contact.ref}
        className={`scroll-fade space-y-4 text-center ${contact.isVisible ? "visible" : ""}`}
      >
        <h2 className="text-2xl font-semibold">Let’s Connect</h2>
        <p className="text-muted-foreground">
          I’d love to meet fellow developers, share experiences, or collaborate
          on something new. You can find me on the platforms below 👇
        </p>
        <div className="flex justify-center pt-2">
          <SocialButtons />
        </div>
      </section>
    </div>
  );
};

export default About;
