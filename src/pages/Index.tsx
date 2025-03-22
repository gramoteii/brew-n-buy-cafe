
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import FeaturedProducts from '../components/FeaturedProducts';
import Button from '../components/Button';
import { products } from '../data/products';

const Index = () => {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter featured products
  const popularProducts = products.filter(product => 
    product.tags.includes('popular')
  ).slice(0, 4);
  
  const newProducts = products.filter(product => 
    product.tags.includes('new')
  ).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-6">
              Откройте для себя <br />
              <span className="text-primary">идеальный</span> кофе
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              Насладитесь нашими премиальными напитками, приготовленными из лучших ингредиентов со всего мира.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg">Наши продукты</Button>
              </Link>
              <Link to="/products?category=coffee">
                <Button variant="outline" size="lg">Кофе</Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop" 
                alt="Coffee shop" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Floating accent elements */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-cream-100 rounded-full opacity-80 -z-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-coffee-100 rounded-full opacity-80 -z-10"></div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-secondary rounded-xl my-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Почему выбирают нас</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Мы стремимся предоставить вам самые лучшие кофейные и чайные напитки, приготовленные с любовью и заботой.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Высокое качество",
                description: "Мы используем только лучшие зерна и листья, обжаренные и обработанные с особой тщательностью.",
                icon: (
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Быстрая доставка",
                description: "Доставляем ваши любимые напитки и товары в кратчайшие сроки, сохраняя их свежесть и аромат.",
                icon: (
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: "Уникальные рецепты",
                description: "Наши бариста разрабатывают особые рецепты, чтобы каждый напиток был неповторимым и запоминающимся.",
                icon: (
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm glass-panel"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Products */}
      <FeaturedProducts 
        title="Популярные продукты" 
        products={popularProducts} 
      />
      
      {/* New Products */}
      <FeaturedProducts 
        title="Новинки" 
        products={newProducts} 
      />
      
      {/* CTA Section */}
      <section className="my-12 py-16 bg-coffee-100 rounded-xl relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Подпишитесь на наши обновления
            </h2>
            <p className="text-muted-foreground mb-8">
              Получайте информацию о новых продуктах, акциях и специальных предложениях.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 rounded-l-lg p-3 border border-r-0 border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button className="sm:rounded-l-none">Подписаться</Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-coffee-200 rounded-full opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cream-200 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
      </section>
    </Layout>
  );
};

export default Index;
