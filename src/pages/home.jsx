import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { useApp } from '../context/appContext'
import Services from '../components/landingPage/services';
import Testimonials from '../components/landingPage/testimonials';
import AboutUs from '../components/landingPage/aboutUs';
import Contact from '../components/landingPage/contact';
import Faqs from '../components/landingPage/faqs';
import Hero from '../components/landingPage/hero';
import CTA from '../components/landingPage/cta';
import ChatbotNav from '../components/chatbotNav';

function Homepage() {
  const { user } = useApp()
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.sectionId) {
      scroller.scrollTo(location.state.sectionId, {
        smooth: true,
        duration: 500,
      });
    }
  }, [location.state]);

  return (
    <div>
      <Hero user={user}/>
      {user && <ChatbotNav />}
      <section id="about"><AboutUs /></section>
      <section id="services"><Services /></section>
      <section id="testimonials"><Testimonials /></section>
      <CTA user={user}/>
      <section id="contact"><Contact /></section>
      <section id="faqs"><Faqs /></section>
    </div>
  )
}

export default Homepage