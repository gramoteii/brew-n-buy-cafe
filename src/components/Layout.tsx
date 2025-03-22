
import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex-1 container-custom pt-20 pb-12"
      >
        {children}
      </motion.main>
      <footer className="bg-cream-100 border-t border-border py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Кофе & Чай</h3>
              <p className="text-muted-foreground text-sm">
                Наслаждайтесь качественными напитками из свежих ингредиентов. Доставка по всему городу.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Контакты</h3>
              <p className="text-muted-foreground text-sm">Email: info@coffee-tea.com</p>
              <p className="text-muted-foreground text-sm">Телефон: +7 (123) 456-78-90</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Время работы</h3>
              <p className="text-muted-foreground text-sm">Пн-Пт: 8:00 - 20:00</p>
              <p className="text-muted-foreground text-sm">Сб-Вс: 9:00 - 18:00</p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2023 Кофе & Чай. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
