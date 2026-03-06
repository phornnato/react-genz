import HeroSlider from '../sections/HeroSlider';
import AboutTeam from '../sections/AboutTeam';
import DevTools from '../sections/DevTools';
import Videos from '../sections/Videos';
import Courses from '../sections/Courses';
import Contact from '../sections/Contact';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AboutTeam />
      <DevTools />
      <Videos />
      <Courses />
      <Contact />
    </>
  );
}
