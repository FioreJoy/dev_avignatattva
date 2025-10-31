
import React, { useState } from 'react';
import { api } from '../services/api';

interface BookingFormProps {
    onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [details, setDetails] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const bookingData = {
            Name: name,
            Email: email,
            Phone: phone,
            Details: details,
            Timestamp: new Date().toISOString(),
            Status: 'Pending',
        };

        try {
            const success = await api.submitBooking(bookingData);
            if (success) {
                setStatus('success');
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            } else {
                throw new Error('Submission failed. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
        }
    };
    
    if (status === 'success') {
        return (
            <div className="text-center p-8">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="mt-4 text-xl font-bold">Request Submitted!</h3>
                <p className="text-gray-600 mt-2">We will be in touch with you shortly.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-center text-primary-teal-dark">Request a Consultation</h2>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal" />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal" />
            </div>
            <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
                <textarea id="details" value={details} onChange={e => setDetails(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal" placeholder="Any specific concerns or questions?"></textarea>
            </div>
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <button type="submit" disabled={status === 'loading'} className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-teal hover:bg-primary-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal disabled:bg-gray-400">
                {status === 'loading' ? 'Submitting...' : 'Submit Request'}
            </button>
        </form>
    );
};

export default BookingForm;
