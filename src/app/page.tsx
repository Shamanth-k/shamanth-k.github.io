// import FloatingTech from "@/components/FloatingTech/FloatingTech";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Skills from "@/components/Skills/Skills";
import EducationExperience from "@/components/EducationExperience/EducationExperience";
import Projects from "@/components/Projects/Projects";
import Playground from "@/components/Playground/Playground";
import Contact from "@/components/Contact/Contact";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import ScrollAnimator from "@/components/ScrollAnimator/ScrollAnimator";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <SmoothScroll />
      <ScrollAnimator />
      {/* <FloatingTech /> */}

      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <EducationExperience />
        <Projects />
        <Playground />
        <Contact />
      </div>
    </main>
  );
}
