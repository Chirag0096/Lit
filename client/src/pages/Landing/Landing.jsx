import React, { useEffect, useState } from 'react'
import './Landing.css';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import SecureImg from '../../assets/Secure.svg';
import Encrypted from '../../assets/Encrypted.svg';
import Analysis from '../../assets/Analysis.svg';

const Landing = () => {
  return (
    <React.Fragment>
      <main>
        <header>
          <div className="logo"><img  src={Logo}/></div>
          <ul className="flex gap-8 justify-center items-center px-6">
            <Link href="/app">App</Link>  
            <Link href="#why-us">Why us?</Link>  
            <Link href="#features">Features</Link>  
            <Link href="https://www.google.com">Blogs</Link>  
            <Link href="https://github.com/prakhar728/NodeZilla">About</Link>  
          </ul>
        </header>
        <section>
          <div className="hero-container">
            <h1>Your Secure Path to Smarter Healthcare</h1>
            <p>A cutting-edge healthcare assistant app that ensures privacy with AI-driven medical support and blockchain security</p>
            <div className="btn-container">
              <button className="btn-primary"><Link to="/app">Go to app</Link></button>
              {/* <button className="btn-secondary"><Link href="https://nodezilla.onrender.com/docs">Explore API</Link></button> */}
            </div>
            <div className="label">
              <p>Total Scans initiated</p>
              <h2>1035</h2>
            </div>
          </div>
        </section>
      </main>

      <article className="cards-section" id="why-us">
        <h1>Why Documed?</h1>
        <div className="card-container">
          <div className="card">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#fff" fill="none"><path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h4>Ultimate Data Privacy</h4>
            <p>DocuMed ensures your medical data is fully encrypted, safeguarding your information at every step.</p>
          </div>
          <div className="card">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#fff" fill="none"><path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h4>Reliable AI Insights</h4>
            <p>Trust in advanced AI technology to provide accurate and timely medical support tailored to your needs.</p>
          </div>
          <div className="card">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#fff" fill="none"><path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h4>Cutting-Edge Security</h4>
            <p>Combining blockchain and AI, DocuMed offers unparalleled security and confidentiality in healthcare assistance.</p>
          </div>
        </div>
      </article>
      
      <article className="features" id="features">
        <div className="feature-wrapper">
          <div className="feature-info">
            <h2>1. Secure Health Queries</h2>
            <p>End-to-end encrypted AI-driven responses for all your health-related questions.</p>
          </div>
          <div className="feature-img"><img src={SecureImg} /></div>
        </div>

        <div className="feature-wrapper">
          <div className="feature-info">
            <h2>2. Encrypted Prescriptions</h2>
            <p>Safely upload and interpret handwritten prescriptions with secure data handling</p>
            {/* <ul>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
            </ul> */}
          </div>
          <div className="feature-img"><img src={Encrypted} /></div>
        </div>

        <div className="feature-wrapper">
          <div className="feature-info">
            <h2>3. Confidential Scan Analysis</h2>
            <p> Get AI insights on brain scans while ensuring complete data privacy.</p>
            
          </div>
          <div className="feature-img"><img src={Analysis} /></div>
        </div>
      </article>

      <footer>
        <div className="logo"><img  src={Logo}/></div>
        <ul className="flex gap-8 justify-center items-center px-6">
          <a href="https://www.google.com">Solutions</a>  
          <a href="https://www.google.com">Developers</a>  
          <a href="https://www.google.com">Ecosystem</a>  
          <a href="https://www.google.com">Blogs</a>  
          <a href="https://www.google.com">About</a>  
        </ul>
      </footer>
    </React.Fragment>
  )
}

export default Landing