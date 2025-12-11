export default function WhyChooseUs() {
  const cards = [
    {
      title: 'Delicious',
      desc: 'We taste-test everything we sell for the yumminess factor!',
      img: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1600&auto=format&fit=crop',
    },
    {
      title: 'Healthy',
      desc: 'The widest range of organic, safe, special diets and rare products.',
      img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600&auto=format&fit=crop',
    },
    {
      title: 'Fresh',
      desc: 'We work with producers to deliver the freshest goodies in tip-top condition.',
      img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1600&auto=format&fit=crop',
    },
  ]

  return (
    <section className="mx-auto max-w-6xl px-8 md:px-12 py-10 text-center">
      <h2
        className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1"
        style={{ fontFamily: '"Dancing Script", cursive', color: '#008000' }}
      >
        Why Choose Our Products?
      </h2>
      <p className="text-sm sm:text-base text-gray-700">
        Over <span className="font-semibold text-gray-900">5,000</span> delicious products, 100% vetted for quality and impact
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-3 items-start">
        {cards.map((card) => (
          <div key={card.title} className="flex flex-col items-center">
            <div className="h-44 w-full overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/5">
              <img
                src={card.img}
                alt={card.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <p
              className="mt-4 text-lg sm:text-xl font-semibold"
              style={{ fontFamily: '"Dancing Script", cursive', color: '#008000' }}
            >
              {card.title}
            </p>
            <p className="mt-1 max-w-sm text-[13px] sm:text-sm text-gray-600">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
