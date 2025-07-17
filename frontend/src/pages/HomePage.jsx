export default function Homepage() {
    return (
      <section className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 flex flex-col items-center justify-center px-6 py-10 text-center">
        
        <div className="bg-blue-600 rounded-3xl px-8 py-10 shadow-2xl mb-10 max-w-4xl w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-snug tracking-tight">
            Track, Share, and Explore Student Projects
          </h1>
        </div>
  
        <h2 className="text-2xl md:text-3xl text-blue-800 font-semibold mb-5">
          Never Let a Great Project Be Forgotten
        </h2>
  
        <p className="text-gray-700 max-w-2xl mb-10 text-lg leading-relaxed">
          Project Tracker is your central hub to upload, browse, and revisit all student projects across Moringa School cohorts.
          Whether you're looking to get inspired, collaborate, or showcase your work — we've got you covered.
        </p>
  
        <button className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white text-lg px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105 duration-300">
          🚀 Get Started
        </button>
  
        <div className="mt-16">
          <img
            src="/colab.img"
            alt="Students collaborating"
            className="w-full max-w-md mx-auto rounded-xl shadow-xl"
          />
        </div>
      </section>
    );
  }
  