"use client";
import { useForm, ValidationError } from "@formspree/react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BsLinkedin, BsGithub } from "react-icons/bs";
import { HiMailOpen } from "react-icons/hi";

const inputClass =
  "block w-full rounded-lg border border-white/10 bg-white/[0.05] p-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200";

const FormspreeContactForm = ({ formId }) => {
  const [show, setShow] = useState(false);
  const [state, handleSubmit] = useForm(formId);
  const [formData, setFormData] = useState({ email: "", subject: "", message: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (state.succeeded) {
      setShow(true);
      setFormData({ email: "", subject: "", message: "" });
    }
  }, [state.succeeded]);

  if (show) {
    return (
      <p className="text-sm text-gray-300 leading-relaxed">
        Thank you for reaching out! I&apos;ll get back to you as soon as possible.
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-400 uppercase tracking-wider">
          Your email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
          placeholder="you@example.com"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-xs font-medium text-gray-400 uppercase tracking-wider">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className={inputClass}
          placeholder="Just saying hi"
        />
        <ValidationError prefix="Subject" field="subject" errors={state.errors} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-gray-400 uppercase tracking-wider">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className={inputClass}
          placeholder="Let's talk about..."
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />
      </div>
      <button
        type="submit"
        disabled={state.submitting}
        className="w-full rounded-full border border-blue-500/40 bg-blue-500/10 px-5 py-2.5 text-sm font-medium text-blue-300 transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-400/60 hover:text-white disabled:opacity-50"
      >
        {state.submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
};

const socialLinks = [
  {
    href: "https://www.linkedin.com/in/joel-oguntade",
    icon: BsLinkedin,
    label: "LinkedIn",
  },
  {
    href: "https://github.com/Jhay-web52",
    icon: BsGithub,
    label: "GitHub",
  },
  {
    href: "mailto:joeloguntade256@gmail.com",
    icon: HiMailOpen,
    label: "Email",
  },
];

const Contact = () => {
  const refHeading = useRef(null);
  const inViewHeading = useInView(refHeading);
  const refContent = useRef(null);
  const inViewContent = useInView(refContent, { once: true });

  const formId = process.env.NEXT_PUBLIC_FORM_ID;

  return (
    <section className="sm:px-6 sm:pt-[80px]" id="contact">
      <motion.div
        ref={refHeading}
        initial={{ opacity: 0, y: 50 }}
        animate={inViewHeading ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        <h3 className="gradient-heading text-3xl font-[800] sm:text-5xl">Get In Touch</h3>
        <div className="mt-2 h-[4px] min-w-0 flex-grow bg-gradient-to-r from-blue-500/40 via-purple-500/20 to-transparent" />
      </motion.div>

      <div
        ref={refContent}
        className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 py-8"
      >
        {/* Left – info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inViewContent ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between gap-6"
        >
          <div>
            <h5 className="text-2xl font-bold text-white md:text-3xl">
              Why be shy, say hi
            </h5>
            <p className="mt-3 text-sm leading-relaxed text-gray-400 max-w-sm">
              I&apos;m open to new opportunities and look forward to connecting
              with you. Whether you have a project in mind or just want to say
              hello, feel free to reach out.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-sm text-gray-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right – form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inViewContent ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-blue-500/20 transition-colors duration-300"
        >
          {formId ? (
            <FormspreeContactForm formId={formId} />
          ) : (
            <p className="text-sm text-gray-400">
              The contact form is not configured right now. You can still reach
              me via email using the button on the left.
            </p>
          )}
        </motion.div>
      </div>

      <footer className="flex items-center text-center pb-6">
        <span className="mx-auto text-sm text-gray-500">
          © {new Date().getFullYear()} — made with ❤️ by Joel Oguntade
        </span>
      </footer>
    </section>
  );
};

export default Contact;
