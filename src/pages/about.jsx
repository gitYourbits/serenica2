import React from 'react'
import AboutUs from '../components/landingPage/aboutUs'


function About() {
  return (
    <section className='about'>
    <AboutUs aboutPage={true} />
    <div className='section-body'>
      <p>Welcome to Terapeuta, a trusted source for professional therapy services. Our team of experienced therapists is dedicated to providing compassionate and effective care to help you achieve your mental health and wellness goals.</p>
      <p>At Terapeuta, we understand that life can be challenging, and everyone experiences struggles at some point. We provide a safe and supportive environment for our clients to explore their thoughts and feelings, and we offer personalized treatment plans to meet each client's unique needs.</p>
      <p>Our therapists are highly trained and licensed professionals who specialize in a range of therapeutic techniques, including cognitive-behavioral therapy, solution-focused therapy, and mindfulness-based therapy. We believe that therapy is a collaborative process, and we work closely with our clients to develop personalized goals and strategies to achieve lasting change.</p>
      <p>At Terapeuta, we are committed to fostering a culture of inclusivity, respect, and understanding. We strive to create a welcoming and supportive environment for clients of all backgrounds, cultures, and identities.</p>
      <p>We know that taking the first step towards therapy can be intimidating, but we are here to support you every step of the way. Whether you are seeking individual therapy, couples therapy, or family therapy, we are dedicated to helping you find the path towards healing and growth.</p>
      <p>Thank you for considering Terapeuta as your partner in your mental health journey. We look forward to working with you and helping you achieve your goals.</p>
    </div>
    </section>
  )
}

export default About