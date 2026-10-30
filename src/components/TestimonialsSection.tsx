import React from 'react';
import type { Testimonial } from '../types';
import { Star, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF6F0] border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#B93838]">
            Kata Mereka yang Telah Mencoba
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C1810]">
            Cerita Manis dari Pelanggan Setia
          </h2>
          <p className="text-sm text-[#705346]">
            Kepuasan rasa dan senyum di setiap perayaan Anda adalah pencapaian tertinggi bagi dapur kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testi) => (
            <div
              key={testi.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DFD5] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testi.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#E8DFD5]" />
                </div>

                <p className="text-sm text-[#5C4033] leading-relaxed italic mb-6">
                  "{testi.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0E6D8] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2C1810]">{testi.customerName}</h4>
                  <p className="text-xs text-[#8C7368]">{testi.roleOrEvent}</p>
                </div>
                <span className="text-[11px] text-[#A68F83]">{testi.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
