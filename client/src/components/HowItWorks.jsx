import React from 'react';
import { FileEdit, Share2, Landmark, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    number: "01",
    title: "Create Your Fundraiser",
    desc: "Fill out a simple 2-minute form with patient details, hospital estimate bills, and target goal amount. It's completely free to start.",
    icon: FileEdit
  },
  {
    number: "02",
    title: "Share with Community",
    desc: "Share your fundraiser link easily across WhatsApp, Instagram, Facebook, and email. Our team helps amplify your story to reach donors.",
    icon: Share2
  },
  {
    number: "03",
    title: "Withdraw Funds Directly",
    desc: "Transfer the raised funds seamlessly to your hospital or personal bank account in less than 24 hours at 0% platform fee.",
    icon: Landmark
  }
];

export default function HowItWorks() {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Simple & Fast</span>
          <h2 className="section-title">Start a Fundraiser in 3 Simple Steps</h2>
          <p className="section-subtitle">
            Ketto makes online crowdfunding transparent, effortless, and 100% free.
          </p>
        </div>

        <div className="steps-grid">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon-wrap">
                  <Icon size={28} />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
