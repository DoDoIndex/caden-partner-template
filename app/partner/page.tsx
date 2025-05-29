'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const benefits = [
    {
        title: 'Revenue Growth',
        description: 'Expand your market reach and increase sales through our extensive partner network',
        icon: '📈'
    },
    {
        title: 'Expert Support',
        description: 'Receive training and professional support from our experienced team',
        icon: '🎓'
    },
    {
        title: 'Advanced Technology',
        description: 'Access modern technology solutions and professional management platforms',
        icon: '💻'
    }
];

const steps = [
    {
        title: 'Register',
        description: 'Fill out the partner registration form',
        number: '01'
    },
    {
        title: 'Interview',
        description: 'Discuss partnership opportunities in detail',
        number: '02'
    },
    {
        title: 'Sign Up',
        description: 'Complete the process and start partnership',
        number: '03'
    }
];

export default function PartnerPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/partner-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit registration');
            }

            toast.success('Registration submitted successfully!');
            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phoneNumber: '',
                companyName: '',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit registration');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-amber-100">
            {/* Hero Section */}
            <section className="relative h-[60vh] bg-gradient-to-r from-stone-800 to-stone-900">
                <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-900" />
                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="text-white max-w-2xl p-5">
                        <h1 className="text-5xl font-bold mb-6">Become Our Partner</h1>
                        <p className="text-xl mb-8">
                            Let's build the future together and create sustainable value
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-stone-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-stone-900">Benefits of Partnership</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-white p-8 rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition-shadow"
                            >
                                <div className="text-4xl mb-4">{benefit.icon}</div>
                                <h3 className="text-xl font-semibold mb-3 text-stone-900">{benefit.title}</h3>
                                <p className="text-stone-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-stone-900">Partnership Process</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="relative"
                            >
                                <div className="bg-amber-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-stone-900">{step.title}</h3>
                                <p className="text-stone-600">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20 bg-amber-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12 text-stone-900">Partner Registration</h2>
                        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-stone-200">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white h-32"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-amber-500 text-white py-3 rounded-lg font-semibold transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-600'
                                    }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
} 