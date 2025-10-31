import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import type { ServiceHighlight, Testimonial, ServicePackageInfo } from '../types';
import Loader from '../components/Loader';
import GenericError from '../components/GenericError';
import BookingForm from '../components/BookingForm';
import { ADMIN_EMAIL_ADDRESS, ADMIN_PHONE_NUMBER_TEL_LINK_AUS, ADMIN_PHONE_NUMBER_TEL_LINK_INDIA, ADMIN_WHATSAPP_NUMBER_AUS, ADMIN_WHATSAPP_NUMBER_INDIA } from '../constants';
import ReactMarkdown from 'react-markdown';


// Custom hook for scroll animations
const useScrollAnimation = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const animationClasses = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';

    return [ref, animationClasses] as const;
};


// --- Hero Section ---
const HeroSection: React.FC<{ onBook: () => void }> = ({ onBook }) => (
  <section className="relative h-[60vh] md:h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center text-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop')" }}>
    <div className="absolute inset-0 bg-black/50"></div>
    <div className="relative z-10 p-4 animate-fade-in-up">
      <h1 className="text-4xl md:text-6xl font-serif font-bold drop-shadow-lg">Discover Your True Self</h1>
      <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow">Tailored insights through ancient wisdom and holistic practices.</p>
      <button onClick={onBook} className="mt-8 px-8 py-3 bg-primary-teal hover:bg-primary-teal-dark text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
        Request a Consultation
      </button>
    </div>
  </section>
);

// --- Service Highlight Card ---
const ServiceHighlightCard: React.FC<{ service: ServiceHighlight; onClick: () => void }> = ({ service, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" 
            style={{ backgroundColor: service.backgroundColor || '#F0FDF4' }}
        >
            <img src={service.iconUrl} alt={`${service.title} icon`} className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold font-serif text-center mb-2">{service.title}</h3>
            <p className="text-center text-gray-600 text-sm">{service.description}</p>
        </div>
    );
};

// --- Service Highlights Section ---
const ServiceHighlightsSection: React.FC<{ highlights: ServiceHighlight[], onCardClick: (service: ServiceHighlight) => void }> = ({ highlights, onCardClick }) => {
    const [ref, animationClasses] = useScrollAnimation();
    return(
        <section ref={ref} className={`py-16 bg-white transition-all duration-700 ease-out ${animationClasses}`}>
            <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-center text-primary-teal-dark mb-12">Our Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {highlights.map(service => (
                    <ServiceHighlightCard key={service.id} service={service} onClick={() => onCardClick(service)} />
                ))}
            </div>
            </div>
        </section>
    );
};

// --- Testimonials Section ---
const TestimonialsSection: React.FC<{ testimonials: Testimonial[] }> = ({ testimonials }) => {
    const [ref, animationClasses] = useScrollAnimation();
    return (
        <section ref={ref} className={`py-16 bg-surface-gold transition-all duration-700 ease-out ${animationClasses}`}>
            <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-center text-primary-teal-dark mb-12">Words of Transformation</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
                    <img src={t.imageUrl} alt={t.name} className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-accent-gold" />
                    <p className="text-gray-600 italic">"{t.testimonial}"</p>
                    <p className="font-bold mt-4">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                </div>
                ))}
            </div>
            </div>
        </section>
    );
};

// --- About Section ---
const AboutSection: React.FC = () => {
    const [ref, animationClasses] = useScrollAnimation();
    return (
        <section ref={ref} className={`py-16 bg-white transition-all duration-700 ease-out ${animationClasses}`}>
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="text-3xl font-serif font-bold text-primary-teal-dark mb-6">Meet Your Guide</h2>
                <p className="text-gray-600 leading-relaxed">
                    AvignaTattva is dedicated to guiding individuals towards self-discovery and holistic balance. With years of experience in ancient wisdom traditions and a compassionate approach, we empower you to navigate life's complexities with clarity and confidence. Our mission is to help you unlock your inherent potential and live a more harmonious and fulfilling life.
                </p>
                <p className="mt-4 font-serif italic text-primary-teal">
                    ~ The AvignaTattva Team ~
                </p>
            </div>
        </section>
    );
};

// --- Contact Section ---
const ContactSection: React.FC = () => {
    const [ref, animationClasses] = useScrollAnimation();
    const contactMethods = [
        { label: 'Email Us', href: `mailto:${ADMIN_EMAIL_ADDRESS}`, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg> },
        { label: 'Call (AUS)', href: ADMIN_PHONE_NUMBER_TEL_LINK_AUS, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg> },
        { label: 'WhatsApp (AUS)', href: `https://wa.me/${ADMIN_WHATSAPP_NUMBER_AUS}`, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.837 8.837 0 01-4.418-1.234l-1.396 1.396a.5.5 0 01-.707-.707l1.396-1.396A8.837 8.837 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.707 14.293a6.973 6.973 0 0011.586-5.586 6.973 6.973 0 00-11.586 5.586z" clipRule="evenodd" /></svg> },
        { label: 'Call (IND)', href: ADMIN_PHONE_NUMBER_TEL_LINK_INDIA, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg> },
        { label: 'WhatsApp (IND)', href: `https://wa.me/${ADMIN_WHATSAPP_NUMBER_INDIA}`, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.837 8.837 0 01-4.418-1.234l-1.396 1.396a.5.5 0 01-.707-.707l1.396-1.396A8.837 8.837 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.707 14.293a6.973 6.973 0 0011.586-5.586 6.973 6.973 0 00-11.586 5.586z" clipRule="evenodd" /></svg> },
    ];
    return (
        <section ref={ref} className={`py-16 bg-gray-50 transition-all duration-700 ease-out ${animationClasses}`}>
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-serif font-bold text-primary-teal-dark mb-6">Get In Touch</h2>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">Have questions or need assistance? We're here to help! Reach out through any of the methods below.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    {contactMethods.map(method => (
                        <a key={method.label} href={method.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary-teal hover:bg-primary-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-transform transform hover:scale-105">
                            {method.icon}
                            {method.label}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};


const Consultation: React.FC = () => {
  const [highlights, setHighlights] = useState<ServiceHighlight[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceHighlight | null>(null);


  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [highlightsData, testimonialsData] = await Promise.all([
        api.getServiceHighlights(),
        api.getTestimonials()
      ]);
      setHighlights(highlightsData);
      setTestimonials(testimonialsData);
    } catch (err) {
      setError("Failed to load page content. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleCardClick = (service: ServiceHighlight) => {
      setSelectedService(service);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (error) return <div className="container mx-auto my-8"><GenericError message={error} onRetry={fetchData} /></div>;

  return (
    <>
      <HeroSection onBook={() => setBookingModalOpen(true)} />
      <ServiceHighlightsSection highlights={highlights} onCardClick={handleCardClick} />
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      <AboutSection />
      <ContactSection />
      
      {isBookingModalOpen && (
        <Modal onClose={() => setBookingModalOpen(false)}>
            <BookingForm onSuccess={() => setBookingModalOpen(false)} />
        </Modal>
      )}

      {selectedService && (
        <Modal onClose={() => setSelectedService(null)}>
            <ServiceDetailDialog service={selectedService} />
        </Modal>
      )}
    </>
  );
};

// --- Generic Modal Component ---
const Modal: React.FC<{onClose: () => void; children: React.ReactNode}> = ({onClose, children}) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto animate-slide-in-up">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 z-10" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);

// --- Service Detail Dialog Content ---
const ServiceDetailDialog: React.FC<{ service: ServiceHighlight }> = ({ service }) => (
    <div>
        <h2 className="text-2xl font-serif font-bold text-primary-teal-dark mb-4">{service.title}</h2>
        <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{service.detailedDescription}</ReactMarkdown>
        </div>
        {service.packages.length > 0 && (
            <div className="mt-6">
                <h3 className="font-bold text-lg mb-2">Available Packages:</h3>
                <div className="space-y-4">
                    {service.packages.map((pkg: ServicePackageInfo) => (
                        <div key={pkg.name}>
                            <h4 className="font-semibold text-primary-teal">{pkg.name}</h4>
                            <ul className="list-disc list-inside text-gray-600 mt-1">
                                {pkg.features.map((feature, i) => <li key={i}>{feature}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  .animate-slide-in-up { animation: fadeInUp 0.4s ease-out forwards; }
  .animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = animationStyles;
document.head.appendChild(styleSheet);


export default Consultation;